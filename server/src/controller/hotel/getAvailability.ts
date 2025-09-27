import { Request, Response, NextFunction } from "express";
import mongoose, { Types } from "mongoose";
import { HotelModel } from "../../models/Hotel";
import { ReservationModel } from "../../models/Reservation";

function parseDateOnly(key?: string): Date | undefined {
  if (!key) return undefined;
  const d = new Date(`${key}T00:00:00Z`);
  return isNaN(+d) ? undefined : d;
}

export async function getAvailability(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { hotelId } = req.params;
    const { roomType, from, to } = req.query as Record<string, string>;
    if (!mongoose.isValidObjectId(hotelId))
      return res.status(400).json({ error: "Invalid hotel id" });
    if (!roomType || !from || !to)
      return res.status(400).json({ error: "Missing roomType/from/to" });

    const start = parseDateOnly(from);
    const end = parseDateOnly(to);
    if (!start || !end || end <= start)
      return res.status(400).json({ error: "Invalid date range" });

    const hotel = await HotelModel.findById(hotelId).lean();
    if (!hotel) return res.status(404).json({ error: "Hotel not found" });

    const roomInfo = (hotel as any).rooms?.find(
      (r: any) => String(r.name).toLowerCase() === roomType.toLowerCase()
    );
    if (!roomInfo)
      return res
        .status(400)
        .json({ error: "Room type not available in hotel" });

    const overlap = await ReservationModel.aggregate<{ qty: number }>([
      {
        $match: {
          hotel: new Types.ObjectId(hotelId),
          roomType: roomType, // stored as Room.name
          status: { $in: ["PENDING", "CONFIRMED"] },
          from: { $lt: end },
          to: { $gt: start },
        },
      },
      { $group: { _id: null, qty: { $sum: "$quantity" } } },
      { $project: { _id: 0, qty: 1 } },
    ]);

    const alreadyBooked = overlap[0]?.qty ?? 0;
    const totalRooms = Number(
      roomInfo.totalRooms ?? roomInfo.availableRooms ?? roomInfo.totalUnits ?? 0
    );
    const available = Math.max(0, totalRooms - alreadyBooked);

    res.json({
      hotelId,
      roomType,
      from: start.toISOString(),
      to: end.toISOString(),
      totalRooms,
      booked: alreadyBooked,
      available,
      pricePerNight: roomInfo.pricePerNight,
    });
  } catch (err) {
    next(err);
  }
}

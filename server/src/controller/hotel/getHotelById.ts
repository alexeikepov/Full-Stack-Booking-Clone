import { Request, Response, NextFunction } from "express";
import mongoose, { Types } from "mongoose";
import { HotelModel } from "../../models/Hotel";
import { ReservationModel } from "../../models/Reservation";

function parseDateOnly(key?: string): Date | undefined {
  if (!key) return undefined;
  const d = new Date(`${key}T00:00:00Z`);
  return isNaN(+d) ? undefined : d;
}

export async function getHotelById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const {
      from,
      to,
      adults,
      children,
      rooms: requestedRooms,
    } = req.query as Record<string, string | undefined>;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ error: "Invalid hotel id" });
    const h = await HotelModel.findById(id).lean();
    if (!h) return res.status(404).json({ error: "Hotel not found" });

    const start = parseDateOnly(from);
    const end = parseDateOnly(to);
    const hasRange = !!(start && end && end > start);
    let bookedByType: Record<string, number> = {};
    if (hasRange) {
      const overlaps = await ReservationModel.aggregate<{
        _id: string;
        qty: number;
      }>([
        {
          $match: {
            hotel: new Types.ObjectId(id),
            status: { $in: ["PENDING", "CONFIRMED"] },
            from: { $lt: end! },
            to: { $gt: start! },
          },
        },
        { $group: { _id: "$roomType", qty: { $sum: "$quantity" } } },
      ]);
      for (const r of overlaps) bookedByType[r._id] = r.qty;
    }

    // Parse guest parameters (same logic as in listHotels)
    const toNum = (x?: string) => {
      const n = Number(x);
      return Number.isFinite(n) ? n : undefined;
    };

    const numAdults = toNum(adults) ?? 2;
    const numChildren = toNum(children) ?? 0;
    const totalGuests = Math.max(1, numAdults + numChildren);
    const numRequestedRooms = requestedRooms
      ? Math.max(1, parseInt(requestedRooms, 10) || 1)
      : 1;

    const rooms = ((h as any).rooms ?? []).map((r: any) => {
      // Use room name for lookup in bookedByType (reservation.roomType is stored as room.name)
      const roomName = String(r.name);
      // Try different field names for total rooms (prioritize totalRooms as it's the main field)
      const total = Number(
        r.totalRooms ?? r.availableRooms ?? r.totalUnits ?? 0
      );
      const booked = hasRange ? Number(bookedByType[roomName] ?? 0) : 0;
      const available = Math.max(0, total - booked);

      // Room price should not change based on guest count
      const basePrice = Number(r.pricePerNight) || 0;
      const roomCapacity = Number(r.capacity) || 1;

      // Calculate how many rooms of this type are needed for the guests
      const roomsNeeded = Math.ceil(totalGuests / roomCapacity);
      const roomsToUse = Math.min(roomsNeeded, available);

      // Price per room stays the same regardless of guest count
      const pricePerRoom = basePrice;
      const pricePerNight = basePrice;

      return {
        ...r,
        totalUnits: total,
        availableUnits: hasRange ? available : total,
        pricePerNight: pricePerNight, // Base room price (unchanged)
        originalPrice: basePrice, // Same as pricePerNight
        roomsNeeded: roomsNeeded,
        roomsToUse: roomsToUse,
        pricePerRoom: pricePerRoom,
      };
    });

    const cheapestNightly = Math.min(
      ...rooms.map((r: any) => r.pricePerNight || Infinity)
    );

    (h as any).priceFrom = Number.isFinite(cheapestNightly)
      ? cheapestNightly
      : null;
    (h as any).averageRating = (h as any).averageRating ?? 8.5;
    (h as any).reviewsCount = (h as any).reviewsCount ?? 372;
    (h as any).rooms = rooms;

    res.json(h);
  } catch (err) {
    next(err);
  }
}

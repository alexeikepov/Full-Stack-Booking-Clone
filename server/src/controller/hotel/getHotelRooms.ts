import { Request, Response, NextFunction } from "express";
import mongoose, { Types } from "mongoose";
import { HotelModel } from "../../models/Hotel";
import { ReservationModel } from "../../models/Reservation";

function parseDateOnly(key?: string): Date | undefined {
  if (!key) return undefined;
  const d = new Date(`${key}T00:00:00Z`);
  return isNaN(+d) ? undefined : d;
}

export async function getHotelRooms(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { hotelId } = req.params;
    const { from, to } = req.query as Record<string, string | undefined>;
    if (!mongoose.isValidObjectId(hotelId))
      return res.status(400).json({ error: "Invalid hotel id" });

    const hotel = await HotelModel.findById(hotelId).lean();
    if (!hotel) return res.status(404).json({ error: "Hotel not found" });

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
            hotel: new Types.ObjectId(hotelId),
            status: { $in: ["PENDING", "CONFIRMED"] },
            from: { $lt: end! },
            to: { $gt: start! },
          },
        },
        { $group: { _id: "$roomType", qty: { $sum: "$quantity" } } },
      ]);
      for (const r of overlaps) bookedByType[r._id] = r.qty;
    }

    const rooms = ((hotel as any).rooms ?? []).map((r: any) => {
      const key = String(r.name);
      const total = Number(
        r.totalRooms ?? r.availableRooms ?? r.totalUnits ?? 0
      );
      const booked = hasRange ? Number(bookedByType[key] ?? 0) : 0;
      const available = Math.max(0, total - booked);
      return {
        _id: r._id || r.id,
        id: r._id || r.id,
        name: r.name,
        roomType: r.roomType || key,
        roomCategory: r.roomCategory || "Standard",
        capacity: r.capacity || 2,
        maxAdults: r.maxAdults || 2,
        maxChildren: r.maxChildren || 0,
        pricePerNight: r.pricePerNight,
        sizeSqm: r.sizeSqm || 0,
        bedrooms: r.bedrooms || 1,
        bathrooms: r.bathrooms || 1,
        totalRooms: total,
        availableRooms: hasRange ? available : total,
        amenities: r.amenities || [],
        facilities: r.facilities || [],
        categories: r.categories || [],
        features: r.features || [],
        specialFeatures: r.specialFeatures || {},
        pricing: r.pricing || {
          basePrice: r.pricePerNight,
          currency: "₪",
          freeCancellation: true,
          noPrepayment: true,
          priceMatch: false,
        },
        photos: r.photos || [],
        media: r.media || [],
      };
    });

    res.json({
      hotelId,
      availabilityRange: hasRange
        ? { from: start!.toISOString(), to: end!.toISOString() }
        : undefined,
      rooms,
    });
  } catch (err) {
    next(err);
  }
}

import { Request, Response, NextFunction } from "express";
import mongoose, { Types } from "mongoose";
import { z } from "zod";
import { HotelModel } from "../models/Hotel";
import { ReservationModel } from "../models/Reservation";
import { AuthedRequest } from "../middlewares/auth";

const roomSchema = z.object({
  roomType: z.enum(["STANDARD", "DELUXE", "SUITE"]),
  pricePerNight: z.number().nonnegative(),
  totalRooms: z.number().int().nonnegative(),
  availableRooms: z.number().int().nonnegative().optional(),
});

const createHotelSchema = z.object({
  name: z.string().min(2),
  city: z.string().min(2),
  address: z.string().min(2),
  location: z
    .object({
      coordinates: z.tuple([z.number(), z.number()]), // [lng, lat]
    })
    .optional(),
  description: z.string().optional(),
  amenities: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  rooms: z.array(roomSchema).min(1),
});

const updateHotelSchema = createHotelSchema.partial();

// Create
export async function createHotel(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const dto = createHotelSchema.parse(req.body);
    const doc = await HotelModel.create({
      ...dto,
      location: dto.location
        ? { type: "Point", coordinates: dto.location.coordinates }
        : undefined,
      owner: req.user?.id,
    });
    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
}

// List with basic filters: q (text), city, minPrice, maxPrice, roomType
export async function listHotels(req: Request, res: Response, next: NextFunction) {
  try {
    const { q, city, roomType, minPrice, maxPrice } = req.query as Record<string, string | undefined>;

    const filter: any = {};
    if (q) filter.$text = { $search: q };
    if (city) filter.city = city;

    const priceClauses: any[] = [];
    if (minPrice) priceClauses.push({ "rooms.pricePerNight": { $gte: Number(minPrice) } });
    if (maxPrice) priceClauses.push({ "rooms.pricePerNight": { $lte: Number(maxPrice) } });
    if (priceClauses.length) filter.$and = [...(filter.$and || []), ...priceClauses];

    if (roomType) filter["rooms.roomType"] = roomType;

    const hotels = await HotelModel.find(filter).sort({ ratingAvg: -1, createdAt: -1 }).lean();
    res.json(hotels);
  } catch (err) {
    next(err);
  }
}

// Read
export async function getHotelById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: "Invalid hotel id" });

    const h = await HotelModel.findById(id).lean();
    if (!h) return res.status(404).json({ error: "Hotel not found" });
    res.json(h);
  } catch (err) {
    next(err);
  }
}

// Update (owner/admin)
export async function updateHotel(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: "Invalid hotel id" });

    const dto = updateHotelSchema.parse(req.body);

    const h = await HotelModel.findById(id);
    if (!h) return res.status(404).json({ error: "Hotel not found" });

    if (dto.location?.coordinates) {
      (dto as any).location = { type: "Point", coordinates: dto.location.coordinates };
    }

    Object.assign(h, dto);
    await h.save();

    res.json(h);
  } catch (err) {
    next(err);
  }
}

// Delete (owner/admin)
export async function deleteHotel(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: "Invalid hotel id" });

    const h = await HotelModel.findById(id);
    if (!h) return res.status(404).json({ error: "Hotel not found" });

    await h.deleteOne();
    res.json({ message: "Hotel deleted" });
  } catch (err) {
    next(err);
  }
}

// GET /api/hotels/:hotelId/availability?roomType=SUITE&from=2025-09-10&to=2025-09-12
export async function getAvailability(req: Request, res: Response, next: NextFunction) {
  try {
    const { hotelId } = req.params;
    const { roomType, from, to } = req.query as Record<string, string>;

    if (!mongoose.isValidObjectId(hotelId)) {
      return res.status(400).json({ error: "Invalid hotel id" });
    }
    if (!roomType || !from || !to) {
      return res.status(400).json({ error: "Missing roomType/from/to" });
    }

    const start = new Date(from);
    const end = new Date(to);
    if (isNaN(+start) || isNaN(+end) || end <= start) {
      return res.status(400).json({ error: "Invalid date range" });
    }

    const hotel = await HotelModel.findById(hotelId).lean();
    if (!hotel) return res.status(404).json({ error: "Hotel not found" });

    const roomInfo = (hotel as any).rooms?.find((r: any) => r.roomType === roomType);
    if (!roomInfo) return res.status(400).json({ error: "Room type not available in hotel" });

    const overlap = await ReservationModel.aggregate<{ qty: number }>([
      {
        $match: {
          hotel: new Types.ObjectId(hotelId),
          roomType,
          status: { $in: ["PENDING", "CONFIRMED"] },
          from: { $lt: end },
          to: { $gt: start },
        },
      },
      { $group: { _id: null, qty: { $sum: "$quantity" } } },
      { $project: { _id: 0, qty: 1 } },
    ]);

    const alreadyBooked = overlap[0]?.qty ?? 0;
    const totalRooms = roomInfo.totalRooms ?? 0;
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

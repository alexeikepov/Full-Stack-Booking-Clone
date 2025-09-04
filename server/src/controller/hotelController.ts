// src/controller/hotelController.ts
import { Request, Response, NextFunction } from "express";
import mongoose, { Types } from "mongoose";
import { z } from "zod";
import { HotelModel } from "../models/Hotel";
import { ReservationModel } from "../models/Reservation";
import { ReviewModel } from "../models/Review";
import { AuthedRequest } from "../middlewares/auth";

// ---------- Zod DTOs ----------
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
  title: z.string().optional(),
  description: z.string().optional(),
  amenities: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
  rooms: z.array(roomSchema).min(1),
});

const updateHotelSchema = createHotelSchema.partial();

const reviewCreateSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(2000).optional().default(""),
});

const reviewUpdateSchema = reviewCreateSchema.partial();

// ---------- Helpers ----------
async function recomputeHotelRating(hotelId: string | Types.ObjectId) {
  const agg = await ReviewModel.aggregate<{ _id: null; avg: number; count: number }>([
    { $match: { hotel: new Types.ObjectId(hotelId) } },
    {
      $group: {
        _id: null,
        avg: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  const avg = agg[0]?.avg ?? 0;
  const count = agg[0]?.count ?? 0;

  await HotelModel.findByIdAndUpdate(hotelId, {
    ratingAvg: Number(avg.toFixed(2)),
    ratingCount: count,
  });
}

// ---------- Create ----------
export async function createHotel(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const dto = createHotelSchema.parse(req.body);
    const doc = await HotelModel.create({
      ...dto,
      location: dto.location ? { type: "Point", coordinates: dto.location.coordinates } : undefined,
      owner: req.user?.id,
    });
    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
}

// ---------- List (filters: q, city, roomType, minPrice, maxPrice, category) ----------
export async function listHotels(req: Request, res: Response, next: NextFunction) {
  try {
    const { q, city, roomType, minPrice, maxPrice, category } = req.query as Record<
      string,
      string | undefined
    >;

    const filter: any = {};
    if (q) filter.$text = { $search: q };
    if (city) filter.city = city;

    if (category) {
      filter.categories = { $in: category.split(",").map((s) => s.trim()).filter(Boolean) };
    }

    const priceClauses: any[] = [];
    if (minPrice) priceClauses.push({ "rooms.pricePerNight": { $gte: Number(minPrice) } });
    if (maxPrice) priceClauses.push({ "rooms.pricePerNight": { $lte: Number(maxPrice) } });
    if (priceClauses.length) filter.$and = [...(filter.$and || []), ...priceClauses];

    if (roomType) filter["rooms.roomType"] = roomType;

    const hotels = await HotelModel.find(filter)
      .sort({ ratingAvg: -1, createdAt: -1 })
      .lean();
    res.json(hotels);
  } catch (err) {
    next(err);
  }
}

// ---------- Read ----------
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

// ---------- Update (owner/admin) ----------
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

// ---------- Delete (owner/admin) ----------
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

// ---------- Availability ----------
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

// ---------- Reviews ----------

// --- My reviews: list all of the authenticated user's reviews ---
export async function getMyReviews(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { page = "1", limit = "10" } = req.query as Record<string, string>;
    const p = Math.max(1, parseInt(page, 10) || 1);
    const l = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));

    const [items, total] = await Promise.all([
      ReviewModel.find({ user: userId })
        .populate({ path: "hotel", select: "name city ratingAvg ratingCount images" })
        .sort({ createdAt: -1 })
        .skip((p - 1) * l)
        .limit(l)
        .lean(),
      ReviewModel.countDocuments({ user: userId }),
    ]);

    res.json({
      items,
      page: p,
      limit: l,
      total,
      pages: Math.ceil(total / l),
    });
  } catch (err) {
    next(err);
  }
}

// --- My review for specific hotel ---
export async function getMyReviewForHotel(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { hotelId } = req.params;
    if (!mongoose.isValidObjectId(hotelId)) {
      return res.status(400).json({ error: "Invalid hotel id" });
    }

    const review = await ReviewModel.findOne({ hotel: hotelId, user: userId })
      .populate({ path: "hotel", select: "name city ratingAvg ratingCount images" })
      .lean();

    if (!review) return res.status(404).json({ error: "Review not found" });
    res.json(review);
  } catch (err) {
    next(err);
  }
}

// POST /api/hotels/:hotelId/reviews  (create; only one per user per hotel)
export async function createReview(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const { hotelId } = req.params;
    if (!mongoose.isValidObjectId(hotelId)) {
      return res.status(400).json({ error: "Invalid hotel id" });
    }
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const dto = reviewCreateSchema.parse(req.body);

    // Enforce one review per user per hotel
    const exists = await ReviewModel.findOne({ hotel: hotelId, user: userId }).lean();
    if (exists) return res.status(409).json({ error: "User already reviewed this hotel" });

    const review = await ReviewModel.create({
      hotel: hotelId,
      user: userId,
      rating: dto.rating,
      comment: dto.comment,
    });

    // Attach to hotel.reviews (optional; can be derived)
    await HotelModel.findByIdAndUpdate(hotelId, { $addToSet: { reviews: review._id } });

    await recomputeHotelRating(hotelId);

    res.status(201).json(review);
  } catch (err) {
    // unique index safety net
    if ((err as any)?.code === 11000) {
      return res.status(409).json({ error: "User already reviewed this hotel" });
    }
    next(err);
  }
}

// PATCH /api/hotels/:hotelId/reviews/me  (update own review)
export async function updateMyReview(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const { hotelId } = req.params;
    if (!mongoose.isValidObjectId(hotelId)) {
      return res.status(400).json({ error: "Invalid hotel id" });
    }
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const dto = reviewUpdateSchema.parse(req.body);

    const review = await ReviewModel.findOneAndUpdate(
      { hotel: hotelId, user: userId },
      { $set: { ...dto } },
      { new: true }
    );
    if (!review) return res.status(404).json({ error: "Review not found" });

    await recomputeHotelRating(hotelId);

    res.json(review);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/hotels/:hotelId/reviews/me  (delete own review)
export async function deleteMyReview(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const { hotelId } = req.params;
    if (!mongoose.isValidObjectId(hotelId)) {
      return res.status(400).json({ error: "Invalid hotel id" });
    }
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const review = await ReviewModel.findOneAndDelete({ hotel: hotelId, user: userId });
    if (!review) return res.status(404).json({ error: "Review not found" });

    // Optionally remove from hotel.reviews
    await HotelModel.findByIdAndUpdate(hotelId, { $pull: { reviews: review._id } });

    await recomputeHotelRating(hotelId);

    res.json({ message: "Review deleted" });
  } catch (err) {
    next(err);
  }
}

// GET /api/hotels/:hotelId/reviews  (list)
export async function listReviews(req: Request, res: Response, next: NextFunction) {
  try {
    const { hotelId } = req.params;
    if (!mongoose.isValidObjectId(hotelId)) {
      return res.status(400).json({ error: "Invalid hotel id" });
    }

    const reviews = await ReviewModel.find({ hotel: hotelId })
      .populate({ path: "user", select: "name _id" })
      .sort({ createdAt: -1 })
      .lean();

    res.json(reviews);
  } catch (err) {
    next(err);
  }
}

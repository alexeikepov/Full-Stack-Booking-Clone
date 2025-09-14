// src/controller/hotelController.ts
import { Request, Response, NextFunction } from "express";
import mongoose, { Types } from "mongoose";
import { z } from "zod";
import { HotelModel } from "../models/Hotel";
import { ReservationModel } from "../models/Reservation";
import { ReviewModel } from "../models/Review";
import { AuthedRequest } from "../middlewares/auth";
import { saveLastSearch } from "../services/searchHistoryService";

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
      coordinates: z.tuple([z.number(), z.number()]),
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

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function recomputeHotelRating(hotelId: string | Types.ObjectId) {
  const agg = await ReviewModel.aggregate<{ _id: null; avg: number; count: number }>([
    { $match: { hotel: new Types.ObjectId(hotelId) } },
    { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);
  const avg = agg[0]?.avg ?? 0;
  const count = agg[0]?.count ?? 0;
  await HotelModel.findByIdAndUpdate(hotelId, {
    ratingAvg: Number(avg.toFixed(2)),
    ratingCount: count,
  });
}

function parseDateOnly(key?: string): Date | undefined {
  if (!key) return undefined;
  const d = new Date(`${key}T00:00:00Z`);
  return isNaN(+d) ? undefined : d;
}

function nightsBetween(start: Date, end: Date): number {
  return Math.max(1, Math.ceil((+end - +start) / (1000 * 60 * 60 * 24)));
}

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

export async function listHotels(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const {
      q,
      city,
      roomType,
      minPrice,
      maxPrice,
      category,
      categoriesMode,
      from,
      to,
      adults,
      children,
      rooms,
      sort,
      minStars,
      maxStars,
    } = req.query as Record<string, string | undefined>;

    const filter: any = {};
    if (q) filter.$text = { $search: q };
    if (city) filter.city = { $regex: `^${escapeRegExp(city)}$`, $options: "i" };

    if (minStars || maxStars) {
      filter.stars = {};
      if (minStars) filter.stars.$gte = Number(minStars);
      if (maxStars) filter.stars.$lte = Number(maxStars);
    }

    if (category) {
      const cats = category.split(",").map((s) => s.trim()).filter(Boolean);
      if (cats.length) {
        if ((categoriesMode ?? "or") === "and") {
          filter.categories = { $all: cats.map((c) => new RegExp(`^${escapeRegExp(c)}$`, "i")) };
        } else {
          filter.categories = { $in: cats.map((c) => new RegExp(`^${escapeRegExp(c)}$`, "i")) };
        }
      }
    }

    const priceClauses: any[] = [];
    if (minPrice) priceClauses.push({ "rooms.pricePerNight": { $gte: Number(minPrice) } });
    if (maxPrice) priceClauses.push({ "rooms.pricePerNight": { $lte: Number(maxPrice) } });
    if (priceClauses.length) filter.$and = [...(filter.$and || []), ...priceClauses];

    if (roomType) {
      filter["rooms.roomType"] = new RegExp(`^${escapeRegExp(roomType)}$`, "i");
    }

    const requestedRooms = rooms ? Math.max(1, parseInt(rooms, 10) || 1) : 1;

    if (req.user?.id) {
      saveLastSearch(req.user.id, {
        city,
        from,
        to,
        adults: adults ? Number(adults) : undefined,
        children: children ? Number(children) : undefined,
        rooms: requestedRooms,
      }).catch(() => {});
    }

    const hotels = await HotelModel.find(filter).sort({ ratingAvg: -1, createdAt: -1 }).lean();

    const start = parseDateOnly(from);
    const end = parseDateOnly(to);
    const hasValidRange = !!(start && end && end > start);
    const nights = hasValidRange ? nightsBetween(start!, end!) : null;

    let bookedByHotel: Record<string, Record<string, number>> = {};
    if (hasValidRange) {
      const overlaps = await ReservationModel.aggregate<{
        _id: { hotel: Types.ObjectId; roomType: string };
        qty: number;
      }>([
        { $match: { status: { $in: ["PENDING", "CONFIRMED"] }, from: { $lt: end! }, to: { $gt: start! } } },
        { $group: { _id: { hotel: "$hotel", roomType: "$roomType" }, qty: { $sum: "$quantity" } } },
      ]);
      for (const row of overlaps) {
        const hid = String(row._id.hotel);
        if (!bookedByHotel[hid]) bookedByHotel[hid] = {};
        bookedByHotel[hid][row._id.roomType] = row.qty;
      }
    }

    const enriched = hotels
      .map((h: any) => {
        const hid = String(h._id);
        const roomsArr = Array.isArray(h.rooms) ? h.rooms : [];

        const availableByType: Record<string, number> = {};
        let totalAvailable = 0;

        for (const r of roomsArr) {
          const typeKey = String(r.roomType);
          const total = Number(r.totalRooms ?? 0);
          const bookedQty = hasValidRange ? bookedByHotel[hid]?.[typeKey] ?? 0 : 0;
          const avail = Math.max(0, total - bookedQty);
          availableByType[typeKey] = hasValidRange ? avail : total;
          totalAvailable += hasValidRange ? avail : total;
        }

        let cheapestNightly: number | null = null;
        for (const r of roomsArr) {
          const typeKey = String(r.roomType);
          const matchesType = roomType ? new RegExp(`^${escapeRegExp(roomType)}$`, "i").test(typeKey) : true;
          if (!matchesType) continue;
          const nightly = Number(r.pricePerNight);
          if (!Number.isFinite(nightly)) continue;
          const availForType = availableByType[typeKey] ?? 0;
          if (availForType < requestedRooms) continue;
          if (cheapestNightly === null || nightly < cheapestNightly) cheapestNightly = nightly;
        }

        const out: any = {
          ...h,
          priceFrom: Number.isFinite(cheapestNightly as number) ? (cheapestNightly as number) : null,
          totalPrice:
            hasValidRange && cheapestNightly != null ? Number((cheapestNightly * (nights as number)).toFixed(2)) : null,
          availability: hasValidRange
            ? {
                from: start!.toISOString(),
                to: end!.toISOString(),
                availableByType,
                totalAvailable,
              }
            : undefined,
        };

        if (roomType) {
          const rt = roomType.toLowerCase();
          const hasEnough = Object.entries(availableByType).some(
            ([k, v]) => k.toLowerCase() === rt && v >= requestedRooms
          );
          return hasEnough ? out : null;
        }
        if (hasValidRange) {
          return totalAvailable >= requestedRooms ? out : null;
        }
        return out;
      })
      .filter(Boolean) as any[];

    let result = enriched;
    switch (sort) {
      case "price_low":
        result = [...result].sort((a, b) => (a.priceFrom ?? Infinity) - (b.priceFrom ?? Infinity));
        break;
      case "price_high":
        result = [...result].sort((a, b) => (b.priceFrom ?? -Infinity) - (a.priceFrom ?? -Infinity));
        break;
      case "rating":
        result = [...result].sort((a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0));
        break;
      case "stars":
        result = [...result].sort((a, b) => (b.stars ?? 0) - (a.stars ?? 0));
        break;
      default:
        break;
    }

    res.json(result);
  } catch (err) {
    next(err);
  }
}

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

export async function getAvailability(req: Request, res: Response, next: NextFunction) {
  try {
    const { hotelId } = req.params;
    const { roomType, from, to } = req.query as Record<string, string>;
    if (!mongoose.isValidObjectId(hotelId)) return res.status(400).json({ error: "Invalid hotel id" });
    if (!roomType || !from || !to) return res.status(400).json({ error: "Missing roomType/from/to" });

    const start = parseDateOnly(from);
    const end = parseDateOnly(to);
    if (!start || !end || end <= start) return res.status(400).json({ error: "Invalid date range" });

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

export async function getHotelRooms(req: Request, res: Response, next: NextFunction) {
  try {
    const { hotelId } = req.params;
    const { from, to } = req.query as Record<string, string | undefined>;
    if (!mongoose.isValidObjectId(hotelId)) return res.status(400).json({ error: "Invalid hotel id" });

    const hotel = await HotelModel.findById(hotelId).lean();
    if (!hotel) return res.status(404).json({ error: "Hotel not found" });

    const start = parseDateOnly(from);
    const end = parseDateOnly(to);
    const hasRange = !!(start && end && end > start);

    let bookedByType: Record<string, number> = {};
    if (hasRange) {
      const overlaps = await ReservationModel.aggregate<{ _id: string; qty: number }>([
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

    const rooms = (hotel as any).rooms.map((r: any) => {
      const total = Number(r.totalRooms ?? 0);
      const booked = hasRange ? Number(bookedByType[r.roomType] ?? 0) : 0;
      const available = Math.max(0, total - booked);
      return {
        roomType: r.roomType,
        pricePerNight: r.pricePerNight,
        totalRooms: total,
        availableRooms: hasRange ? available : total,
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

export async function listCategories(req: Request, res: Response, next: NextFunction) {
  try {
    const rows = await HotelModel.aggregate<{ _id: string; count: number }>([
      { $unwind: { path: "$categories", preserveNullAndEmptyArrays: false } },
      { $group: { _id: "$categories", count: { $sum: 1 } } },
      { $sort: { count: -1, _id: 1 } },
    ]);
    res.json(rows.map((r) => ({ id: r._id, label: r._id, count: r.count })));
  } catch (err) {
    next(err);
  }
}

export async function suggestCities(req: Request, res: Response, next: NextFunction) {
  try {
    const { q } = req.query as Record<string, string | undefined>;
    const filter: any = {};
    if (q) filter.city = { $regex: escapeRegExp(q), $options: "i" };
    const rows = await HotelModel.aggregate<{ _id: string; count: number }>([
      { $match: filter },
      { $group: { _id: "$city", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);
    res.json(rows.map((r) => ({ city: r._id, count: r.count })));
  } catch (err) {
    next(err);
  }
}

export async function facetsSnapshot(req: Request, res: Response, next: NextFunction) {
  try {
    const { city } = req.query as Record<string, string | undefined>;
    const filter: any = {};
    if (city) filter.city = { $regex: `^${escapeRegExp(city)}$`, $options: "i" };

    const categories = await HotelModel.aggregate<{ _id: string; count: number }>([
      { $match: filter },
      { $unwind: "$categories" },
      { $group: { _id: "$categories", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const stars = await HotelModel.aggregate<{ _id: number; count: number }>([
      { $match: filter },
      { $group: { _id: "$stars", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      categories: categories.map((c) => ({ id: c._id, label: c._id, count: c.count })),
      stars: stars
        .filter((s) => s._id != null)
        .map((s) => ({ id: String(s._id), label: `${s._id} stars`, count: s.count })),
    });
  } catch (err) {
    next(err);
  }
}

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

    res.json({ items, page: p, limit: l, total, pages: Math.ceil(total / l) });
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

export async function getMyReviewForHotel(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { hotelId } = req.params;
    if (!mongoose.isValidObjectId(hotelId)) return res.status(400).json({ error: "Invalid hotel id" });

    const review = await ReviewModel.findOne({ hotel: hotelId, user: userId })
      .populate({ path: "hotel", select: "name city ratingAvg ratingCount images" })
      .lean();

    if (!review) return res.status(404).json({ error: "Review not found" });
    res.json(review);
  } catch (err) {
    next(err);
  }
}

export async function createReview(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const { hotelId } = req.params;
    if (!mongoose.isValidObjectId(hotelId)) return res.status(400).json({ error: "Invalid hotel id" });
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const dto = reviewCreateSchema.parse(req.body);

    const exists = await ReviewModel.findOne({ hotel: hotelId, user: userId }).lean();
    if (exists) return res.status(409).json({ error: "User already reviewed this hotel" });

    const review = await ReviewModel.create({
      hotel: hotelId,
      user: userId,
      rating: dto.rating,
      comment: dto.comment,
    });

    await HotelModel.findByIdAndUpdate(hotelId, { $addToSet: { reviews: review._id } });
    await recomputeHotelRating(hotelId);

    res.status(201).json(review);
  } catch (err) {
    if ((err as any)?.code === 11000) {
      return res.status(409).json({ error: "User already reviewed this hotel" });
    }
    next(err);
  }
}

export async function updateMyReview(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const { hotelId } = req.params;
    if (!mongoose.isValidObjectId(hotelId)) return res.status(400).json({ error: "Invalid hotel id" });
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

export async function deleteMyReview(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const { hotelId } = req.params;
    if (!mongoose.isValidObjectId(hotelId)) return res.status(400).json({ error: "Invalid hotel id" });
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const review = await ReviewModel.findOneAndDelete({ hotel: hotelId, user: userId });
    if (!review) return res.status(404).json({ error: "Review not found" });

    await HotelModel.findByIdAndUpdate(hotelId, { $pull: { reviews: review._id } });
    await recomputeHotelRating(hotelId);

    res.json({ message: "Review deleted" });
  } catch (err) {
    next(err);
  }
}

// src/controller/hotelController.ts
import { Request, Response, NextFunction } from "express";
import mongoose, { Types } from "mongoose";
import { z } from "zod";
import { HotelModel } from "../models/Hotel";
import { ReservationModel } from "../models/Reservation";
import { ReviewModel } from "../models/Review";
import { AuthedRequest } from "../middlewares/auth";
import { saveLastSearch } from "../services/searchHistoryService";
import type { Hotel, Room } from "../types/hotel.types";

const roomSchema = z.object({
  // roomType is the UI/API label; stored as Room.name in DB
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
      coordinates: z.tuple([z.number(), z.number()]), // [lng, lat] from client
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
  rating: z.number().int().min(1).max(10),
  comment: z.string().max(2000).optional().default(""),

  // Guest info
  guestName: z.string().min(1).max(100),
  guestCountry: z.string().min(1).max(100),
  guestInitial: z.string().min(1).max(5),

  // Detailed ratings
  categoryRatings: z
    .object({
      staff: z.number().int().min(1).max(10).optional(),
      comfort: z.number().int().min(1).max(10).optional(),
      freeWifi: z.number().int().min(1).max(10).optional(),
      facilities: z.number().int().min(1).max(10).optional(),
      valueForMoney: z.number().int().min(1).max(10).optional(),
      cleanliness: z.number().int().min(1).max(10).optional(),
      location: z.number().int().min(1).max(10).optional(),
    })
    .optional(),

  // Stay details
  stayDate: z.string().optional(),
  roomType: z.string().optional(),
  travelType: z
    .enum(["BUSINESS", "LEISURE", "COUPLE", "FAMILY", "FRIENDS", "SOLO"])
    .optional(),
});

const reviewUpdateSchema = reviewCreateSchema.partial();

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function recomputeHotelRating(hotelId: string | Types.ObjectId) {
  const agg = await ReviewModel.aggregate<{
    _id: null;
    avg: number;
    count: number;
  }>([
    { $match: { hotel: new Types.ObjectId(hotelId) } },
    { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);
  const avg = agg[0]?.avg ?? 0;
  const count = agg[0]?.count ?? 0;
  await HotelModel.findByIdAndUpdate(hotelId, {
    averageRating: Number(avg.toFixed(2)),
    reviewsCount: count,
  });
}

function parseDateOnly(key?: string): Date | undefined {
  if (!key) return undefined;
  const d = new Date(`${key}T00:00:00Z`);
  return isNaN(+d) ? undefined : d;
}

export async function createHotel(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const dto = createHotelSchema.parse(req.body);

    const loc = dto.location?.coordinates
      ? { lat: dto.location.coordinates[1], lng: dto.location.coordinates[0] }
      : undefined;

    const normalizedRooms =
      dto.rooms?.map((r) => ({
        name: r.roomType,
        pricePerNight: r.pricePerNight,
        totalRooms: r.totalRooms,
      })) ?? [];

    const doc = await HotelModel.create({
      name: dto.name,
      city: dto.city,
      address: dto.address,
      location: loc,
      description: dto.description,
      categories: dto.categories,
      media: dto.images?.map((src) => ({ src })) ?? [],
      rooms: normalizedRooms,
      ownerId: req.user?.id,
    });

    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
}

export async function listHotels(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const {
      q,
      city,
      roomType,
      minPrice,
      maxPrice,
      category,
      from,
      to,
      adults,
      children,
      rooms,
      sort,
      minStars,
      maxStars,
    } = req.query as Record<string, string | undefined>;

    const rxEq = (s: string) => new RegExp(`^${escapeRegExp(s)}$`, "i");
    const toNum = (x?: string) => {
      const n = Number(x);
      return Number.isFinite(n) ? n : undefined;
    };

    const filter: any = {};
    if (q) filter.$text = { $search: q };
    if (city?.trim()) filter.city = { $regex: rxEq(city.trim()) };

    const minS = toNum(minStars);
    const maxS = toNum(maxStars);
    if (minS !== undefined || maxS !== undefined) {
      filter.stars = {};
      if (minS !== undefined) filter.stars.$gte = minS;
      if (maxS !== undefined) filter.stars.$lte = maxS;
    }

    if (category) {
      const cats = category
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (cats.length) filter.categories = { $in: cats.map((c) => rxEq(c)) };
    }

    const roomElem: any = {};
    const minP = toNum(minPrice);
    const maxP = toNum(maxPrice);
    if (minP !== undefined || maxP !== undefined) {
      roomElem.pricePerNight = {};
      if (minP !== undefined) roomElem.pricePerNight.$gte = minP;
      if (maxP !== undefined) roomElem.pricePerNight.$lte = maxP;
    }
    if (roomType?.trim()) roomElem.name = rxEq(roomType.trim());
    if (Object.keys(roomElem).length) filter.rooms = { $elemMatch: roomElem };

    const requestedRooms = rooms ? Math.max(1, parseInt(rooms, 10) || 1) : 1;

    const numAdults = toNum(adults) ?? 2;
    const numChildren = toNum(children) ?? 0;
    const totalGuests = Math.max(1, numAdults + numChildren);

    if (req.user?.id) {
      saveLastSearch(req.user.id, {
        city: city?.trim(),
        from,
        to,
        adults: numAdults,
        children: numChildren,
        rooms: requestedRooms,
      }).catch(() => {});
    }

    const hotels = await HotelModel.find(filter)
      .sort({ averageRating: -1, createdAt: -1 })
      .lean();

    const start = from ? new Date(`${from}T00:00:00Z`) : undefined;
    const end = to ? new Date(`${to}T00:00:00Z`) : undefined;
    const hasValidRange = !!(
      start &&
      end &&
      !isNaN(+start) &&
      !isNaN(+end) &&
      end > start
    );
    const nights = hasValidRange
      ? Math.max(1, Math.ceil((+end! - +start!) / 86400000))
      : null;

    let bookedByHotel: Record<string, Record<string, number>> = {};
    if (hasValidRange) {
      const overlaps = await ReservationModel.aggregate<{
        _id: { hotel: Types.ObjectId; roomType: string };
        qty: number;
      }>([
        {
          $match: {
            status: { $in: ["PENDING", "CONFIRMED"] },
            from: { $lt: end! },
            to: { $gt: start! },
          },
        },
        {
          $group: {
            _id: { hotel: "$hotel", roomType: "$roomType" }, // roomType here equals Room.name
            qty: { $sum: "$quantity" },
          },
        },
      ]);

      for (const row of overlaps) {
        const hid = String(row._id.hotel);
        (bookedByHotel[hid] ??= {})[row._id.roomType] = row.qty;
      }
    }

    const capOf = (r: Room): number => {
      if (Number.isFinite((r as any).capacity))
        return Math.max(1, Number((r as any).capacity));
      const adultsCap = Number.isFinite((r as any).maxAdults)
        ? Number((r as any).maxAdults)
        : undefined;
      const childrenCap = Number.isFinite((r as any).maxChildren)
        ? Number((r as any).maxChildren)
        : undefined;
      const sum = (adultsCap ?? 0) + (childrenCap ?? 0);
      return Math.max(1, sum || 2);
    };

    const enriched = (hotels as unknown as Hotel[])
      .map((h) => {
        const hid = String((h as any)._id ?? (h as any).id);
        const roomsArr: Room[] = Array.isArray((h as any).rooms)
          ? ((h as any).rooms as Room[])
          : [];

        const availableByType: Record<string, number> = {};
        let knownAvailableTotal = 0;
        let hasAnyInventoryNumbers = false;

        for (const r of roomsArr) {
          const typeKey = String((r as any).name ?? (r as any)._id);
          const totalRoomsNum = Number(
            (r as any).totalRooms ??
              (r as any).availableRooms ??
              (r as any).totalUnits ??
              0
          );
          const hasInv = Number.isFinite(totalRoomsNum) && totalRoomsNum > 0;
          if (hasInv) hasAnyInventoryNumbers = true;

          const bookedQty = hasValidRange
            ? bookedByHotel[hid]?.[typeKey] ?? 0
            : 0;
          const avail = hasInv ? Math.max(0, totalRoomsNum - bookedQty) : -1;

          availableByType[typeKey] = hasValidRange
            ? avail
            : hasInv
            ? totalRoomsNum
            : -1;
          if (hasInv)
            knownAvailableTotal += hasValidRange ? avail : totalRoomsNum;
        }

        const typeRegex = roomType?.trim() ? rxEq(roomType.trim()) : null;

        const types = roomsArr
          .filter((r: any) => {
            const label = String(r.name ?? r._id);
            return typeRegex ? typeRegex.test(label) : true;
          })
          .map((r: any) => {
            const typeKey = String(r.name ?? r._id);
            const nightly = Number(r.pricePerNight);
            const cap = capOf(r as any);
            const avail = availableByType[typeKey] ?? -1;
            return { typeKey, nightly, cap, avail };
          })
          .filter((t) => Number.isFinite(t.nightly) && t.cap > 0)
          .sort((a, b) => a.nightly - b.nightly);

        const numAdultsLocal = numAdults;
        const numChildrenLocal = numChildren;
        const totalGuestsLocal = totalGuests;

        let remainingGuests = totalGuestsLocal;
        const allocation: Array<{
          roomType: string;
          roomsUsed: number;
          capacityPerRoom: number;
          pricePerNight: number;
        }> = [];

        for (const t of types) {
          if (remainingGuests <= 0) break;
          const neededForType = Math.ceil(remainingGuests / t.cap);
          const allowedByAvail =
            t.avail === -1 ? neededForType : Math.min(neededForType, t.avail);
          if (allowedByAvail <= 0) continue;

          allocation.push({
            roomType: t.typeKey,
            roomsUsed: allowedByAvail,
            capacityPerRoom: t.cap,
            pricePerNight: t.nightly,
          });
          remainingGuests -= allowedByAvail * t.cap;
        }

        const allocationCoversGuests = remainingGuests <= 0;
        if (!allocationCoversGuests) {
          const noInventoryAnywhere = Object.values(availableByType).every(
            (v) => v === -1
          );
          if (!noInventoryAnywhere) {
            return null;
          }
        }

        const roomsNeededByGuests = allocation.reduce(
          (sum, a) => sum + a.roomsUsed,
          0
        );
        const roomsNeeded = Math.max(roomsNeededByGuests, requestedRooms);

        if (roomsNeeded > roomsNeededByGuests && types.length > 0) {
          const cheapest = types[0];
          const extra = roomsNeeded - roomsNeededByGuests;
          allocation.push({
            roomType: cheapest.typeKey,
            roomsUsed: extra,
            capacityPerRoom: cheapest.cap,
            pricePerNight: cheapest.nightly,
          });
        }

        const nightlyTotal = allocation.reduce(
          (sum, a) => sum + a.roomsUsed * a.pricePerNight,
          0
        );
        const priceFrom =
          types.length > 0 ? Math.min(...types.map((t) => t.nightly)) : null;

        const out: any = {
          ...h,
          priceFrom,
          totalNightly: Number.isFinite(nightlyTotal) ? nightlyTotal : null,
          totalPrice:
            hasValidRange && Number.isFinite(nightlyTotal)
              ? Number((nightlyTotal * (nights as number)).toFixed(2))
              : null,
          requiredRooms: roomsNeeded,
          roomsRequested: requestedRooms,
          guests: {
            adults: numAdultsLocal,
            children: numChildrenLocal,
            total: totalGuestsLocal,
          },
          allocation,
          availability:
            hasValidRange && hasAnyInventoryNumbers
              ? {
                  from: start!.toISOString(),
                  to: end!.toISOString(),
                  availableByType,
                  totalAvailable: knownAvailableTotal,
                }
              : undefined,
        };

        if (roomType?.trim()) {
          const rt = roomType.trim().toLowerCase();
          const hasAnyRequestedType = allocation.some(
            (a) => a.roomType.toLowerCase() === rt
          );
          if (!hasAnyRequestedType) return null;
        }

        if (hasValidRange && hasAnyInventoryNumbers) {
          if (knownAvailableTotal <= 0) return null;
        }

        return out;
      })
      .filter((x) => Boolean(x)) as any[];

    let result = enriched;
    switch (sort) {
      case "price_low":
        result = [...result].sort(
          (a, b) => (a.totalNightly ?? Infinity) - (b.totalNightly ?? Infinity)
        );
        break;
      case "price_high":
        result = [...result].sort(
          (a, b) =>
            (b.totalNightly ?? -Infinity) - (a.totalNightly ?? -Infinity)
        );
        break;
      case "rating":
        result = [...result].sort(
          (a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0)
        );
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

export async function updateHotel(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ error: "Invalid hotel id" });
    const dto = updateHotelSchema.parse(req.body);
    const h = await HotelModel.findById(id);
    if (!h) return res.status(404).json({ error: "Hotel not found" });

    if (dto.location?.coordinates) {
      (dto as any).location = {
        lat: dto.location.coordinates[1],
        lng: dto.location.coordinates[0],
      };
    }

    if (Array.isArray(dto.rooms)) {
      const normalizedRooms = dto.rooms.map((r) => ({
        name: r.roomType,
        pricePerNight: r.pricePerNight,
        totalRooms: r.totalRooms,
      }));
      (dto as any).rooms = normalizedRooms;
    }

    Object.assign(h, dto);
    await h.save();
    res.json(h);
  } catch (err) {
    next(err);
  }
}

export async function deleteHotel(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ error: "Invalid hotel id" });
    const h = await HotelModel.findById(id);
    if (!h) return res.status(404).json({ error: "Hotel not found" });
    await h.deleteOne();
    res.json({ message: "Hotel deleted" });
  } catch (err) {
    next(err);
  }
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

export async function listCategories(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { city } = req.query as Record<string, string | undefined>;
    const filter: any = {};
    if (city)
      filter.city = { $regex: `^${escapeRegExp(city)}$`, $options: "i" };

    const categories = await HotelModel.aggregate<{
      _id: string;
      count: number;
    }>([
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
      categories: categories.map((c) => ({
        id: c._id,
        label: c._id,
        count: c.count,
      })),
      stars: stars
        .filter((s) => s._id != null)
        .map((s) => ({
          id: String(s._id),
          label: `${s._id} stars`,
          count: s.count,
        })),
    });
  } catch (err) {
    next(err);
  }
}

export async function suggestCities(
  req: Request,
  res: Response,
  next: NextFunction
) {
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

export async function facetsSnapshot(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { city } = req.query as Record<string, string | undefined>;
    const filter: any = {};
    if (city)
      filter.city = { $regex: `^${escapeRegExp(city)}$`, $options: "i" };

    const categories = await HotelModel.aggregate<{
      _id: string;
      count: number;
    }>([
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
      categories: categories.map((c) => ({
        id: c._id,
        label: c._id,
        count: c.count,
      })),
      stars: stars
        .filter((s) => s._id != null)
        .map((s) => ({
          id: String(s._id),
          label: `${s._id} stars`,
          count: s.count,
        })),
    });
  } catch (err) {
    next(err);
  }
}

export async function getMyReviews(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { page = "1", limit = "10" } = req.query as Record<string, string>;
    const p = Math.max(1, parseInt(page, 10) || 1);
    const l = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));

    const [items, total] = await Promise.all([
      ReviewModel.find({ user: userId })
        .populate({
          path: "hotel",
          select: "name city averageRating reviewsCount media",
        })
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

export async function listReviews(
  req: Request,
  res: Response,
  next: NextFunction
) {
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

export async function getMyReviewForHotel(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { hotelId } = req.params;
    if (!mongoose.isValidObjectId(hotelId))
      return res.status(400).json({ error: "Invalid hotel id" });

    const review = await ReviewModel.findOne({ hotel: hotelId, user: userId })
      .populate({
        path: "hotel",
        select: "name city averageRating reviewsCount media",
      })
      .lean();

    if (!review) return res.status(404).json({ error: "Review not found" });
    res.json(review);
  } catch (err) {
    next(err);
  }
}

export async function createReview(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { hotelId } = req.params;
    if (!mongoose.isValidObjectId(hotelId))
      return res.status(400).json({ error: "Invalid hotel id" });
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const dto = reviewCreateSchema.parse(req.body);

    const exists = await ReviewModel.findOne({
      hotel: hotelId,
      user: userId,
    }).lean();
    if (exists)
      return res
        .status(409)
        .json({ error: "User already reviewed this hotel" });

    const review = await ReviewModel.create({
      hotel: hotelId,
      user: userId,
      rating: dto.rating,
      comment: dto.comment,
      guestName: dto.guestName,
      guestCountry: dto.guestCountry,
      guestInitial: dto.guestInitial,
      categoryRatings: dto.categoryRatings,
      stayDate: dto.stayDate ? new Date(dto.stayDate) : undefined,
      roomType: dto.roomType,
      travelType: dto.travelType,
    });

    await recomputeHotelRating(hotelId);
    res.status(201).json(review);
  } catch (err) {
    if ((err as any)?.code === 11000) {
      return res
        .status(409)
        .json({ error: "User already reviewed this hotel" });
    }
    next(err);
  }
}

export async function updateMyReview(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { hotelId } = req.params;
    if (!mongoose.isValidObjectId(hotelId))
      return res.status(400).json({ error: "Invalid hotel id" });
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

export async function deleteMyReview(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { hotelId } = req.params;
    if (!mongoose.isValidObjectId(hotelId))
      return res.status(400).json({ error: "Invalid hotel id" });
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const review = await ReviewModel.findOneAndDelete({
      hotel: hotelId,
      user: userId,
    });
    if (!review) return res.status(404).json({ error: "Review not found" });

    await recomputeHotelRating(hotelId);
    res.json({ message: "Review deleted" });
  } catch (err) {
    next(err);
  }
}

import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { HotelModel } from "../../models/Hotel";
import { ReservationModel } from "../../models/Reservation";
import { Types } from "mongoose";
import { saveLastSearch } from "../../services/searchHistoryService";
import { AuthedRequest } from "../../middlewares/auth";
import type { Hotel, Room } from "../../types/hotel.types";

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseDateOnly(key?: string): Date | undefined {
  if (!key) return undefined;
  const d = new Date(`${key}T00:00:00Z`);
  return isNaN(+d) ? undefined : d;
}

export async function listHotels(
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
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

    // Add pagination to prevent memory issues with large datasets
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.max(
      1,
      Math.min(100, parseInt(req.query.limit as string) || 20),
    );
    const skip = (page - 1) * limit;

    const hotels = await HotelModel.find(filter)
      .sort({ averageRating: -1, createdAt: -1 })
      .limit(limit)
      .skip(skip)
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
            _id: { hotel: "$hotel", roomType: "$roomType" },
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
              0,
          );
          const hasInv = Number.isFinite(totalRoomsNum) && totalRoomsNum > 0;
          if (hasInv) hasAnyInventoryNumbers = true;

          const bookedQty = hasValidRange
            ? (bookedByHotel[hid]?.[typeKey] ?? 0)
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
            (v) => v === -1,
          );
          if (!noInventoryAnywhere) {
            return null;
          }
        }

        const roomsNeededByGuests = allocation.reduce(
          (sum, a) => sum + a.roomsUsed,
          0,
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
          0,
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
            (a) => a.roomType.toLowerCase() === rt,
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
          (a, b) => (a.totalNightly ?? Infinity) - (b.totalNightly ?? Infinity),
        );
        break;
      case "price_high":
        result = [...result].sort(
          (a, b) =>
            (b.totalNightly ?? -Infinity) - (a.totalNightly ?? -Infinity),
        );
        break;
      case "rating":
        result = [...result].sort(
          (a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0),
        );
        break;
      case "stars":
        result = [...result].sort((a, b) => (b.stars ?? 0) - (a.stars ?? 0));
        break;
      default:
        break;
    }

    // Get total count for pagination (without limit/skip)
    const totalCount = await HotelModel.countDocuments(filter);

    // Return response matching the expected interface
    res.json({
      hotels: result,
      totalCount,
      searchMeta: {
        nights,
        totalGuests,
        requestedRooms,
      },
    });
  } catch (err) {
    next(err);
  }
}

import { Router } from "express";
import { requireAuth, AuthedRequest } from "../middlewares/auth";
import { HotelModel } from "../models/Hotel";
import { ReservationModel } from "../models/Reservation";
import { Types } from "mongoose";
import { ReviewModel } from "../models/Review";

const router = Router();

function isOwnerOrAdmin(role?: string) {
  console.log(
    "Checking role:",
    role,
    "isOwnerOrAdmin:",
    role === "OWNER" || role === "HOTEL_ADMIN"
  );
  return role === "OWNER" || role === "HOTEL_ADMIN";
}

// GET /api/admin-hotel/hotels
router.get("/hotels", requireAuth, async (req: AuthedRequest, res, next) => {
  try {
    if (!isOwnerOrAdmin(req.user?.role))
      return res.status(403).json({ error: "Forbidden" });

    // Show only hotels the user manages/owns
    const userId = req.user!.id;
    const filter = { $or: [{ ownerId: userId }, { adminIds: userId }] } as any;
    const hotels = await HotelModel.find(filter).sort({ createdAt: -1 }).lean();
    res.json(
      hotels.map((h: any) => {
        const approved = h.approvalStatus === "APPROVED";
        const visible = h.isVisible !== false; // default true
        const status = approved && visible ? "active" : "inactive";
        return {
          id: String(h._id),
          name: h.name,
          city: h.city,
          address: h.address,
          averageRating: h.averageRating ?? 0,
          reviewsCount: h.reviewsCount ?? 0,
          rooms: Array.isArray(h.rooms) ? h.rooms.length : 0,
          status,
          isVisible: visible,
          approvalStatus: h.approvalStatus,
          createdAt: h.createdAt,
        };
      })
    );
  } catch (err) {
    next(err);
  }
});

// POST /api/admin-hotel/hotels
router.post("/hotels", requireAuth, async (req: AuthedRequest, res, next) => {
  try {
    if (!isOwnerOrAdmin(req.user?.role))
      return res.status(403).json({ error: "Forbidden" });
    const payload = req.body || {};
    const hotel = await HotelModel.create({
      name: payload.name,
      city: payload.city,
      address: payload.address,
      country: payload.country,
      description: payload.description,
      shortDescription: payload.shortDescription,
      location: payload.location,
      rooms: payload.rooms || [],
      media: payload.media || [],
      facilities: payload.facilities || {},
      propertyHighlights: payload.propertyHighlights || {},
      houseRules: payload.houseRules || undefined,
      surroundings: payload.surroundings || undefined,
      overview: payload.overview || undefined,
      mostPopularFacilities: payload.mostPopularFacilities || [],
      categories: payload.categories || [],
      travellersQuestions: payload.travellersQuestions || [],
      ownerId: req.user!.id,
      adminIds: [req.user!.id],
      isVisible: true,
    });
    res.status(201).json({
      id: hotel.id,
      name: hotel.name,
      city: hotel.city,
      address: hotel.address,
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/admin-hotel/hotels/:id
router.put(
  "/hotels/:id",
  requireAuth,
  async (req: AuthedRequest, res, next) => {
    try {
      console.log("Update hotel request:", {
        userId: req.user?.id,
        userRole: req.user?.role,
        hotelId: req.params.id,
        updateData: Object.keys(req.body || {}),
      });

      if (!isOwnerOrAdmin(req.user?.role)) {
        console.log("Access denied - user role:", req.user?.role);
        return res
          .status(403)
          .json({ error: "Forbidden - insufficient permissions" });
      }

      const { id } = req.params;
      const update = req.body || {};

      // Fix data format issues before updating
      if (
        update.facilities?.languagesSpoken &&
        Array.isArray(update.facilities.languagesSpoken)
      ) {
        console.log(
          "Original languagesSpoken:",
          update.facilities.languagesSpoken
        );
        // Convert objects to strings if needed
        update.facilities.languagesSpoken =
          update.facilities.languagesSpoken.map((item: any) => {
            if (typeof item === "object" && item.name) {
              return item.name;
            }
            return String(item);
          });
        console.log(
          "Converted languagesSpoken:",
          update.facilities.languagesSpoken
        );
      }

      // Fix other potential array format issues
      const arrayFields = [
        "facilities.general",
        "facilities.greatForStay",
        "facilities.bathroom",
        "facilities.bedroom",
        "facilities.view",
        "facilities.outdoors",
        "facilities.kitchen",
        "facilities.roomAmenities",
        "facilities.livingArea",
        "facilities.mediaTechnology",
        "facilities.foodDrink",
        "facilities.receptionServices",
        "facilities.safetySecurity",
        "facilities.generalFacilities",
        "mostPopularFacilities",
        "categories",
      ];

      arrayFields.forEach((fieldPath) => {
        const keys = fieldPath.split(".");
        let current = update;
        for (let i = 0; i < keys.length - 1; i++) {
          if (!current[keys[i]]) return;
          current = current[keys[i]];
        }
        const lastKey = keys[keys.length - 1];
        if (current[lastKey] && Array.isArray(current[lastKey])) {
          current[lastKey] = current[lastKey]
            .map((item: any) => {
              if (typeof item === "object" && item.name) {
                return item.name;
              }
              return String(item);
            })
            .filter((item: any) => item && item.trim()); // Remove empty items
        }
      });

      // Special handling for categories field
      if (update.categories && Array.isArray(update.categories)) {
        update.categories = update.categories
          .map((item: any) => {
            if (typeof item === "object" && item.name) {
              return item.name;
            }
            return String(item);
          })
          .filter((item: any) => item && item.trim());
      }

      console.log("Attempting to update hotel:", id, "with data:", update);

      // For OWNER role, allow updating any hotel. For HOTEL_ADMIN, only allow updating owned/managed hotels
      let hotel;
      if (req.user?.role === "OWNER") {
        hotel = await HotelModel.findByIdAndUpdate(id, update, {
          new: true,
          runValidators: true,
        }).lean();
      } else {
        // HOTEL_ADMIN can only update hotels they own or manage
        hotel = await HotelModel.findOneAndUpdate(
          {
            _id: id,
            $or: [{ ownerId: req.user!.id }, { adminIds: req.user!.id }],
          },
          update,
          { new: true, runValidators: true }
        ).lean();
      }
      if (!hotel) {
        console.log("Hotel not found:", id);
        return res.status(404).json({ error: "Hotel not found" });
      }

      console.log("Hotel updated successfully:", hotel.name);
      res.json({
        id: String(hotel._id),
        name: hotel.name,
        city: hotel.city,
        address: hotel.address,
        status:
          hotel.approvalStatus === "APPROVED" && hotel.isVisible !== false
            ? "active"
            : "inactive",
      });
    } catch (err: any) {
      console.error("Update hotel error:", err);
      if (err.name === "ValidationError") {
        const validationErrors = Object.values(err.errors)
          .map((e: any) => `${e.path}: ${e.message}`)
          .join(", ");
        return res
          .status(400)
          .json({ error: `Validation error: ${validationErrors}` });
      }
      if (err.name === "CastError") {
        return res
          .status(400)
          .json({
            error: `Invalid data format for field ${err.path}: ${err.message}`,
          });
      }
      next(err);
    }
  }
);

// DELETE /api/admin-hotel/hotels/:id
router.delete(
  "/hotels/:id",
  requireAuth,
  async (req: AuthedRequest, res, next) => {
    try {
      if (!isOwnerOrAdmin(req.user?.role))
        return res.status(403).json({ error: "Forbidden" });
      const { id } = req.params;
      const hotel = await HotelModel.findByIdAndDelete(id).lean();
      if (!hotel) return res.status(404).json({ error: "Hotel not found" });
      res.json({ ok: true });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/admin-hotel/analytics
router.get("/analytics", requireAuth, async (req: AuthedRequest, res, next) => {
  try {
    if (!isOwnerOrAdmin(req.user?.role))
      return res.status(403).json({ error: "Forbidden" });
    const { hotelId } = (req.query || {}) as { hotelId?: string };

    // Build allowed hotels filter (only user owned/managed)
    const userId = req.user!.id;
    const allowedHotels = await HotelModel.find({
      $or: [{ ownerId: userId }, { adminIds: userId }],
    })
      .select("_id name")
      .lean();
    const allowedIds = new Set(allowedHotels.map((h: any) => String(h._id)));

    let filterHotels: string[] = [];
    if (hotelId && allowedIds.has(String(hotelId))) {
      filterHotels = [String(hotelId)];
    } else {
      filterHotels = Array.from(allowedIds);
    }

    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    const match: any = {
      status: { $in: ["COMPLETED", "CHECKED_OUT"] },
      checkOut: { $gte: start },
    };
    if (filterHotels.length)
      match.hotel = {
        $in: filterHotels.map((id) => new Types.ObjectId(String(id))),
      };

    const rows = await ReservationModel.aggregate([
      { $match: match },
      {
        $group: {
          _id: { y: { $year: "$checkOut" }, m: { $month: "$checkOut" } },
          revenue: { $sum: "$totalPrice" },
          bookings: { $sum: 1 },
        },
      },
      { $sort: { "_id.y": 1, "_id.m": 1 } },
    ]);

    const totalRevenue = rows.reduce(
      (s: any, r: any) => s + (r.revenue || 0),
      0
    );
    const totalBookings = rows.reduce(
      (s: any, r: any) => s + (r.bookings || 0),
      0
    );

    // Total reviews (optionally per hotel)
    const reviewFilter: any = {};
    if (filterHotels.length)
      reviewFilter.hotel = {
        $in: filterHotels.map((id) => new Types.ObjectId(String(id))),
      };
    const totalReviews = await ReviewModel.countDocuments(reviewFilter);

    // Top performing hotels by revenue (within 12 months & allowed set)
    const topAgg = await ReservationModel.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$hotel",
          revenue: { $sum: "$totalPrice" },
          bookings: { $sum: 1 },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
    ]);
    const hotelsMap = new Map(
      allowedHotels.map((h: any) => [String(h._id), h.name])
    );
    const topPerformingHotels = topAgg.map((r: any) => ({
      id: String(r._id),
      name: hotelsMap.get(String(r._id)) || "Hotel",
      revenue: r.revenue,
      bookings: r.bookings,
    }));

    // --- Average Occupancy (as monthly index) ---
    // Compute average monthly bookings over all months on record (within window)
    const monthsCount = rows.length || 1;
    const overallMonthlyAvg = totalBookings / monthsCount;
    const latestMonthBookings = rows.length
      ? rows[rows.length - 1].bookings
      : 0;
    const averageOccupancy =
      overallMonthlyAvg > 0
        ? Math.round((latestMonthBookings / overallMonthlyAvg) * 100)
        : 0;

    res.json({
      totalRevenue,
      totalBookings,
      totalReviews,
      averageOccupancy,
      monthlyRevenue: rows.map((r: any) => r.revenue),
      monthlyBookings: rows.map((r: any) => r.bookings),
      topPerformingHotels,
    });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/admin-hotel/hotels/:id/visibility
router.patch(
  "/hotels/:id/visibility",
  requireAuth,
  async (req: AuthedRequest, res, next) => {
    try {
      if (!isOwnerOrAdmin(req.user?.role))
        return res.status(403).json({ error: "Forbidden" });
      const { id } = req.params;
      const { isVisible } = req.body as { isVisible: boolean };
      const updated = await HotelModel.findOneAndUpdate(
        {
          _id: id,
          $or: [{ ownerId: req.user!.id }, { adminIds: req.user!.id }],
        },
        { isVisible: !!isVisible },
        { new: true }
      ).lean();
      if (!updated) return res.status(404).json({ error: "Hotel not found" });
      res.json({ id: String(updated._id), isVisible: updated.isVisible });
    } catch (err) {
      next(err);
    }
  }
);

export default router;

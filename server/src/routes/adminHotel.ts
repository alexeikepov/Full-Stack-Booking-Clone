import { Router } from "express";
import { requireAuth, AuthedRequest } from "../middlewares/auth";
import { HotelModel } from "../models/Hotel";
import { ReservationModel } from "../models/Reservation";
import { Types } from "mongoose";
import { ReviewModel } from "../models/Review";

const router = Router();

function isOwnerOrAdmin(role?: string) {
  return role === "OWNER" || role === "HOTEL_ADMIN";
}

// GET /api/admin-hotel/hotels
router.get("/hotels", requireAuth, async (req: AuthedRequest, res, next) => {
  try {
    if (!isOwnerOrAdmin(req.user?.role)) return res.status(403).json({ error: "Forbidden" });

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
    if (!isOwnerOrAdmin(req.user?.role)) return res.status(403).json({ error: "Forbidden" });
    const payload = req.body || {};
    const hotel = await HotelModel.create({
      name: payload.name,
      city: payload.city,
      address: payload.address,
      description: payload.description,
      rooms: payload.rooms || [],
      images: payload.images || [],
    });
    res.status(201).json({ id: hotel.id, name: hotel.name, city: hotel.city, address: hotel.address });
  } catch (err) {
    next(err);
  }
});

// PUT /api/admin-hotel/hotels/:id
router.put("/hotels/:id", requireAuth, async (req: AuthedRequest, res, next) => {
  try {
    if (!isOwnerOrAdmin(req.user?.role)) return res.status(403).json({ error: "Forbidden" });
    const { id } = req.params;
    const update = req.body || {};
    const hotel = await HotelModel.findByIdAndUpdate(id, update, { new: true, runValidators: true }).lean();
    if (!hotel) return res.status(404).json({ error: "Hotel not found" });
    res.json({ id: String(hotel._id), name: hotel.name, city: hotel.city, address: hotel.address });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/admin-hotel/hotels/:id
router.delete("/hotels/:id", requireAuth, async (req: AuthedRequest, res, next) => {
  try {
    if (!isOwnerOrAdmin(req.user?.role)) return res.status(403).json({ error: "Forbidden" });
    const { id } = req.params;
    const hotel = await HotelModel.findByIdAndDelete(id).lean();
    if (!hotel) return res.status(404).json({ error: "Hotel not found" });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin-hotel/analytics
router.get("/analytics", requireAuth, async (req: AuthedRequest, res, next) => {
  try {
    if (!isOwnerOrAdmin(req.user?.role)) return res.status(403).json({ error: "Forbidden" });
    const { hotelId } = (req.query || {}) as { hotelId?: string };

    // Build allowed hotels filter (only user owned/managed)
    const userId = req.user!.id;
    const allowedHotels = await HotelModel.find({ $or: [{ ownerId: userId }, { adminIds: userId }] })
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
    const occEnd = new Date(now); // occupancy window end (today)
    const occStart = new Date(now);
    occStart.setDate(occStart.getDate() - 30); // last 30 days

    const match: any = {
      status: { $in: ["COMPLETED", "CHECKED_OUT"] },
      checkOut: { $gte: start },
    };
    if (filterHotels.length)
      match.hotel = { $in: filterHotels.map((id) => new Types.ObjectId(String(id))) };

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

    const totalRevenue = rows.reduce((s, r) => s + (r.revenue || 0), 0);
    const totalBookings = rows.reduce((s, r) => s + (r.bookings || 0), 0);

    // Total reviews (optionally per hotel)
    const reviewFilter: any = {};
    if (filterHotels.length)
      reviewFilter.hotel = { $in: filterHotels.map((id) => new Types.ObjectId(String(id))) };
    const totalReviews = await ReviewModel.countDocuments(reviewFilter);

    // Top performing hotels by revenue (within 12 months & allowed set)
    const topAgg = await ReservationModel.aggregate([
      { $match: match },
      { $group: { _id: "$hotel", revenue: { $sum: "$totalPrice" }, bookings: { $sum: 1 } } },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
    ]);
    const hotelsMap = new Map(allowedHotels.map((h: any) => [String(h._id), h.name]));
    const topPerformingHotels = topAgg.map((r: any) => ({
      id: String(r._id),
      name: hotelsMap.get(String(r._id)) || "Hotel",
      revenue: r.revenue,
      bookings: r.bookings,
    }));

    // ---- Average Occupancy (last 30 days) ----
    // Total rooms across selected hotels
    let totalRooms = 0;
    if (filterHotels.length) {
      const selectedHotels = await HotelModel.find({ _id: { $in: filterHotels.map((id) => new Types.ObjectId(String(id))) } })
        .select("rooms")
        .lean();
      totalRooms = selectedHotels.reduce((sum, h: any) => sum + (Array.isArray(h.rooms) ? h.rooms.length : 0), 0);
    }

    // If there are no rooms, occupancy is 0 to avoid division by zero
    let averageOccupancy = 0;
    if (totalRooms > 0) {
      const occMatch: any = {
        status: { $in: ["CONFIRMED", "COMPLETED", "CHECKED_OUT"] },
        checkIn: { $lte: occEnd },
        checkOut: { $gte: occStart },
      };
      if (filterHotels.length)
        occMatch.hotel = { $in: filterHotels.map((id) => new Types.ObjectId(String(id))) };

      const occReservations = await ReservationModel.find(occMatch)
        .select("checkIn checkOut quantity")
        .lean();

      // Compute occupied room-nights overlapping with [occStart, occEnd]
      const msPerDay = 1000 * 60 * 60 * 24;
      let occupiedRoomNights = 0;
      for (const r of occReservations as any[]) {
        const from = new Date(Math.max(new Date(r.checkIn).getTime(), occStart.getTime()));
        const to = new Date(Math.min(new Date(r.checkOut).getTime(), occEnd.getTime()));
        const nights = Math.max(0, Math.ceil((to.getTime() - from.getTime()) / msPerDay));
        occupiedRoomNights += nights * (Number(r.quantity) || 1);
      }

      const totalRoomNights = totalRooms * 30; // 30-day window
      averageOccupancy = Math.round((occupiedRoomNights / Math.max(1, totalRoomNights)) * 100);
    }

    res.json({
      totalRevenue,
      totalBookings,
      totalReviews,
      averageOccupancy,
      monthlyRevenue: rows.map((r) => r.revenue),
      monthlyBookings: rows.map((r) => r.bookings),
      topPerformingHotels,
    });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/admin-hotel/hotels/:id/visibility
router.patch("/hotels/:id/visibility", requireAuth, async (req: AuthedRequest, res, next) => {
  try {
    if (!isOwnerOrAdmin(req.user?.role)) return res.status(403).json({ error: "Forbidden" });
    const { id } = req.params;
    const { isVisible } = req.body as { isVisible: boolean };
    const updated = await HotelModel.findOneAndUpdate(
      { _id: id, $or: [{ ownerId: req.user!.id }, { adminIds: req.user!.id }] },
      { isVisible: !!isVisible },
      { new: true }
    ).lean();
    if (!updated) return res.status(404).json({ error: "Hotel not found" });
    res.json({ id: String(updated._id), isVisible: updated.isVisible });
  } catch (err) {
    next(err);
  }
});

export default router;



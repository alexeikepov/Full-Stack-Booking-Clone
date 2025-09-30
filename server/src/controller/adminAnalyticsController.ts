import { Request, Response, NextFunction } from "express";
import { HotelModel } from "../models/Hotel";
import { ReservationModel } from "../models/Reservation";
import { ReviewModel } from "../models/Review";
import { AuthedRequest } from "../middlewares/auth";
import { isOwnerOrAdmin } from "../middlewares/adminAuth";
import { Types } from "mongoose";

export async function getAnalytics(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (!isOwnerOrAdmin(req.user?.role))
      return res.status(403).json({ error: "Forbidden" });
    const { hotelId } = (req.query || {}) as { hotelId?: string };

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

    const reviewFilter: any = {};
    if (filterHotels.length)
      reviewFilter.hotel = {
        $in: filterHotels.map((id) => new Types.ObjectId(String(id))),
      };
    const totalReviews = await ReviewModel.countDocuments(reviewFilter);

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
}

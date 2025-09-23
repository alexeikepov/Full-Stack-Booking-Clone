// src/services/trendingCityService.ts
import { PipelineStage } from "mongoose";
import { ReservationModel } from "../models/Reservation";
import { HotelModel } from "../models/Hotel";

export interface TopCitiesParams {
  windowDays?: number; // ברירת מחדל 30 ימים אחרונים
  limit?: number;      // ברירת מחדל 10
  statuses?: Array<"PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED">; // ברירת מחדל PENDING+CONFIRMED
}

export async function getTopCities(params: TopCitiesParams = {}) {
  const {
    windowDays = 30,
    limit = 10,
    statuses = ["CONFIRMED", "PENDING"],
  } = params;

  const since = new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000);

  const pipeline: PipelineStage[] = [
    { $match: { status: { $in: statuses }, createdAt: { $gte: since } } },
    {
      $lookup: {
        from: (HotelModel as any).collection.name,
        localField: "hotel",
        foreignField: "_id",
        as: "hotelDoc",
        pipeline: [{ $project: { _id: 1, city: 1 } }],
      },
    },
    { $unwind: "$hotelDoc" },
    {
      $group: {
        _id: { city: "$hotelDoc.city" },
        reservations: { $sum: 1 },
      },
    },
    { $sort: { reservations: -1, "_id.city": 1 } },
    { $limit: limit },
    {
      $project: {
        _id: 0,
        city: "$_id.city",
        reservations: 1,
      },
    },
  ];

  return ReservationModel.aggregate(pipeline);
}

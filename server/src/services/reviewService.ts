// src/services/reviewService.ts
import mongoose, { Types } from "mongoose";
import { ReviewModel } from "../models/Review";
import { HotelModel } from "../models/Hotel";

export interface ReviewStats {
  _id: null;
  avg: number;
  count: number;
  staffAvg?: number;
  comfortAvg?: number;
  freeWifiAvg?: number;
  facilitiesAvg?: number;
  valueForMoneyAvg?: number;
  cleanlinessAvg?: number;
  locationAvg?: number;
}

export async function recomputeHotelRating(hotelId: string | Types.ObjectId) {
  const agg = await ReviewModel.aggregate<ReviewStats>([
    { $match: { hotel: new Types.ObjectId(hotelId), status: "APPROVED" } },
    {
      $group: {
        _id: null,
        avg: { $avg: "$rating" },
        count: { $sum: 1 },
        staffAvg: { $avg: "$categoryRatings.staff" },
        comfortAvg: { $avg: "$categoryRatings.comfort" },
        freeWifiAvg: { $avg: "$categoryRatings.freeWifi" },
        facilitiesAvg: { $avg: "$categoryRatings.facilities" },
        valueForMoneyAvg: { $avg: "$categoryRatings.valueForMoney" },
        cleanlinessAvg: { $avg: "$categoryRatings.cleanliness" },
        locationAvg: { $avg: "$categoryRatings.location" },
      },
    },
  ]);

  const result = agg[0];
  if (!result) return;

  const avg = Number(result.avg.toFixed(2));
  const count = result.count;

  const categoryAvgs = {
    staff: result.staffAvg ? Number(result.staffAvg.toFixed(1)) : undefined,
    comfort: result.comfortAvg
      ? Number(result.comfortAvg.toFixed(1))
      : undefined,
    freeWifi: result.freeWifiAvg
      ? Number(result.freeWifiAvg.toFixed(1))
      : undefined,
    facilities: result.facilitiesAvg
      ? Number(result.facilitiesAvg.toFixed(1))
      : undefined,
    valueForMoney: result.valueForMoneyAvg
      ? Number(result.valueForMoneyAvg.toFixed(1))
      : undefined,
    cleanliness: result.cleanlinessAvg
      ? Number(result.cleanlinessAvg.toFixed(1))
      : undefined,
    location: result.locationAvg
      ? Number(result.locationAvg.toFixed(1))
      : undefined,
  };

  await HotelModel.findByIdAndUpdate(hotelId, {
    averageRating: avg,
    reviewsCount: count,
    "guestReviews.overallRating": avg,
    "guestReviews.totalReviews": count,
    "guestReviews.categories": categoryAvgs,
  });
}

export async function getReviewStats(hotelId: string) {
  const stats = await ReviewModel.aggregate([
    { $match: { hotel: new Types.ObjectId(hotelId), status: "APPROVED" } },
    {
      $group: {
        _id: null,
        totalReviews: { $sum: 1 },
        averageRating: { $avg: "$rating" },
        staffAvg: { $avg: "$categoryRatings.staff" },
        comfortAvg: { $avg: "$categoryRatings.comfort" },
        freeWifiAvg: { $avg: "$categoryRatings.freeWifi" },
        facilitiesAvg: { $avg: "$categoryRatings.facilities" },
        valueForMoneyAvg: { $avg: "$categoryRatings.valueForMoney" },
        cleanlinessAvg: { $avg: "$categoryRatings.cleanliness" },
        locationAvg: { $avg: "$categoryRatings.location" },
        ratingDistribution: {
          $push: "$rating",
        },
        travelTypeDistribution: {
          $push: "$travelType",
        },
      },
    },
  ]);

  if (stats.length === 0) {
    return {
      totalReviews: 0,
      averageRating: 0,
      ratingDistribution: {},
      travelTypeDistribution: {},
    };
  }

  const result = stats[0];
  const ratingDistribution: Record<number, number> = {};
  const travelTypeDistribution: Record<string, number> = {};

  // Count rating distribution
  result.ratingDistribution.forEach((rating: number) => {
    ratingDistribution[rating] = (ratingDistribution[rating] || 0) + 1;
  });

  // Count travel type distribution
  result.travelTypeDistribution.forEach((type: string) => {
    if (type) {
      travelTypeDistribution[type] = (travelTypeDistribution[type] || 0) + 1;
    }
  });

  return {
    totalReviews: result.totalReviews,
    averageRating: Number(result.averageRating.toFixed(1)),
    ratingDistribution,
    travelTypeDistribution,
    categoryAverages: {
      staff: result.staffAvg ? Number(result.staffAvg.toFixed(1)) : undefined,
      comfort: result.comfortAvg
        ? Number(result.comfortAvg.toFixed(1))
        : undefined,
      freeWifi: result.freeWifiAvg
        ? Number(result.freeWifiAvg.toFixed(1))
        : undefined,
      facilities: result.facilitiesAvg
        ? Number(result.facilitiesAvg.toFixed(1))
        : undefined,
      valueForMoney: result.valueForMoneyAvg
        ? Number(result.valueForMoneyAvg.toFixed(1))
        : undefined,
      cleanliness: result.cleanlinessAvg
        ? Number(result.cleanlinessAvg.toFixed(1))
        : undefined,
      location: result.locationAvg
        ? Number(result.locationAvg.toFixed(1))
        : undefined,
    },
  };
}

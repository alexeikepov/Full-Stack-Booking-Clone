// src/controller/review/getReviews.ts
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { ReviewModel } from "../../models/Review";
import {
  ReviewQueryParams,
  ReviewFilter,
  ReviewSortQuery,
} from "../../types/reviewTypes";

export async function getReviews(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { hotelId } = req.params;
    if (!mongoose.isValidObjectId(hotelId)) {
      return res.status(400).json({ error: "Invalid hotel id" });
    }

    const {
      page = "1",
      limit = "10",
      sort = "newest",
      rating,
      travelType,
      status = "APPROVED",
    } = req.query as ReviewQueryParams;

    const p = Math.max(1, parseInt(page, 10) || 1);
    const l = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));

    const filter: ReviewFilter = { hotel: hotelId };

    if (status) {
      filter.status = status;
    }

    if (rating) {
      const ratingNum = parseInt(rating, 10);
      if (!isNaN(ratingNum) && ratingNum >= 1 && ratingNum <= 10) {
        filter.rating = ratingNum;
      }
    }

    if (travelType) {
      filter.travelType = travelType;
    }

    let sortQuery: any = { createdAt: -1 };
    switch (sort) {
      case "oldest":
        sortQuery = { createdAt: 1 };
        break;
      case "rating_high":
        sortQuery = { rating: -1, createdAt: -1 };
        break;
      case "rating_low":
        sortQuery = { rating: 1, createdAt: -1 };
        break;
      case "helpful":
        sortQuery = { helpfulVotes: -1, createdAt: -1 };
        break;
    }

    const [reviews, total] = await Promise.all([
      ReviewModel.find(filter)
        .populate({
          path: "user",
          select: "name email",
        })
        .populate({
          path: "hotel",
          select: "name city",
        })
        .sort(sortQuery)
        .skip((p - 1) * l)
        .limit(l)
        .lean(),
      ReviewModel.countDocuments(filter),
    ]);

    res.json(reviews);
  } catch (err) {
    next(err);
  }
}

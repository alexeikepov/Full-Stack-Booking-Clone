// src/controller/reviewController.ts
import { Request, Response, NextFunction } from "express";
import mongoose, { Types } from "mongoose";
import { z } from "zod";
import { ReviewModel } from "../models/Review";
import { HotelModel } from "../models/Hotel";
import { AuthedRequest } from "../middlewares/auth";

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

const reviewResponseSchema = z.object({
  text: z.string().min(1).max(1000),
});

async function recomputeHotelRating(hotelId: string | Types.ObjectId) {
  const agg = await ReviewModel.aggregate<{
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
  }>([
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

export async function createReview(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { hotelId } = req.params;
    if (!mongoose.isValidObjectId(hotelId)) {
      return res.status(400).json({ error: "Invalid hotel id" });
    }

    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const dto = reviewCreateSchema.parse(req.body);

    // Check if hotel exists
    const hotel = await HotelModel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }

    // Check if user already reviewed this hotel
    const existingReview = await ReviewModel.findOne({
      hotel: hotelId,
      user: userId,
    });
    if (existingReview) {
      return res
        .status(409)
        .json({ error: "User already reviewed this hotel" });
    }

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
      status: "APPROVED", // Auto-approve for now
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
    } = req.query as Record<string, string>;

    const p = Math.max(1, parseInt(page, 10) || 1);
    const l = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));

    const filter: any = { hotel: hotelId };

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

export async function getReviewById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { reviewId } = req.params;
    if (!mongoose.isValidObjectId(reviewId)) {
      return res.status(400).json({ error: "Invalid review id" });
    }

    const review = await ReviewModel.findById(reviewId)
      .populate({
        path: "user",
        select: "name email",
      })
      .populate({
        path: "hotel",
        select: "name city",
      })
      .lean();

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.json(review);
  } catch (err) {
    next(err);
  }
}

export async function updateReview(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { reviewId } = req.params;
    if (!mongoose.isValidObjectId(reviewId)) {
      return res.status(400).json({ error: "Invalid review id" });
    }

    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const dto = reviewUpdateSchema.parse(req.body);

    const review = await ReviewModel.findOne({
      _id: reviewId,
      user: userId,
    });

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Update review
    Object.assign(review, dto);
    if (dto.stayDate) {
      review.stayDate = new Date(dto.stayDate);
    }
    await review.save();

    await recomputeHotelRating(review.hotel);

    res.json(review);
  } catch (err) {
    next(err);
  }
}

export async function deleteReview(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { reviewId } = req.params;
    if (!mongoose.isValidObjectId(reviewId)) {
      return res.status(400).json({ error: "Invalid review id" });
    }

    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const review = await ReviewModel.findOne({
      _id: reviewId,
      user: userId,
    });

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    const hotelId = review.hotel;
    await review.deleteOne();

    await recomputeHotelRating(hotelId);

    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    next(err);
  }
}

export async function addHotelResponse(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { reviewId } = req.params;
    if (!mongoose.isValidObjectId(reviewId)) {
      return res.status(400).json({ error: "Invalid review id" });
    }

    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const dto = reviewResponseSchema.parse(req.body);

    const review = await ReviewModel.findById(reviewId);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Check if user is hotel owner or admin
    const hotel = await HotelModel.findById(review.hotel);
    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }

    if (
      hotel.ownerId.toString() !== userId &&
      !hotel.adminIds.includes(userId as any)
    ) {
      return res
        .status(403)
        .json({ error: "Not authorized to respond to this review" });
    }

    review.hotelResponse = {
      text: dto.text,
      respondedAt: new Date(),
      respondedBy: userId as any,
    };

    await review.save();

    res.json(review);
  } catch (err) {
    next(err);
  }
}

export async function voteHelpful(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { reviewId } = req.params;
    if (!mongoose.isValidObjectId(reviewId)) {
      return res.status(400).json({ error: "Invalid review id" });
    }

    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const review = await ReviewModel.findById(reviewId);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    // For now, just increment helpful votes
    // In a real app, you'd track which users voted to prevent duplicate votes
    review.helpfulVotes = (review.helpfulVotes || 0) + 1;
    await review.save();

    res.json({ helpfulVotes: review.helpfulVotes });
  } catch (err) {
    next(err);
  }
}

export async function reportReview(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { reviewId } = req.params;
    if (!mongoose.isValidObjectId(reviewId)) {
      return res.status(400).json({ error: "Invalid review id" });
    }

    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const review = await ReviewModel.findById(reviewId);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Increment report count
    review.reportCount = (review.reportCount || 0) + 1;

    // If report count reaches threshold, hide the review
    if (review.reportCount >= 5) {
      review.status = "HIDDEN";
    }

    await review.save();

    res.json({ message: "Review reported successfully" });
  } catch (err) {
    next(err);
  }
}

export async function getReviewStats(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { hotelId } = req.params;
    if (!mongoose.isValidObjectId(hotelId)) {
      return res.status(400).json({ error: "Invalid hotel id" });
    }

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
      return res.json({
        totalReviews: 0,
        averageRating: 0,
        ratingDistribution: {},
        travelTypeDistribution: {},
      });
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

    res.json({
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
    });
  } catch (err) {
    next(err);
  }
}

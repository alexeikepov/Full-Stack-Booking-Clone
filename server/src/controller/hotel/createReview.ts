import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { z } from "zod";
import { ReviewModel } from "../../models/Review";
import { HotelModel } from "../../models/Hotel";
import { AuthedRequest } from "../../middlewares/auth";
import { Types } from "mongoose";

const reviewCreateSchema = z.object({
  rating: z.number().int().min(1).max(10),
  comment: z.string().max(2000).optional().default(""),
  negative: z.string().max(2000).optional().default(""),

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

export async function createReview(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  const { hotelId } = req.params;
  const userId = req.user?.id;

  try {
    if (!mongoose.isValidObjectId(hotelId))
      return res.status(400).json({ error: "Invalid hotel id" });
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    console.log(
      `[HOTEL CONTROLLER] createReview: hotelId=${hotelId}, userId=${userId}`
    );
    console.log(`[HOTEL CONTROLLER] Request body:`, req.body);

    const dto = reviewCreateSchema.parse(req.body);

    // Check if user is trying to review their own hotel
    const hotel = await HotelModel.findById(hotelId);
    if (hotel) {
      const isOwner = hotel.ownerId.toString() === userId;
      const isAdmin = hotel.adminIds.includes(userId as any);

      if (isOwner || isAdmin) {
        console.log(
          `User ${userId} is ${
            isOwner ? "owner" : "admin"
          } of hotel ${hotelId}, allowing review creation`
        );
      }
    }

    console.log("Creating new review with data:", {
      hotel: hotelId,
      user: userId,
      rating: dto.rating,
      comment: dto.comment,
      negative: dto.negative,
      guestName: dto.guestName,
      guestCountry: dto.guestCountry,
      guestInitial: dto.guestInitial,
      categoryRatings: dto.categoryRatings,
      stayDate: dto.stayDate ? new Date(dto.stayDate) : undefined,
      roomType: dto.roomType,
      travelType: dto.travelType,
    });

    const review = await ReviewModel.create({
      hotel: hotelId,
      user: userId,
      rating: dto.rating,
      comment: dto.comment,
      negative: dto.negative,
      guestName: dto.guestName,
      guestCountry: dto.guestCountry,
      guestInitial: dto.guestInitial,
      categoryRatings: dto.categoryRatings,
      stayDate: dto.stayDate ? new Date(dto.stayDate) : undefined,
      roomType: dto.roomType,
      travelType: dto.travelType,
      status: "APPROVED",
    });

    console.log("Review created successfully:", review);

    await recomputeHotelRating(hotelId);
    res.status(201).json(review);
  } catch (err) {
    console.error("createReview error:", err);

    // If it's a duplicate key error for reviews, try to find existing review
    if ((err as any)?.code === 11000) {
      console.log("Duplicate key error, trying to find existing review...");
      try {
        const existingReview = await ReviewModel.findOne({
          hotel: hotelId,
          user: userId,
        }).sort({ createdAt: -1 }); // Get the most recent review

        if (existingReview) {
          console.log("Found existing review, returning it:", existingReview);
          return res.status(201).json(existingReview);
        }
      } catch (findErr) {
        console.error("Error finding existing review:", findErr);
      }
    }

    next(err);
  }
}

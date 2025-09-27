import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { z } from "zod";
import { ReviewModel } from "../../models/Review";
import { HotelModel } from "../../models/Hotel";
import { AuthedRequest } from "../../middlewares/auth";
import { Types } from "mongoose";

const reviewUpdateSchema = z.object({
  rating: z.number().int().min(1).max(10).optional(),
  comment: z.string().max(2000).optional(),
  negative: z.string().max(2000).optional(),

  // Guest info
  guestName: z.string().min(1).max(100).optional(),
  guestCountry: z.string().min(1).max(100).optional(),
  guestInitial: z.string().min(1).max(5).optional(),

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

    console.log(`updateMyReview: hotelId=${hotelId}, userId=${userId}`);
    console.log("Request body:", req.body);

    const dto = reviewUpdateSchema.parse(req.body);
    console.log("Parsed DTO:", dto);

    const review = await ReviewModel.findOneAndUpdate(
      { hotel: hotelId, user: userId },
      { $set: { ...dto } },
      { new: true }
    );

    console.log("Found review:", review);

    if (!review) return res.status(404).json({ error: "Review not found" });

    await recomputeHotelRating(hotelId);
    res.json(review);
  } catch (err) {
    console.error("updateMyReview error:", err);
    next(err);
  }
}

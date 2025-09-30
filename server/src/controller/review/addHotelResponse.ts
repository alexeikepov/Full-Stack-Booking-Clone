// src/controller/review/addHotelResponse.ts
import { Response, NextFunction } from "express";
import mongoose from "mongoose";
import { ReviewModel } from "../../models/Review";
import { HotelModel } from "../../models/Hotel";
import { AuthedRequest } from "../../middlewares/auth";
import { reviewResponseSchema } from "../../schemas/reviewSchemas";

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

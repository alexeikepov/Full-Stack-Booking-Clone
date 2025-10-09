// src/controller/review/updateReview.ts
import { Response, NextFunction } from "express";
import mongoose from "mongoose";
import { ReviewModel } from "../../models/Review";
import { AuthedRequest } from "../../middlewares/auth";
import { reviewUpdateSchema } from "../../schemas/reviewSchemas";
import { recomputeHotelRating } from "../../services/reviewService";

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

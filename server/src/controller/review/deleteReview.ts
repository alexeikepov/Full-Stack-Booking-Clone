// src/controller/review/deleteReview.ts
import { Response, NextFunction } from "express";
import mongoose from "mongoose";
import { ReviewModel } from "../../models/Review";
import { AuthedRequest } from "../../middlewares/auth";
import { recomputeHotelRating } from "../../services/reviewService";

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

// src/controller/review/reportReview.ts
import { Response, NextFunction } from "express";
import mongoose from "mongoose";
import { ReviewModel } from "../../models/Review";
import { AuthedRequest } from "../../middlewares/auth";

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

// src/controller/review/voteHelpful.ts
import { Response, NextFunction } from "express";
import mongoose from "mongoose";
import { ReviewModel } from "../../models/Review";
import { AuthedRequest } from "../../middlewares/auth";

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

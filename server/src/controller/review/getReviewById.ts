// src/controller/review/getReviewById.ts
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { ReviewModel } from "../../models/Review";

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

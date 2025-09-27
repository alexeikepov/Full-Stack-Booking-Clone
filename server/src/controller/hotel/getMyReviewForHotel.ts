import { Response, NextFunction } from "express";
import mongoose from "mongoose";
import { ReviewModel } from "../../models/Review";
import { AuthedRequest } from "../../middlewares/auth";

export async function getMyReviewForHotel(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { hotelId } = req.params;
    if (!mongoose.isValidObjectId(hotelId))
      return res.status(400).json({ error: "Invalid hotel id" });

    const review = await ReviewModel.findOne({ hotel: hotelId, user: userId })
      .populate({
        path: "hotel",
        select: "name city averageRating reviewsCount media",
      })
      .lean();

    if (!review) return res.status(404).json({ error: "Review not found" });
    res.json(review);
  } catch (err) {
    next(err);
  }
}


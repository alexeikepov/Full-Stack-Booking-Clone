import { Response, NextFunction } from "express";
import mongoose from "mongoose";
import { ReviewModel } from "../../models/Review";
import { HotelModel } from "../../models/Hotel";
import { AuthedRequest } from "../../middlewares/auth";
import { Types } from "mongoose";

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

export async function deleteMyReview(
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

    const review = await ReviewModel.findOneAndDelete({
      hotel: hotelId,
      user: userId,
    });
    if (!review) return res.status(404).json({ error: "Review not found" });

    await recomputeHotelRating(hotelId);
    res.json({ message: "Review deleted" });
  } catch (err) {
    next(err);
  }
}

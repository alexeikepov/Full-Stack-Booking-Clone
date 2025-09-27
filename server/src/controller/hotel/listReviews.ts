import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { ReviewModel } from "../../models/Review";

export async function listReviews(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { hotelId } = req.params;
    if (!mongoose.isValidObjectId(hotelId)) {
      return res.status(400).json({ error: "Invalid hotel id" });
    }

    const reviews = await ReviewModel.find({ hotel: hotelId })
      .populate({ path: "user", select: "name _id" })
      .sort({ createdAt: -1 })
      .lean();

    res.json(reviews);
  } catch (err) {
    next(err);
  }
}


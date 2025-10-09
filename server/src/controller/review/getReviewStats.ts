// src/controller/review/getReviewStats.ts
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { getReviewStats } from "../../services/reviewService";

export async function getReviewStatsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { hotelId } = req.params;
    if (!mongoose.isValidObjectId(hotelId)) {
      return res.status(400).json({ error: "Invalid hotel id" });
    }

    const stats = await getReviewStats(hotelId);
    res.json(stats);
  } catch (err) {
    next(err);
  }
}

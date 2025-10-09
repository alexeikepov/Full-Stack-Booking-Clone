// src/controller/review/createReview.ts
import { Response, NextFunction } from "express";
import mongoose from "mongoose";
import { ReviewModel } from "../../models/Review";
import { HotelModel } from "../../models/Hotel";
import { AuthedRequest } from "../../middlewares/auth";
import { reviewCreateSchema } from "../../schemas/reviewSchemas";
import { recomputeHotelRating } from "../../services/reviewService";

export async function createReview(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { hotelId } = req.params;
    if (!mongoose.isValidObjectId(hotelId)) {
      return res.status(400).json({ error: "Invalid hotel id" });
    }

    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    console.log(
      `[REVIEW CONTROLLER] createReview: hotelId=${hotelId}, userId=${userId}`
    );
    console.log(`[REVIEW CONTROLLER] Request body:`, req.body);

    const dto = reviewCreateSchema.parse(req.body);

    // Check if hotel exists
    const hotel = await HotelModel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }

    // Check if user is trying to review their own hotel
    const isOwner = hotel.ownerId.toString() === userId;
    const isAdmin = hotel.adminIds.includes(userId as any);

    if (isOwner || isAdmin) {
      console.log(
        `User ${userId} is ${
          isOwner ? "owner" : "admin"
        } of hotel ${hotelId}, allowing review creation`
      );
    }

    console.log("Creating new review with data:", {
      hotel: hotelId,
      user: userId,
      rating: dto.rating,
      comment: dto.comment,
      negative: dto.negative,
      guestName: dto.guestName,
      guestCountry: dto.guestCountry,
      guestInitial: dto.guestInitial,
      categoryRatings: dto.categoryRatings,
      stayDate: dto.stayDate ? new Date(dto.stayDate) : undefined,
      roomType: dto.roomType,
      travelType: dto.travelType,
    });

    const review = await ReviewModel.create({
      hotel: hotelId,
      user: userId,
      rating: dto.rating,
      comment: dto.comment,
      negative: dto.negative,
      guestName: dto.guestName,
      guestCountry: dto.guestCountry,
      guestInitial: dto.guestInitial,
      categoryRatings: dto.categoryRatings,
      stayDate: dto.stayDate ? new Date(dto.stayDate) : undefined,
      roomType: dto.roomType,
      travelType: dto.travelType,
      status: "APPROVED", // Auto-approve for now
    });

    console.log("Review created successfully:", review);

    await recomputeHotelRating(hotelId);

    res.status(201).json(review);
  } catch (err) {
    console.error("createReview error:", err);
    next(err);
  }
}

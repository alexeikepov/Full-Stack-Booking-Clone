// src/models/Review.ts
import { Schema, model } from "mongoose";

const ReviewSchema = new Schema(
  {
    hotel: {
      type: Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Basic review info
    rating: { type: Number, min: 1, max: 10, required: true },
    comment: { type: String, default: "" },
    negative: { type: String, default: "" },

    // Guest info
    guestName: { type: String, required: true }, // "Michael", "Josh"
    guestCountry: { type: String, required: true }, // "Israel", "United States"
    guestInitial: { type: String, required: true }, // "M", "J"

    // Detailed ratings
    categoryRatings: {
      staff: { type: Number, min: 1, max: 10 },
      comfort: { type: Number, min: 1, max: 10 },
      freeWifi: { type: Number, min: 1, max: 10 },
      facilities: { type: Number, min: 1, max: 10 },
      valueForMoney: { type: Number, min: 1, max: 10 },
      cleanliness: { type: Number, min: 1, max: 10 },
      location: { type: Number, min: 1, max: 10 },
    },

    // Review metadata
    reviewType: {
      type: String,
      enum: ["GUEST", "VERIFIED", "ANONYMOUS"],
      default: "GUEST",
    },
    isVerified: { type: Boolean, default: false },
    helpfulVotes: { type: Number, default: 0 },
    reportCount: { type: Number, default: 0 },

    // Stay details
    stayDate: { type: Date },
    roomType: { type: String },
    travelType: {
      type: String,
      enum: ["BUSINESS", "LEISURE", "COUPLE", "FAMILY", "FRIENDS", "SOLO"],
      default: "LEISURE",
    },

    // Review status
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED", "HIDDEN"],
      default: "PENDING",
    },
    moderatedAt: { type: Date },
    moderatedBy: { type: Schema.Types.ObjectId, ref: "User" },

    // Response from hotel
    hotelResponse: {
      text: { type: String },
      respondedAt: { type: Date },
      respondedBy: { type: Schema.Types.ObjectId, ref: "User" },
    },
  },
  { timestamps: true, collection: "reviews" }
);

// Allow multiple reviews per user per hotel
ReviewSchema.index({ hotel: 1, user: 1 });
ReviewSchema.index({ hotel: 1, rating: -1, createdAt: -1 });
ReviewSchema.index({ status: 1, createdAt: -1 });

export const ReviewModel = model("Review", ReviewSchema);

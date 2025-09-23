// src/models/Review.ts
import { Schema, model } from "mongoose";

const ReviewSchema = new Schema(
  {
    hotel: { type: Schema.Types.ObjectId, ref: "Hotel", required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, default: "" },
  },
  { timestamps: true, collection: "reviews" }
);

// One review per user per hotel
ReviewSchema.index({ hotel: 1, user: 1 }, { unique: true });

export const ReviewModel = model("Review", ReviewSchema);

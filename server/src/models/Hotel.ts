// src/models/Hotel.ts
import { Schema, model } from "mongoose";

const RoomSchema = new Schema(
  {
    roomType: { type: String, enum: ["STANDARD", "DELUXE", "SUITE"], required: true },
    pricePerNight: { type: Number, required: true, min: 0 },
    totalRooms: { type: Number, required: true, min: 0 },
    availableRooms: { type: Number, min: 0, default: undefined },
  },
  { _id: false }
);

const HotelSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    city: { type: String, required: true, trim: true, index: true },
    address: { type: String, required: true, trim: true },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number] }, // [lng, lat]
    },
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    amenities: { type: [String], default: [] },
    images: { type: [String], default: [] },
    rooms: { type: [RoomSchema], default: [] },
    ratingAvg: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0, min: 0 },
    categories: { type: [String], default: [] },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review", default: [] }],
    owner: { type: Schema.Types.ObjectId, ref: "User", index: true },
  },
  { timestamps: true, collection: "hotels" }
);

HotelSchema.index({ location: "2dsphere" });
HotelSchema.index(
  { name: "text", city: "text", address: "text", description: "text" },
  { weights: { name: 5, city: 3, address: 2, description: 1 } }
);

export const HotelModel = model("Hotel", HotelSchema);

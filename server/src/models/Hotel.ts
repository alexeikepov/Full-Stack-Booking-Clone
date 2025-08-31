import { Schema, model, Types } from "mongoose";

export type RoomKind = "STANDARD" | "DELUXE" | "SUITE";

export interface IRoom {
  roomType: RoomKind;
  pricePerNight: number;
  totalRooms: number;
  availableRooms: number;
}

export interface IHotel {
  name: string;
  city: string;
  address: string;
  location?: {
    type: "Point";
    coordinates: [number, number]; // [lng, lat]
  };
  description?: string;
  amenities: string[];
  images: string[];
  rooms: IRoom[];
  ratingAvg: number;
  ratingCount: number;
  owner?: Types.ObjectId; // optional: link to user who manages the hotel
}

const RoomSchema = new Schema<IRoom>(
  {
    roomType: { type: String, enum: ["STANDARD", "DELUXE", "SUITE"], required: true },
    pricePerNight: { type: Number, required: true, min: 0 },
    totalRooms: { type: Number, required: true, min: 0 },
    availableRooms: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const HotelSchema = new Schema<IHotel>(
  {
    name: { type: String, required: true, trim: true, index: true },
    city: { type: String, required: true, trim: true, index: true },
    address: { type: String, required: true, trim: true },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: undefined }, // [lng, lat]
    },
    description: { type: String, default: "" },
    amenities: { type: [String], default: [] },
    images: { type: [String], default: [] },
    rooms: { type: [RoomSchema], default: [] },
    ratingAvg: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0, min: 0 },
    owner: { type: Schema.Types.ObjectId, ref: "User", index: true },
  },
  { timestamps: true }
);

// Geo index if using location
HotelSchema.index({ location: "2dsphere" });
// Basic search index
HotelSchema.index({ name: "text", city: "text", address: "text" });

export const HotelModel = model<IHotel>("Hotel", HotelSchema);

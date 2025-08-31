import { Schema, model } from "mongoose";

export type RoomKind = "STANDARD" | "DELUXE" | "SUITE";

const RoomSchema = new Schema(
  {
    roomType: { type: String, enum: ["STANDARD", "DELUXE", "SUITE"], required: true },
    pricePerNight: { type: Number, required: true, min: 0 },
    totalRooms: { type: Number, required: true, min: 0 },
    // optional bookkeeping field; availability מחושב מריזרביישנים, לא חובה להשתמש
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
  { timestamps: true, collection: "hotels" }
);

// Indexes
HotelSchema.index({ location: "2dsphere" });
HotelSchema.index({ name: "text", city: "text", address: "text", description: "text" });

export const HotelModel = model("Hotel", HotelSchema);

import { Schema, model, Types } from "mongoose";

/** Embedded reservations exactly like your TS types */
const RoomReservationSchema = new Schema(
  {
    reservationId: { type: Schema.Types.ObjectId, required: true },
    checkIn: { type: String, required: true },  // ISODateKey: YYYY-MM-DD
    checkOut: { type: String, required: true }, // ISODateKey: YYYY-MM-DD (exclusive)
  },
  { _id: false }
);

const RoomSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    capacity: { type: Number, required: true, min: 1 },
    pricePerNight: { type: Number, required: true, min: 0 },
    photos: [{ type: String }],
    amenities: [{ type: String }],
    categories: [{ type: String }],
    media: [{ type: Schema.Types.Mixed }],
    reservations: { type: [RoomReservationSchema], default: [] },
  },
  { _id: true }
);

const HotelSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    address: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true, index: true },
    city: { type: String, required: true, trim: true, index: true },

    // Store as simple lat/lng to match your GeoLocation type
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },

    stars: { type: Number, min: 1, max: 5, index: true },
    description: { type: String },

    rooms: { type: [RoomSchema], default: [] },
    adminIds: [{ type: Schema.Types.ObjectId, index: true }],
    amenityIds: [{ type: Schema.Types.ObjectId }],
    media: [{ type: Schema.Types.Mixed }],

    categories: [{ type: String, index: true }],

    // Rating 0..10 as in your TS
    averageRating: { type: Number, min: 0, max: 10, default: 0, index: true },
    reviewsCount: { type: Number, min: 0, default: 0 },

    ownerId: { type: Schema.Types.ObjectId, required: true, index: true },
    approvalStatus: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
      index: true,
    },
    submittedAt: { type: Date, default: Date.now },
    approvedAt: { type: Date },
  },
  { timestamps: true, collection: "hotels" }
);

// Helpful indices
HotelSchema.index({ city: 1, stars: -1, averageRating: -1 });
HotelSchema.index({ categories: 1, "rooms.pricePerNight": 1 });

export const HotelModel = model("Hotel", HotelSchema);

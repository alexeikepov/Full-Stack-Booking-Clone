import { Schema, model } from "mongoose";

const RoomReservationSchema = new Schema(
  {
    reservationId: { type: Schema.Types.ObjectId, required: true },
    checkIn: { type: String, required: true }, // ISO date string
    checkOut: { type: String, required: true }, // ISO date string
  },
  { _id: false }
);

const RoomSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    capacity: { type: Number, required: true, min: 1 },
    maxAdults: { type: Number, required: true, min: 0 },
    maxChildren: { type: Number, required: true, min: 0 },
    pricePerNight: { type: Number, required: true, min: 0 },

    // total rooms of this room type in the hotel (e.g., 12 identical doubles)
    totalRooms: { type: Number, required: true, min: 1 },
    // legacy field for compatibility
    totalUnits: { type: Number, min: 1 },
    // alternative field name for compatibility
    availableRooms: { type: Number, min: 1 },

    sizeSqm: { type: Number, min: 0 },
    bedrooms: { type: Number, min: 0 },
    bathrooms: { type: Number, min: 0 },

    photos: { type: [String], default: [] },
    amenities: { type: [String], default: [] },
    facilities: { type: [String], default: [] },
    categories: { type: [String], default: [] },
    media: { type: [Schema.Types.Mixed], default: [] },

    reservations: { type: [RoomReservationSchema], default: [] },
  },
  { _id: true }
);

// Instance method to compute available units for a given date range (exclusive end).
RoomSchema.methods.unitsAvailable = function (
  fromISO: string,
  toISO: string
): number {
  const from = new Date(fromISO);
  const to = new Date(toISO);
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()) || from >= to)
    return 0;

  const overlaps = this.reservations.filter((r: any) => {
    const rStart = new Date(r.checkIn);
    const rEnd = new Date(r.checkOut);
    return rStart < to && from < rEnd; // overlap if ranges intersect
  }).length;

  const left = this.totalUnits - overlaps;
  return left > 0 ? left : 0;
};

const HotelSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    address: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true, index: true },
    city: { type: String, required: true, trim: true, index: true },

    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },

    stars: { type: Number, min: 1, max: 5, index: true },
    description: { type: String },

    rooms: { type: [RoomSchema], default: [] },
    adminIds: { type: [Schema.Types.ObjectId], default: [], index: true },
    amenityIds: { type: [Schema.Types.ObjectId], default: [] },
    media: { type: [Schema.Types.Mixed], default: [] },

    categories: { type: [String], default: [], index: true },

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

    houseRules: { type: String, required: true, default: "" },
    checkIn: { type: String, required: true }, // e.g. "15:00"
    checkOut: { type: String, required: true }, // e.g. "11:00"
  },
  { timestamps: true, collection: "hotels" }
);

HotelSchema.index({ city: 1, stars: -1, averageRating: -1 });
HotelSchema.index({ categories: 1, "rooms.pricePerNight": 1 });
HotelSchema.index(
  {
    name: "text",
    address: "text",
    city: "text",
    country: "text",
    description: "text",
  },
  { weights: { name: 5, city: 3, address: 2, description: 1 } }
);

export const HotelModel = model("Hotel", HotelSchema);

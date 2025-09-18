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

    // House rules and policies
    houseRules: {
      checkIn: {
        time: { type: String, required: true, default: "15:00" },
        note: { type: String, default: "Guests are required to show a photo identification and credit card upon check-in" },
        advanceNotice: { type: String, default: "You'll need to let the property know in advance what time you'll arrive." }
      },
      checkOut: {
        time: { type: String, required: true, default: "11:00" }
      },
      cancellation: {
        policy: { type: String, default: "Cancellation and prepayment policies vary according to accommodation type." },
        conditions: { type: String, default: "Please check what conditions may apply to each option when making your selection." }
      },
      children: {
        welcome: { type: String, default: "Children of any age are welcome." },
        searchNote: { type: String, default: "To see correct prices and occupancy information, please add the number of children in your group and their ages to your search." },
        cotPolicy: {
          ageRange: { type: String, default: "0 - 2 years" },
          cotPrice: { type: String, default: "₪70 per child, per night" },
          note: { type: String, default: "Cot upon request" },
          additionalInfo: { type: String, default: "Prices for cots are not included in the total price, and will have to be paid for separately during your stay." },
          availability: { type: String, default: "The number of cots allowed is dependent on the option you choose. Please check your selected option for more information." },
          noExtraBeds: { type: String, default: "There are no extra beds available at this property." },
          subjectToAvailability: { type: String, default: "All cots are subject to availability." }
        }
      },
      ageRestriction: {
        hasRestriction: { type: Boolean, default: false },
        minimumAge: { type: Number, default: null },
        note: { type: String, default: "There is no age requirement for check-in" }
      },
      pets: {
        allowed: { type: Boolean, default: false },
        note: { type: String, default: "Pets are not allowed." }
      },
      paymentMethods: {
        methods: { type: [String], default: ["American Express", "Visa", "MasterCard", "JCB", "Maestro", "Discover", "UnionPay", "Cash"] }
      },
      parties: {
        allowed: { type: Boolean, default: false },
        note: { type: String, default: "Parties/events are not allowed" }
      }
    }
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

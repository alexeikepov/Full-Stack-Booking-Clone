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
    name: { type: String, required: true, trim: true }, // "STANDARD", "SUPERIOR", "DELUXE", etc.
    capacity: { type: Number, required: true, min: 1 },
    maxAdults: { type: Number, required: true, min: 0 },
    maxChildren: { type: Number, required: true, min: 0 },
    pricePerNight: { type: Number, required: true, min: 0 },

    // Room type details
    roomType: { type: String, required: true }, // "Standard", "Superior", "Deluxe", "Suite", "Family", "Business", "Accessible", "Premium"
    roomCategory: { type: String }, // "Couples", "Family", "Friends", "Business", "Accessible", "Premium"

    // Room specifications
    sizeSqm: { type: Number, min: 0 },
    bedrooms: { type: Number, min: 0 },
    bathrooms: { type: Number, min: 0 },

    // Availability
    totalRooms: { type: Number, required: true, min: 1 },
    totalUnits: { type: Number, min: 1 }, // legacy field for compatibility
    availableRooms: { type: Number, min: 1 }, // alternative field name for compatibility
    roomsLeft: { type: Number, min: 0, default: 0 }, // "Only 22 left on our site"

    // Room features and amenities
    features: { type: [String], default: [] }, // ["Private bathroom", "TV", "Mini fridge", "Free Wi-Fi", "City view", "Kettle", "Balcony", "Espresso"]
    amenities: { type: [String], default: [] },
    facilities: { type: [String], default: [] },
    categories: { type: [String], default: [] },

    // Special features
    specialFeatures: {
      hasBalcony: { type: Boolean, default: false },
      hasCityView: { type: Boolean, default: false },
      hasSeaView: { type: Boolean, default: false },
      hasPoolView: { type: Boolean, default: false },
      hasTerrace: { type: Boolean, default: false },
      hasJacuzzi: { type: Boolean, default: false },
      hasKitchen: { type: Boolean, default: false },
      hasKitchenette: { type: Boolean, default: false },
      hasMicrowave: { type: Boolean, default: false },
      hasSofaBed: { type: Boolean, default: false },
      hasKingBed: { type: Boolean, default: false },
      hasTwinBeds: { type: Boolean, default: false },
      hasQueenBeds: { type: Boolean, default: false },
      hasRainShower: { type: Boolean, default: false },
      hasBath: { type: Boolean, default: false },
      hasNespresso: { type: Boolean, default: false },
      hasEspresso: { type: Boolean, default: false },
      hasSmartTV: { type: Boolean, default: false },
      hasDesk: { type: Boolean, default: false },
      hasDiningTable: { type: Boolean, default: false },
      hasLivingArea: { type: Boolean, default: false },
      hasPrivateTerrace: { type: Boolean, default: false },
      hasOutdoorSeating: { type: Boolean, default: false },
      hasSpaAccess: { type: Boolean, default: false },
      hasPanoramicView: { type: Boolean, default: false },
      hasTwoTerraces: { type: Boolean, default: false },
      hasAccessibleBathroom: { type: Boolean, default: false },
      hasStepFreeAccess: { type: Boolean, default: false },
    },

    // Pricing and policies
    pricing: {
      basePrice: { type: Number, required: true, min: 0 },
      currency: { type: String, default: "₪" },
      includesBreakfast: { type: Boolean, default: false },
      freeCancellation: { type: Boolean, default: true },
      noPrepayment: { type: Boolean, default: true },
      priceMatch: { type: Boolean, default: true },
    },

    // Media
    photos: { type: [String], default: [] },
    media: { type: [Schema.Types.Mixed], default: [] },

    // Reservations
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
    shortDescription: { type: String }, // "Premium beachfront resort with multiple pools, spa, private beach access, kids club, and fine dining."

    // Hotel overview sections
    overview: {
      infoAndPrices: { type: String },
      activity: { type: String },
      facilities: { type: String },
      houseRules: { type: String },
      finePrint: { type: String },
      guestReviews: { type: String },
      travellersAsking: { type: String },
      hotelSurroundings: { type: String },
    },

    // Property highlights
    propertyHighlights: {
      perfectFor: { type: String }, // "Perfect for a 1-night stay!"
      locationScore: { type: Number }, // 9.5
      locationDescription: { type: String }, // "Situated in the real heart of Jerusalem, this hotel has an excellent location score of 9.5"
      roomsWith: { type: [String], default: [] }, // ["Terrace", "City view"]
    },

    // Most popular facilities
    mostPopularFacilities: { type: [String], default: [] }, // ["Private bathroom", "TV", "Mini fridge", "Free Wi-Fi", "City view", "Kettle", "Balcony", "Espresso"]

    // Hotel facilities
    facilities: {
      general: { type: [String], default: [] }, // ["Non-smoking rooms", "Family rooms", "Free WiFi", "Terrace", "Daily housekeeping", "Tea/coffee maker in all rooms", "Good breakfast"]
      greatForStay: { type: [String], default: [] },
      bathroom: { type: [String], default: [] },
      bedroom: { type: [String], default: [] },
      view: { type: [String], default: [] },
      outdoors: { type: [String], default: [] },
      kitchen: { type: [String], default: [] },
      roomAmenities: { type: [String], default: [] },
      livingArea: { type: [String], default: [] },
      mediaTechnology: { type: [String], default: [] },
      foodDrink: { type: [String], default: [] },
      internet: {
        type: String,
        default: "WiFi is available in the rooms and is free of charge.",
      },
      parking: { type: String, default: "No parking available." },
      receptionServices: { type: [String], default: [] },
      safetySecurity: { type: [String], default: [] },
      generalFacilities: { type: [String], default: [] },
      languagesSpoken: { type: [String], default: [] },
    },

    // Guest reviews summary
    guestReviews: {
      overallRating: { type: Number, min: 0, max: 10, default: 0 }, // 9.1
      overallLabel: { type: String, default: "" }, // "Fabulous"
      totalReviews: { type: Number, default: 0 }, // 1247
      categories: {
        staff: { type: Number, min: 0, max: 10, default: 0 }, // 9.5
        comfort: { type: Number, min: 0, max: 10, default: 0 }, // 9.1
        freeWifi: { type: Number, min: 0, max: 10, default: 0 }, // 9.9
        facilities: { type: Number, min: 0, max: 10, default: 0 }, // 8.8
        valueForMoney: { type: Number, min: 0, max: 10, default: 0 }, // 8.8
        cleanliness: { type: Number, min: 0, max: 10, default: 0 }, // 9.3
        location: { type: Number, min: 0, max: 10, default: 0 }, // 9.5
      },
    },

    // Hotel surroundings
    surroundings: {
      nearbyAttractions: [
        {
          name: { type: String, required: true },
          distance: { type: String, required: true }, // "1.1 km"
        },
      ],
      topAttractions: [
        {
          name: { type: String, required: true },
          distance: { type: String, required: true },
        },
      ],
      restaurantsCafes: [
        {
          name: { type: String, required: true },
          type: { type: String, required: true }, // "Cafe/bar"
          distance: { type: String, required: true },
        },
      ],
      naturalBeauty: [
        {
          name: { type: String, required: true },
          type: { type: String, required: true }, // "Mountain"
          distance: { type: String, required: true },
        },
      ],
      publicTransport: [
        {
          name: { type: String, required: true },
          type: { type: String, required: true }, // "Bus", "Train"
          distance: { type: String, required: true },
        },
      ],
      closestAirports: [
        {
          name: { type: String, required: true },
          distance: { type: String, required: true },
        },
      ],
    },

    // Travellers questions
    travellersQuestions: [
      {
        question: { type: String, required: true },
        answer: { type: String, default: "" },
      },
    ],

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
        note: {
          type: String,
          default:
            "Guests are required to show a photo identification and credit card upon check-in",
        },
        advanceNotice: {
          type: String,
          default:
            "You'll need to let the property know in advance what time you'll arrive.",
        },
      },
      checkOut: {
        time: { type: String, required: true, default: "11:00" },
      },
      cancellation: {
        policy: {
          type: String,
          default:
            "Cancellation and prepayment policies vary according to accommodation type.",
        },
        conditions: {
          type: String,
          default:
            "Please check what conditions may apply to each option when making your selection.",
        },
      },
      children: {
        welcome: { type: String, default: "Children of any age are welcome." },
        searchNote: {
          type: String,
          default:
            "To see correct prices and occupancy information, please add the number of children in your group and their ages to your search.",
        },
        cotPolicy: {
          ageRange: { type: String, default: "0 - 2 years" },
          cotPrice: { type: String, default: "₪70 per child, per night" },
          note: { type: String, default: "Cot upon request" },
          additionalInfo: {
            type: String,
            default:
              "Prices for cots are not included in the total price, and will have to be paid for separately during your stay.",
          },
          availability: {
            type: String,
            default:
              "The number of cots allowed is dependent on the option you choose. Please check your selected option for more information.",
          },
          noExtraBeds: {
            type: String,
            default: "There are no extra beds available at this property.",
          },
          subjectToAvailability: {
            type: String,
            default: "All cots are subject to availability.",
          },
        },
      },
      ageRestriction: {
        hasRestriction: { type: Boolean, default: false },
        minimumAge: { type: Number, default: null },
        note: {
          type: String,
          default: "There is no age requirement for check-in",
        },
      },
      pets: {
        allowed: { type: Boolean, default: false },
        note: { type: String, default: "Pets are not allowed." },
      },
      paymentMethods: {
        methods: {
          type: [String],
          default: [
            "American Express",
            "Visa",
            "MasterCard",
            "JCB",
            "Maestro",
            "Discover",
            "UnionPay",
            "Cash",
          ],
        },
      },
      parties: {
        allowed: { type: Boolean, default: false },
        note: { type: String, default: "Parties/events are not allowed" },
      },
    },
  },
  { timestamps: true, collection: "hotels" }
);

HotelSchema.index({ city: 1, stars: -1, averageRating: -1 });
// Replace invalid compound multikey index with two separate indexes
HotelSchema.index({ categories: 1 });
HotelSchema.index({ "rooms.pricePerNight": 1 });
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

// Attempt to drop legacy parallel arrays index if it exists to prevent
// "cannot index parallel arrays [rooms] [categories]" errors.
(async () => {
  try {
    const indexes = await HotelModel.collection.indexes();
    const bad = indexes.find((ix: any) => {
      const keys = Object.keys(ix.key || {});
      return keys.includes("categories") && keys.includes("rooms.pricePerNight");
    });
    if (bad?.name) {
      await HotelModel.collection.dropIndex(bad.name);
      // Recreate safe separate indexes (in case missing)
      await HotelModel.collection.createIndex({ categories: 1 });
      await HotelModel.collection.createIndex({ "rooms.pricePerNight": 1 });
    }
  } catch (err) {
    // ignore errors on startup (e.g., collection not yet created)
  }
})();

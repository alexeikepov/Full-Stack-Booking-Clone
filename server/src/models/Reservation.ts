import { Schema, model } from "mongoose";

export type ReservationStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED";
export type PaymentMethod = "NONE" | "CASH" | "CARD" | "PAYPAL";
export type RoomKind = "STANDARD" | "DELUXE" | "SUITE";

const ReservationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    hotel: {
      type: Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
      index: true,
    },

    // Room details
    roomType: { type: String, required: true }, // "STANDARD", "SUPERIOR", "DELUXE", etc.
    roomName: { type: String, required: true }, // "STANDARD CITY VIEW", "FAMILY SUITE", etc.
    roomId: { type: Schema.Types.ObjectId, ref: "Hotel.rooms", required: true },
    quantity: { type: Number, required: true, min: 1 }, // number of rooms

    // Guest details
    guests: {
      adults: { type: Number, required: true, min: 1 },
      children: { type: Number, default: 0, min: 0 },
      total: { type: Number, required: true, min: 1 },
    },

    // Dates
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    nights: { type: Number, required: true, min: 1 },

    // Pricing
    pricePerNight: { type: Number, required: true, min: 0 }, // snapshot from hotel at booking time
    totalPrice: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "₪" },

    // Pricing breakdown
    pricing: {
      basePrice: { type: Number, required: true, min: 0 },
      taxes: { type: Number, default: 0 },
      fees: { type: Number, default: 0 },
      discounts: { type: Number, default: 0 },
      total: { type: Number, required: true, min: 0 },
    },

    // Reservation status
    status: {
      type: String,
      enum: [
        "PENDING",
        "CONFIRMED",
        "CANCELLED",
        "COMPLETED",
        "NO_SHOW",
        "CHECKED_IN",
        "CHECKED_OUT",
      ],
      default: "PENDING",
      index: true,
    },

    // Payment information
    payment: {
      method: {
        type: String,
        enum: [
          "NONE",
          "CASH",
          "CARD",
          "PAYPAL",
          "AMERICAN_EXPRESS",
          "VISA",
          "MASTERCARD",
          "JCB",
          "MAESTRO",
          "DISCOVER",
          "UNIONPAY",
        ],
        default: "NONE",
      },
      paid: { type: Boolean, default: false },
      transactionId: { type: String },
      paymentDate: { type: Date },
      refundAmount: { type: Number, default: 0 },
      refundDate: { type: Date },
    },

    // Guest information
    guestInfo: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String },
      country: { type: String },
      specialRequests: { type: String },
      dietaryRequirements: { type: String },
      arrivalTime: { type: String },
      departureTime: { type: String },
    },

    // Children details
    children: [
      {
        name: { type: String },
        age: { type: Number, required: true },
        needsCot: { type: Boolean, default: false },
        cotPrice: { type: Number, default: 0 },
      },
    ],

    // Policies
    policies: {
      freeCancellation: { type: Boolean, default: true },
      noPrepayment: { type: Boolean, default: true },
      priceMatch: { type: Boolean, default: true },
      cancellationDeadline: { type: Date },
      cancellationPolicy: { type: String },
    },

    // Special requests
    specialRequests: [
      {
        type: { type: String, required: true }, // "EARLY_CHECKIN", "LATE_CHECKOUT", "HIGH_FLOOR", "QUIET_ROOM", "ADJACENT_ROOMS", "EXTRA_BED", "COT", "WHEELCHAIR_ACCESS", "PET_FRIENDLY", "SMOKING", "NON_SMOKING"
        description: { type: String, required: true },
        status: {
          type: String,
          enum: ["PENDING", "APPROVED", "REJECTED"],
          default: "PENDING",
        },
        additionalCost: { type: Number, default: 0 },
        approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
        approvedAt: { type: Date },
      },
    ],

    // Confirmation details
    confirmation: {
      confirmationNumber: { type: String, unique: true, sparse: true },
      confirmationEmailSent: { type: Boolean, default: false },
      confirmationEmailSentAt: { type: Date },
      reminderEmailSent: { type: Boolean, default: false },
      reminderEmailSentAt: { type: Date },
    },

    // Check-in/out details
    checkInDetails: {
      checkedInAt: { type: Date },
      checkedInBy: { type: Schema.Types.ObjectId, ref: "User" },
      roomNumber: { type: String },
      keyCardIssued: { type: Boolean, default: false },
    },

    checkOutDetails: {
      checkedOutAt: { type: Date },
      checkedOutBy: { type: Schema.Types.ObjectId, ref: "User" },
      keyCardReturned: { type: Boolean, default: false },
      finalBill: { type: Number, default: 0 },
    },

    // Notes and comments
    notes: { type: String, default: "" },
    internalNotes: { type: String, default: "" }, // For hotel staff only
    guestNotes: { type: String, default: "" }, // Notes from guest

    // Review tracking
    reviewRequested: { type: Boolean, default: false },
    reviewRequestedAt: { type: Date },
    reviewSubmitted: { type: Boolean, default: false },
    reviewSubmittedAt: { type: Date },
    reviewId: { type: Schema.Types.ObjectId, ref: "Review" },

    // Shared with friends
    sharedWith: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true, collection: "reservations" }
);

// חישוב nights ו־totalPrice אוטומטי
ReservationSchema.pre("validate", function (next) {
  const msPerDay = 1000 * 60 * 60 * 24;
  const start = this.checkIn ? new Date(this.checkIn).getTime() : 0;
  const end = this.checkOut ? new Date(this.checkOut).getTime() : 0;
  const nights = Math.max(0, Math.ceil((end - start) / msPerDay));
  this.nights = nights;

  // Calculate total guests
  if (this.guests) {
    this.guests.total = (this.guests.adults || 0) + (this.guests.children || 0);
  }

  // Calculate total price
  if (this.pricePerNight != null && this.quantity != null) {
    this.totalPrice = Math.max(0, nights * this.pricePerNight * this.quantity);

    // Update pricing breakdown
    if (this.pricing) {
      this.pricing.basePrice = this.totalPrice;
      this.pricing.total =
        this.pricing.basePrice +
        (this.pricing.taxes || 0) +
        (this.pricing.fees || 0) -
        (this.pricing.discounts || 0);
    }
  }

  // Generate confirmation number if not exists
  if (!this.confirmation?.confirmationNumber && this.status === "CONFIRMED") {
    if (!this.confirmation) {
      this.confirmation = {
        confirmationEmailSent: false,
        reminderEmailSent: false,
      };
    }
    this.confirmation.confirmationNumber = `RES${Date.now()}${Math.random()
      .toString(36)
      .substr(2, 5)
      .toUpperCase()}`;
  }

  next();
});

// אינדקסים מועילים
ReservationSchema.index({ hotel: 1, roomType: 1, checkIn: 1, checkOut: 1 });
ReservationSchema.index({ user: 1, createdAt: -1 });
ReservationSchema.index({ status: 1, checkIn: 1 });
ReservationSchema.index({ "confirmation.confirmationNumber": 1 });
ReservationSchema.index({ "guestInfo.email": 1 });
ReservationSchema.index({ checkIn: 1, checkOut: 1 });
ReservationSchema.index({ sharedWith: 1 });

export const ReservationModel = model("Reservation", ReservationSchema);

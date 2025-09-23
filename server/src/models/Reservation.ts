import { Schema, model } from "mongoose";

export type ReservationStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
export type PaymentMethod = "NONE" | "CASH" | "CARD" | "PAYPAL";
export type RoomKind = "STANDARD" | "DELUXE" | "SUITE";

const ReservationSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    hotel: { type: Schema.Types.ObjectId, ref: "Hotel", required: true, index: true },

    roomType: { type: String, enum: ["STANDARD", "DELUXE", "SUITE"], required: true },
    quantity: { type: Number, required: true, min: 1 }, // number of rooms
    guests: { type: Number, required: true, min: 1 },

    from: { type: Date, required: true }, // check-in
    to: { type: Date, required: true },   // check-out
    nights: { type: Number, required: true, min: 1 },

    pricePerNight: { type: Number, required: true, min: 0 }, // snapshot from hotel at booking time
    totalPrice: { type: Number, required: true, min: 0 },

    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"],
      default: "PENDING",
      index: true,
    },

    payment: {
      method: { type: String, enum: ["NONE", "CASH", "CARD", "PAYPAL"], default: "NONE" },
      paid: { type: Boolean, default: false },
      transactionId: { type: String },
    },

    notes: { type: String, default: "" },
  },
  { timestamps: true, collection: "reservations" }
);

// חישוב nights ו־totalPrice אוטומטי
ReservationSchema.pre("validate", function (next) {
  const msPerDay = 1000 * 60 * 60 * 24;
  const start = this.from ? new Date(this.from).getTime() : 0;
  const end = this.to ? new Date(this.to).getTime() : 0;
  const nights = Math.max(0, Math.ceil((end - start) / msPerDay));
  this.nights = nights;

  if (this.pricePerNight != null && this.quantity != null) {
    this.totalPrice = Math.max(0, nights * this.pricePerNight * this.quantity);
  }
  next();
});

// אינדקסים מועילים
ReservationSchema.index({ hotel: 1, roomType: 1, from: 1, to: 1 });
ReservationSchema.index({ user: 1, createdAt: -1 });

export const ReservationModel = model("Reservation", ReservationSchema);

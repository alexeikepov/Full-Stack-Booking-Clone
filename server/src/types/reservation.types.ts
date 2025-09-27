import { ID } from "./common";

export enum ReservationStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
  NO_SHOW = "NO_SHOW",
  CHECKED_IN = "CHECKED_IN",
  CHECKED_OUT = "CHECKED_OUT",
}

export type Reservation = {
  id: ID;
  user: ID;
  hotel: ID;

  // Room details
  roomType: string; // "STANDARD", "SUPERIOR", "DELUXE", etc.
  roomName: string; // "STANDARD CITY VIEW", "FAMILY SUITE", etc.
  roomId: ID;
  quantity: number; // number of rooms

  // Guest details
  guests: {
    adults: number;
    children: number;
    total: number;
  };

  // Dates
  checkIn: Date;
  checkOut: Date;
  nights: number;

  // Pricing
  pricePerNight: number;
  totalPrice: number;
  currency?: string;

  // Pricing breakdown
  pricing?: {
    basePrice: number;
    taxes?: number;
    fees?: number;
    discounts?: number;
    total: number;
  };

  // Reservation status
  status: ReservationStatus;

  // Payment information
  payment?: {
    method?:
      | "NONE"
      | "CASH"
      | "CARD"
      | "PAYPAL"
      | "AMERICAN_EXPRESS"
      | "VISA"
      | "MASTERCARD"
      | "JCB"
      | "MAESTRO"
      | "DISCOVER"
      | "UNIONPAY";
    paid?: boolean;
    transactionId?: string;
    paymentDate?: Date;
    refundAmount?: number;
    refundDate?: Date;
  };

  // Guest information
  guestInfo?: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    country?: string;
    specialRequests?: string;
    dietaryRequirements?: string;
    arrivalTime?: string;
    departureTime?: string;
  };

  // Children details
  children?: Array<{
    name?: string;
    age: number;
    needsCot?: boolean;
    cotPrice?: number;
  }>;

  // Policies
  policies?: {
    freeCancellation?: boolean;
    noPrepayment?: boolean;
    priceMatch?: boolean;
    cancellationDeadline?: Date;
    cancellationPolicy?: string;
  };

  // Special requests
  specialRequests?: Array<{
    type: string; // "EARLY_CHECKIN", "LATE_CHECKOUT", "HIGH_FLOOR", "QUIET_ROOM", "ADJACENT_ROOMS", "EXTRA_BED", "COT", "WHEELCHAIR_ACCESS", "PET_FRIENDLY", "SMOKING", "NON_SMOKING"
    description: string;
    status?: "PENDING" | "APPROVED" | "REJECTED";
    additionalCost?: number;
    approvedBy?: ID;
    approvedAt?: Date;
  }>;

  // Confirmation details
  confirmation?: {
    confirmationNumber?: string;
    confirmationEmailSent?: boolean;
    confirmationEmailSentAt?: Date;
    reminderEmailSent?: boolean;
    reminderEmailSentAt?: Date;
  };

  // Check-in/out details
  checkInDetails?: {
    checkedInAt?: Date;
    checkedInBy?: ID;
    roomNumber?: string;
    keyCardIssued?: boolean;
  };

  checkOutDetails?: {
    checkedOutAt?: Date;
    checkedOutBy?: ID;
    keyCardReturned?: boolean;
    finalBill?: number;
  };

  // Notes and comments
  notes?: string;
  internalNotes?: string; // For hotel staff only
  guestNotes?: string; // Notes from guest

  // Review tracking
  reviewRequested?: boolean;
  reviewRequestedAt?: Date;
  reviewSubmitted?: boolean;
  reviewSubmittedAt?: Date;
  reviewId?: ID;

  createdAt: Date;
  updatedAt?: Date;
};

export type BookingGuest = {
  id: ID;
  reservationId: ID;
  name: string;
  age?: number;
  note?: string;
};

export enum SpecialRequestStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export type SpecialRequest = {
  id: ID;
  reservationId: ID;
  requestedByUserId: ID;
  text: string;
  status: SpecialRequestStatus;
  createdAt: Date;
};

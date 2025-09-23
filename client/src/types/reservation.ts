// src/types/reservation.ts

export type ReservationStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED"
  | "NO_SHOW"
  | "CHECKED_IN"
  | "CHECKED_OUT";

export type PaymentMethod =
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

export type Reservation = {
  _id: { $oid: string };
  user: { $oid: string };
  hotel: { $oid: string };

  // Room details
  roomName: string;
  roomId: { $oid: string };
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
    taxes: number;
    fees: number;
    discounts: number;
    total: number;
  };

  // Reservation status
  status: ReservationStatus;

  // Payment information
  payment?: {
    method?: PaymentMethod;
    paid?: boolean;
    transactionId?: string;
    paymentDate?: Date;
    refundAmount?: number;
    refundDate?: Date;
  };

  // Guest information
  guestInfo?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
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
    type: string; // "EARLY_CHECKIN", "LATE_CHECKOUT", "HIGH_FLOOR", etc.
    description: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    additionalCost?: number;
    approvedBy?: { $oid: string };
    approvedAt?: Date;
  }>;

  // Confirmation details
  confirmation?: {
    confirmationNumber?: string;
    confirmationEmailSentAt?: Date;
    reminderEmailSent?: boolean;
    reminderEmailSentAt?: Date;
  };

  // Check-in details
  checkInDetails?: {
    checkedInAt?: Date;
    checkedInBy?: { $oid: string };
    roomNumber?: string;
    keyCardIssued?: boolean;
  };

  // Check-out details
  checkOutDetails?: {
    checkedOutAt?: Date;
    checkedOutBy?: { $oid: string };
    keyCardReturned?: boolean;
    finalBill?: number;
  };

  // Notes
  internalNotes?: string;
  guestNotes?: string;

  // Review tracking
  reviewRequested?: boolean;
  reviewSubmitted?: boolean;
  reviewSubmittedAt?: Date;
  reviewId?: { $oid: string };

  createdAt: Date;
  updatedAt?: Date;
};

export interface CreateReservationData {
  roomName: string;
  roomId: string;
  quantity: number;
  guests: {
    adults: number;
    children: number;
  };
  checkIn: string | Date;
  checkOut: string | Date;
  guestInfo?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    specialRequests?: string;
    dietaryRequirements?: string;
    arrivalTime?: string;
    departureTime?: string;
  };
  children?: Array<{
    name?: string;
    age: number;
    needsCot?: boolean;
  }>;
  specialRequests?: Array<{
    type: string;
    description: string;
    additionalCost?: number;
  }>;
  payment?: {
    method?: PaymentMethod;
    paid?: boolean;
    transactionId?: string;
  };
  policies?: {
    freeCancellation?: boolean;
    noPrepayment?: boolean;
    priceMatch?: boolean;
    cancellationDeadline?: string;
    cancellationPolicy?: string;
  };
  notes?: string;
}

export interface UpdateReservationData extends Partial<CreateReservationData> {}

export interface SpecialRequestData {
  type: string;
  description: string;
  additionalCost?: number;
}

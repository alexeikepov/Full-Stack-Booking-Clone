import { ID } from "./common";

export enum ChargeType { FIXED = "FIXED", PERCENTAGE = "PERCENTAGE" }
export enum ChargeScope { HOTEL = "HOTEL", ROOM = "ROOM" }
export enum ChargeBasis { PER_STAY = "PER_STAY", PER_NIGHT = "PER_NIGHT", PER_GUEST = "PER_GUEST" }

export type TaxOrFee = {
  id: ID;
  hotelId: ID;
  roomId?: ID;
  scope: ChargeScope;
  name: string;
  amount: number;
  type: ChargeType;
  basis: ChargeBasis;
  mandatory: boolean;
  currency?: string;   // "USD","EUR","ILS" etc.
  validFrom?: Date;
  validUntil?: Date;
};

export enum PaymentStatus { PENDING="PENDING", COMPLETED="COMPLETED", FAILED="FAILED", REFUNDED="REFUNDED" }
export type PaymentMethod = "CREDIT_CARD" | "PAYPAL" | "GOOGLE_PAY";

export type Payment = {
  id: ID;
  reservationId: ID;
  userId: ID;
  amount: number;
  currency?: string;
  method: PaymentMethod;
  status: PaymentStatus;
  createdAt: Date;
  refundedAt?: Date;
};

export type Discount = {
  id: ID;
  code: string;
  percentage: number;
  validFrom: Date;
  validUntil: Date;
  applicableHotelIds?: ID[];
  applicableRoomIds?: ID[];
  usageLimit?: number;
};

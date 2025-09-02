import { ID } from "./common";

export enum ReservationStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
}

export type Reservation = {
  id: ID;
  hotelId: ID;
  roomIds: ID[];
  userIds: ID[];
  status: ReservationStatus;
  createdAt: Date;
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

import { ID, GeoLocation } from "./common";
import type { Media, Amenity } from "./media.types";

export enum HotelApprovalStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export type Hotel = {
  id: ID;
  name: string;
  address: string;
  country: string;
  city: string;
  location: GeoLocation;
  stars?: number;
  description?: string;
  rooms: Room[];
  adminIds: ID[];
  amenityIds?: ID[];
  media?: Media[];
  categories?: string[];
  averageRating?: number;
  reviewsCount?: number;
  ownerId: ID;
  approvalStatus: HotelApprovalStatus;
  submittedAt: Date;
  approvedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

export type Room = {
  id: ID;
  name: string;
  capacity: number;
  pricePerNight: number;
  photos?: string[];
  amenities?: string[];
  categories?: string[];
  media?: Media[];
  reservations: RoomReservation[];
};

export type RoomReservation = {
  reservationId: ID;
  checkIn: string; // ISODateKey
  checkOut: string; // ISODateKey
};

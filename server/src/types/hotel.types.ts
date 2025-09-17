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
  amenities?: Amenity[];
  media: Media[];
  categories?: string[];
  averageRating?: number;
  reviewsCount?: number;
  ownerId: ID;
  approvalStatus: HotelApprovalStatus;
  submittedAt: Date;
  approvedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;

  houseRules: {
    checkIn: {
      time: string;
      note: string;
      advanceNotice: string;
    };
    checkOut: {
      time: string;
    };
    cancellation: {
      policy: string;
      conditions: string;
    };
    children: {
      welcome: string;
      searchNote: string;
      cotPolicy: {
        ageRange: string;
        cotPrice: string;
        note: string;
        additionalInfo: string;
        availability: string;
        noExtraBeds: string;
        subjectToAvailability: string;
      };
    };
    ageRestriction: {
      hasRestriction: boolean;
      minimumAge?: number;
      note: string;
    };
    pets: {
      allowed: boolean;
      note: string;
    };
    paymentMethods: {
      methods: string[];
    };
    parties: {
      allowed: boolean;
      note: string;
    };
  };
};

export type Room = {
  id: ID;
  name: string;
  capacity: number;
  maxAdults: number;
  maxChildren: number;

  pricePerNight: number;

  sizeSqm?: number;
  bedrooms?: number;
  bathrooms?: number;

  photos?: string[];
  amenities?: string[];
  facilities?: string[];
  categories?: string[];
  media?: Media[];
  availableRooms: number; 
  reservations: RoomReservation[];
};

export type RoomReservation = {
  reservationId: ID;
  checkIn: string;
  checkOut: string;
};

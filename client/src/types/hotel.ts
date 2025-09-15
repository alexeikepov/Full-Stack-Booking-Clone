// src/types/hotel.ts

export type HotelApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

export type RoomReservation = {
  reservationId: string; // unique id
  checkIn: string; // ISO date string
  checkOut: string; // ISO date string
};

export type Room = {
  id: string;
  name: string;
  capacity: number;
  pricePerNight: number;
  photos?: string[];
  amenities?: string[];
  facilities?: string[];
  categories?: string[];
  media?: { url: string; type?: string }[];
  reservations: RoomReservation[];
};

export type Hotel = {
  id: string;
  name: string;
  address: string;
  country: string;
  city: string;
  location?: {
    lat: number;
    lng: number;
  };
  stars?: number;
  description?: string;
  rooms: Room[];
  adminIds: string[];
  amenityIds?: string[];
  media?: { url: string; type?: string }[];
  categories?: string[];
  averageRating?: number;
  reviewsCount?: number;
  ownerId: string;
  approvalStatus: HotelApprovalStatus;
  submittedAt: Date;
  approvedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;

  // computed fields from backend (optional)
  priceFrom?: number | null; // cheapest nightly price
  totalPrice?: number | null; // total for stay (when dates provided)
  availability?: {
    from: string;
    to: string;
    totalAvailable: number;
    availableByType: Record<string, number>;
  };
};

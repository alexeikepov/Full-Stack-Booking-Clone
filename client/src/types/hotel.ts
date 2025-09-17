// src/types/hotel.ts

export type HotelApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

export type RoomReservation = {
  reservationId: string; // unique id
  checkIn: string; // ISO date string
  checkOut: string; // ISO date string
};

export type Room = {
  _id: { $oid: string };
  name: string;
  capacity: number;
  maxAdults: number;
  maxChildren: number;
  pricePerNight: number;
  sizeSqm: number;
  bedrooms: number;
  bathrooms: number;
  photos: string[];
  amenities: string[];
  facilities: string[];
  categories: string[];
  media: { url: string; type?: string }[];
  availableRooms: number;
  reservations: RoomReservation[];
};

export type Hotel = {
  _id: { $oid: string };
  name: string;
  address: string;
  country: string;
  city: string;
  location: {
    lat: number;
    lng: number;
  };
  stars: number;
  description: string;
  rooms: Room[];
  adminIds: { $oid: string }[];
  amenityIds: { $oid: string }[];
  media: { url: string; type?: string }[];
  categories: string;
  averageRating: number;
  reviewsCount: number;
  ratingLabel?: string; // "Fabulous", "Good", "Excellent"
  categoryRatings?: {
    staff: number;
    comfort: number;
    freeWifi: number;
    facilities: number;
    valueForMoney: number;
    cleanliness: number;
    location: number;
  };
  categoryNames?: {
    staff: string;
    comfort: string;
    freeWifi: string;
    facilities: string;
    valueForMoney: string;
    cleanliness: string;
    location: string;
  };
  highScoreCategories?: string[]; // categories that show arrow
  highScoreTexts?: Record<string, string>; // custom text for high scores
  reviewTopics?: string[]; // topics for filter buttons
  guestReviews?: {
    id: string;
    reviewerName: string;
    reviewerInitial: string;
    country: string;
    countryCode: string;
    reviewText: string;
    rating: number;
  }[];
  ownerId: { $oid: string };
  approvalStatus: HotelApprovalStatus;
  submittedAt: { $date: string };
  approvedAt: { $date: string };
  createdAt: { $date: string };
  updatedAt: { $date: string };
  houseRules: string;
  checkIn: string;
  checkOut: string;

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

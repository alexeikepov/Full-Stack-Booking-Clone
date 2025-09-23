// src/types/review.ts

export type Review = {
  _id: { $oid: string };
  hotel: { $oid: string };
  user: { $oid: string };

  // Basic review info
  rating: number; // 1-10
  comment: string;

  // Guest info
  guestName: string; // "Michael", "Josh"
  guestCountry: string; // "Israel", "United States"
  guestInitial: string; // "M", "J"

  // Detailed ratings
  categoryRatings?: {
    staff?: number; // 1-10
    comfort?: number; // 1-10
    freeWifi?: number; // 1-10
    facilities?: number; // 1-10
    valueForMoney?: number; // 1-10
    cleanliness?: number; // 1-10
    location?: number; // 1-10
  };

  // Review metadata
  reviewType?: "GUEST" | "VERIFIED" | "ANONYMOUS";
  isVerified?: boolean;
  helpfulVotes?: number;
  reportCount?: number;

  // Stay details
  stayDate?: Date;
  roomType?: string;
  travelType?:
    | "BUSINESS"
    | "LEISURE"
    | "COUPLE"
    | "FAMILY"
    | "FRIENDS"
    | "SOLO";

  // Review status
  status?: "PENDING" | "APPROVED" | "REJECTED" | "HIDDEN";
  moderatedAt?: Date;
  moderatedBy?: { $oid: string };

  // Response from hotel
  hotelResponse?: {
    text?: string;
    respondedAt?: Date;
    respondedBy?: { $oid: string };
  };

  createdAt: Date;
  updatedAt?: Date;
};

export type ReviewStats = {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: Record<number, number>;
  travelTypeDistribution: Record<string, number>;
};

export type CreateReviewData = {
  rating: number;
  comment?: string;
  guestName: string;
  guestCountry: string;
  guestInitial: string;
  categoryRatings?: {
    staff?: number;
    comfort?: number;
    freeWifi?: number;
    facilities?: number;
    valueForMoney?: number;
    cleanliness?: number;
    location?: number;
  };
  stayDate?: string;
  roomType?: string;
  travelType?:
    | "BUSINESS"
    | "LEISURE"
    | "COUPLE"
    | "FAMILY"
    | "FRIENDS"
    | "SOLO";
};

export type UpdateReviewData = Partial<CreateReviewData>;

export type HotelResponseData = {
  text: string;
};

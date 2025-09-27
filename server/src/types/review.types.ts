import { ID } from "./common";

export type Review = {
  id: ID;
  hotel: ID;
  user: ID;

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
  moderatedBy?: ID;

  // Response from hotel
  hotelResponse?: {
    text?: string;
    respondedAt?: Date;
    respondedBy?: ID;
  };

  createdAt: Date;
  updatedAt?: Date;
};

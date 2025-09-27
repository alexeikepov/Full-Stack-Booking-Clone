export type CreateReviewData = {
  rating: number;
  comment: string;
  negative?: string;
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
  travelType?: string;
  stayDate?: string;
  roomType?: string;
  photos?: string[];
  helpful?: number;
  verified?: boolean;
  anonymous?: boolean;
};

export type UpdateReviewData = Partial<CreateReviewData>;

export type HotelResponseData = {
  response: string;
  respondedBy?: string;
  respondedAt?: Date;
};

export type ReviewStats = {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    [key: number]: number;
  };
  categoryAverages?: {
    staff?: number;
    comfort?: number;
    facilities?: number;
    location?: number;
    cleanliness?: number;
    value?: number;
  };
};

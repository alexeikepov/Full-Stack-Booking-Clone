// src/types/reviewTypes.ts
export interface ReviewQueryParams {
  page?: string;
  limit?: string;
  sort?: "newest" | "oldest" | "rating_high" | "rating_low" | "helpful";
  rating?: string;
  travelType?: string;
  status?: string;
}

export interface ReviewFilter {
  hotel: string;
  status?: string;
  rating?: number;
  travelType?: string;
}

export interface ReviewSortQuery {
  createdAt?: 1 | -1;
  rating?: 1 | -1;
  helpfulVotes?: 1 | -1;
}

export interface ReviewStatsResult {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: Record<number, number>;
  travelTypeDistribution: Record<string, number>;
  categoryAverages: {
    staff?: number;
    comfort?: number;
    freeWifi?: number;
    facilities?: number;
    valueForMoney?: number;
    cleanliness?: number;
    location?: number;
  };
}

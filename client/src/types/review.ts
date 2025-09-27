export interface Review {
  id: string;
  hotel: string;
  city: string;
  country?: string;
  stayed: string;
  reviewed: string;
  score: number;
  positive?: string;
  negative?: string;
  response?: string;
  thumbnail?: string;
  status?: string;
  categoryRatings?: {
    staff?: number;
    comfort?: number;
    freeWifi?: number;
    facilities?: number;
    valueForMoney?: number;
    cleanliness?: number;
    location?: number;
  };
  reviewedYear?: number;
}

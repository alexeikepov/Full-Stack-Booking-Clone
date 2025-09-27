export interface Room {
  _id?: string;
  name: string;
  roomType: string;
  capacity: number;
  maxAdults: number;
  maxChildren: number;
  pricePerNight: number;
  totalRooms: number;
  sizeSqm: number;
  bedrooms: number;
  bathrooms: number;
  features: string[];
  photos: string[];
  media: string[];
  pricing: {
    basePrice: number;
    currency: string;
    includesBreakfast: boolean;
    freeCancellation: boolean;
    noPrepayment: boolean;
    priceMatch: boolean;
  };
}

export interface Hotel {
  id: string;
  name: string;
  address?: string;
  city?: string;
  country?: string;
  status: string;
  averageRating?: number;
  reviewsCount?: number;
  rooms?: Room[];
  createdAt?: string;
  lastBooking?: string;
  contactInfo?: {
    phone?: string;
    email?: string;
  };
  isVisible?: boolean;
  approvalStatus?: string;
  location?: {
    lat: number;
    lng: number;
  };
  facilities?: any;
  houseRules?: any;
  propertyHighlights?: any;
  surroundings?: any;
  overview?: any;
  mostPopularFacilities?: any[];
  categories?: any[];
  travellersQuestions?: any;
}

export interface AnalyticsData {
  totalRevenue: number;
  totalBookings: number;
  averageOccupancy: number;
  totalReviews: number;
  topPerformingHotels: Array<{
    name: string;
    revenue: number;
    bookings: number;
  }>;
}

export interface Reservation {
  _id?: string;
  id?: string;
  guestInfo?: {
    firstName?: string;
    lastName?: string;
  };
  checkIn: string;
  checkOut: string;
  quantity: number;
  guests?: {
    total?: number;
    adults?: number;
    children?: number;
  };
  totalPrice?: number;
  status: string;
}

export interface Review {
  _id?: string;
  id?: string;
  rating: number;
  guestName?: string;
  user?: { name: string };
  guestCountry?: string;
  createdAt?: string;
  stayDate?: string;
  roomType?: string;
  travelType?: string;
  comment?: string;
  negative?: string;
  categoryRatings?: Record<string, number>;
  hotelResponse?: {
    text: string;
    respondedAt?: string;
  };
}

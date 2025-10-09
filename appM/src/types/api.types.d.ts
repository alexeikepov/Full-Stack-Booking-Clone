// API types that match the server's Hotel model structure

export interface ApiLocation {
  lat: number;
  lng: number;
}

export interface ApiRoom {
  _id: string;
  name: string; // "STANDARD", "SUPERIOR", "DELUXE", etc.
  capacity: number;
  maxAdults: number;
  maxChildren: number;
  pricePerNight: number;
  roomType: string;
  roomCategory?: string;
  sizeSqm?: number;
  bedrooms?: number;
  bathrooms?: number;
  totalRooms: number;
  totalUnits?: number;
  availableRooms?: number;
  roomsLeft?: number;
  features: string[];
  amenities: string[];
  facilities: string[];
  categories: string[];
  specialFeatures: {
    hasBalcony: boolean;
    hasCityView: boolean;
    hasSeaView: boolean;
    hasPoolView: boolean;
    hasTerrace: boolean;
    hasJacuzzi: boolean;
    hasKitchen: boolean;
    hasKitchenette: boolean;
    hasMicrowave: boolean;
    hasSofaBed: boolean;
    hasKingBed: boolean;
    hasTwinBeds: boolean;
    hasQueenBeds: boolean;
    hasRainShower: boolean;
    hasBath: boolean;
    hasNespresso: boolean;
    hasEspresso: boolean;
    hasSmartTV: boolean;
    hasDesk: boolean;
    hasDiningTable: boolean;
    hasLivingArea: boolean;
    hasPrivateTerrace: boolean;
    hasOutdoorSeating: boolean;
    hasSpaAccess: boolean;
    hasPanoramicView: boolean;
    hasTwoTerraces: boolean;
    hasAccessibleBathroom: boolean;
    hasStepFreeAccess: boolean;
  };
  pricing: {
    basePrice: number;
    currency: string;
    includesBreakfast: boolean;
    freeCancellation: boolean;
    noPrepayment: boolean;
    priceMatch: boolean;
  };
  photos: string[];
  media: any[];
  reservations: {
    reservationId: string;
    checkIn: string;
    checkOut: string;
  }[];
}

export interface ApiGuestReviews {
  overallRating: number;
  overallLabel: string;
  totalReviews: number;
  categories: {
    staff: number;
    comfort: number;
    freeWifi: number;
    facilities: number;
    valueForMoney: number;
    cleanliness: number;
    location: number;
  };
}

export interface ApiPropertyHighlights {
  perfectFor?: string;
  locationScore?: number;
  locationDescription?: string;
  roomsWith: string[];
}

export interface ApiFacilities {
  general: string[];
  greatForStay: string[];
  bathroom: string[];
  bedroom: string[];
  view: string[];
  outdoors: string[];
  kitchen: string[];
  roomAmenities: string[];
  livingArea: string[];
  mediaTechnology: string[];
  foodDrink: string[];
  internet: string;
  parking: string;
  receptionServices: string[];
  safetySecurity: string[];
  generalFacilities: string[];
  languagesSpoken: string[];
}

export interface ApiOverview {
  infoAndPrices?: string;
  activity?: string;
  facilities?: string;
  houseRules?: string;
  finePrint?: string;
  guestReviews?: string;
  travellersAsking?: string;
  hotelSurroundings?: string;
}

export interface ApiSurroundings {
  nearbyAttractions: {
    name: string;
    distance: string;
  }[];
  topAttractions: {
    name: string;
    distance: string;
  }[];
  restaurantsCafes: {
    name: string;
    type: string;
    distance: string;
  }[];
  naturalBeauty: {
    name: string;
    type: string;
    distance: string;
  }[];
  publicTransport: {
    name: string;
    type: string;
    distance: string;
  }[];
  closestAirports: {
    name: string;
    distance: string;
  }[];
}

export interface ApiHouseRules {
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
}

export interface ApiHotel {
  _id: string;
  name: string;
  address: string;
  country: string;
  city: string;
  location: ApiLocation;
  stars?: number;
  description?: string;
  shortDescription?: string;
  overview: ApiOverview;
  propertyHighlights: ApiPropertyHighlights;
  mostPopularFacilities: string[];
  facilities: ApiFacilities;
  guestReviews: ApiGuestReviews;
  surroundings: ApiSurroundings;
  travellersQuestions: {
    question: string;
    answer: string;
  }[];
  rooms: ApiRoom[];
  adminIds: string[];
  amenityIds: string[];
  media: any[];
  categories: string[];
  averageRating: number;
  reviewsCount: number;
  ownerId: string;
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
  isVisible: boolean;
  submittedAt: string;
  approvedAt?: string;
  houseRules: ApiHouseRules;
  createdAt: string;
  updatedAt: string;
}

// Search and listing types
export interface SearchParams {
  q?: string;
  city?: string;
  roomType?: string;
  minPrice?: number;
  maxPrice?: number;
  category?: string;
  from?: string; // ISO date string
  to?: string; // ISO date string
  adults?: number;
  children?: number;
  rooms?: number;
  sort?: string;
  minStars?: number;
  maxStars?: number;
}

export interface ListHotelsResponse {
  hotels: ApiHotel[];
  totalCount: number;
  searchMeta?: {
    nights?: number;
    totalGuests?: number;
    requestedRooms?: number;
  };
}

// Transformed types for the mobile app - matches existing Property type
export interface AppProperty {
  id: string;
  title: string;
  rating: string;
  description: string;
  price: string;
  currency?: string;
  imageSource: any; // Will be transformed from API photos
  location: string;
  distance: string;
  deal?: string;
  oldPrice?: string;
  taxesIncluded: boolean;
  reviewCount: string;
  ratingText: string;
  stars?: number;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  // Server image data for gallery
  media?: any[];
  rooms?: ApiRoom[];
  details: {
    confirmationNumber?: string;
    pin?: string;
    checkIn?: string;
    checkOut?: string;
    address: string;
    roomType: string;
    includedExtras: string;
    breakfastIncluded: boolean;
    nonRefundable: boolean;
    totalPrice: string;
    shareOptions: string[];
    contactNumber?: string;
  };
  surroundings?: ApiSurroundings;
  overview?: ApiOverview;
  houseRules?: ApiHouseRules;
  guestReviews?: ApiGuestReviews;
}

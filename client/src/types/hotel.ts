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
  roomType: string;
  roomCategory: string;
  capacity: number;
  maxAdults: number;
  maxChildren: number;
  pricePerNight: number;
  sizeSqm: number;
  bedrooms: number;
  bathrooms: number;
  totalRooms: number;
  roomsLeft: number;
  photos: string[];
  amenities: string[];
  facilities: string[];
  categories: string[];
  features: string[];
  specialFeatures: {
    hasPrivateBathroom?: boolean;
    hasTV?: boolean;
    hasMiniFridge?: boolean;
    hasFreeWifi?: boolean;
    hasCityView?: boolean;
    hasSeaView?: boolean;
    hasBalcony?: boolean;
    hasPoolView?: boolean;
    hasSmartTV?: boolean;
    hasEspresso?: boolean;
    hasNespresso?: boolean;
    hasSofaBed?: boolean;
    hasRainShower?: boolean;
    hasBath?: boolean;
    hasQueenBeds?: boolean;
    hasKitchenette?: boolean;
    hasTwoBedrooms?: boolean;
    hasMicrowave?: boolean;
    hasLivingArea?: boolean;
    hasDiningTable?: boolean;
    hasKingBed?: boolean;
    hasKettle?: boolean;
    hasDesk?: boolean;
    hasTwinBeds?: boolean;
    hasAccessibleBathroom?: boolean;
    hasStepFreeAccess?: boolean;
    hasPrivateTerrace?: boolean;
    hasOutdoorSeating?: boolean;
    hasJacuzzi?: boolean;
    hasSpaAccess?: boolean;
    hasPanoramicView?: boolean;
    hasTwoTerraces?: boolean;
  };
  pricing: {
    basePrice: number;
    currency: string;
    includesBreakfast?: boolean;
    freeCancellation: boolean;
    noPrepayment: boolean;
    priceMatch: boolean;
  };
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
  shortDescription?: string;

  // Hotel overview sections
  overview?: {
    infoAndPrices?: string;
    activity?: string;
    facilities?: string;
    houseRules?: string;
    finePrint?: string;
    guestReviews?: string;
    travellersAsking?: string;
    hotelSurroundings?: string;
  };

  // Property highlights
  propertyHighlights?: {
    perfectFor?: string;
    locationScore?: number;
    locationDescription?: string;
    roomsWith?: string[];
  };

  // Most popular facilities
  mostPopularFacilities?: (
    | string
    | { name: string; distance: string; type: string }
  )[];

  // Hotel facilities
  facilities?: {
    general?: string[];
    greatForStay?: string[];
    bathroom?: string[];
    bedroom?: string[];
    view?: string[];
    outdoors?: string[];
    kitchen?: string[];
    roomAmenities?: string[];
    livingArea?: string[];
    mediaTechnology?: string[];
    foodDrink?: string[];
    internet?: string;
    parking?: string;
    receptionServices?: string[];
    safetySecurity?: string[];
    generalFacilities?: string[];
    languagesSpoken?: string[];
  };

  // Guest reviews summary (aggregated)
  guestReviews?: {
    overallRating: number;
    overallLabel: string;
    totalReviews: number;
    categories: {
      staff?: number;
      comfort?: number;
      freeWifi?: number;
      facilities?: number;
      valueForMoney?: number;
      cleanliness?: number;
      location?: number;
    };
  };

  // Hotel surroundings
  surroundings?: {
    nearbyAttractions?: Array<{
      name: string;
      distance: string;
    }>;
    topAttractions?: Array<{
      name: string;
      distance: string;
    }>;
    restaurantsCafes?: Array<{
      name: string;
      type: string;
      distance: string;
    }>;
    naturalBeauty?: Array<{
      name: string;
      type: string;
      distance: string;
    }>;
    publicTransport?: Array<{
      name: string;
      type: string;
      distance: string;
    }>;
    closestAirports?: Array<{
      name: string;
      distance: string;
    }>;
  };

  // Travellers questions
  travellersQuestions?: Array<{
    question: string;
    answer: string;
  }>;

  rooms: Room[];
  adminIds: { $oid: string }[];
  amenityIds: { $oid: string }[];
  media: { url: string; type?: string }[];
  categories: string[];
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

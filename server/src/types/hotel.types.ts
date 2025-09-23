import { ID, GeoLocation } from "./common";
import type { Media, Amenity } from "./media.types";

export enum HotelApprovalStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export type Hotel = {
  id: ID;
  name: string;
  address: string;
  country: string;
  city: string;
  location: GeoLocation;
  stars?: number;
  description?: string;
  shortDescription?: string; // "Premium beachfront resort with multiple pools, spa, private beach access, kids club, and fine dining."

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
    perfectFor?: string; // "Perfect for a 1-night stay!"
    locationScore?: number; // 9.5
    locationDescription?: string; // "Situated in the real heart of Jerusalem, this hotel has an excellent location score of 9.5"
    roomsWith?: string[]; // ["Terrace", "City view"]
  };

  // Most popular facilities
  mostPopularFacilities?: string[]; // ["Private bathroom", "TV", "Mini fridge", "Free Wi-Fi", "City view", "Kettle", "Balcony", "Espresso"]

  // Hotel facilities
  facilities?: {
    general?: string[]; // ["Non-smoking rooms", "Family rooms", "Free WiFi", "Terrace", "Daily housekeeping", "Tea/coffee maker in all rooms", "Good breakfast"]
    greatForStay?: string[]; // ["Private bathroom", "Air conditioning", "Free WiFi", "Family rooms", "Flat-screen TV", "Shower", "Non-smoking rooms", "Luggage storage", "Laundry", "Designated smoking area"]
    bathroom?: string[]; // ["Bathroom", "Toilet paper", "Towels", "Bath or shower", "Slippers", "Private bathroom", "Toilet", "Free toiletries", "Hairdryer", "Shower"]
    bedroom?: string[]; // ["Linen", "Wardrobe or closet", "Extra long beds (> 2 metres)"]
    view?: string[]; // ["City view"]
    outdoors?: string[]; // ["Outdoor furniture", "Terrace"]
    kitchen?: string[]; // ["Coffee machine", "Stovetop", "Electric kettle", "Refrigerator"]
    roomAmenities?: string[]; // ["Socket near the bed"]
    livingArea?: string[]; // ["Seating Area"]
    mediaTechnology?: string[]; // ["Streaming service (like Netflix)", "Flat-screen TV", "Satellite channels", "TV"]
    foodDrink?: string[]; // ["Wine/champagne", "Additional charge", "Tea/Coffee maker"]
    internet?: string; // "WiFi is available in the rooms and is free of charge."
    parking?: string; // "No parking available."
    receptionServices?: string[]; // ["Invoice provided"]
    safetySecurity?: string[]; // ["Fire extinguishers", "CCTV outside property", "CCTV in common areas", "Key access"]
    generalFacilities?: string[]; // ["Designated smoking area", "Air conditioning", "Non-smoking throughout", "Mosquito net", "Heating", "Soundproofing", "Private entrance", "Family rooms", "Non-smoking rooms", "Iron"]
    languagesSpoken?: string[]; // ["German", "English", "Spanish", "Hebrew"]
  };

  // Guest reviews summary
  guestReviews?: {
    overallRating?: number; // 9.1
    overallLabel?: string; // "Fabulous"
    totalReviews?: number; // 1247
    categories?: {
      staff?: number; // 9.5
      comfort?: number; // 9.1
      freeWifi?: number; // 9.9
      facilities?: number; // 8.8
      valueForMoney?: number; // 8.8
      cleanliness?: number; // 9.3
      location?: number; // 9.5
    };
  };

  // Hotel surroundings
  surroundings?: {
    nearbyAttractions?: Array<{
      name: string;
      distance: string; // "1.1 km"
    }>;
    topAttractions?: Array<{
      name: string;
      distance: string;
    }>;
    restaurantsCafes?: Array<{
      name: string;
      type: string; // "Cafe/bar"
      distance: string;
    }>;
    naturalBeauty?: Array<{
      name: string;
      type: string; // "Mountain"
      distance: string;
    }>;
    publicTransport?: Array<{
      name: string;
      type: string; // "Bus", "Train"
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
    answer?: string;
  }>;

  rooms: Room[];
  adminIds: ID[];
  amenityIds?: ID[];
  amenities?: Amenity[];
  media: Media[];
  categories?: string[];
  averageRating?: number;
  reviewsCount?: number;
  approvalStatus: HotelApprovalStatus;
  submittedAt: Date;
  approvedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;

  houseRules: {
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
  };
};

export type Room = {
  id: ID;
  name: string;
  capacity: number;
  maxAdults: number;
  maxChildren: number;
  pricePerNight: number;

  // Room type details
  roomType: string; // "Standard", "Superior", "Deluxe", "Suite", "Family", "Business", "Accessible", "Premium"
  roomCategory?: string; // "Couples", "Family", "Friends", "Business", "Accessible", "Premium"

  // Room specifications
  sizeSqm?: number;
  bedrooms?: number;
  bathrooms?: number;

  // Availability
  totalRooms: number;
  totalUnits?: number; // legacy field for compatibility
  availableRooms?: number; // alternative field name for compatibility
  roomsLeft?: number; // "Only 22 left on our site"

  // Room features and amenities
  features?: string[]; // ["Private bathroom", "TV", "Mini fridge", "Free Wi-Fi", "City view", "Kettle", "Balcony", "Espresso"]
  amenities?: string[];
  facilities?: string[];
  categories?: string[];

  // Special features
  specialFeatures?: {
    hasBalcony?: boolean;
    hasCityView?: boolean;
    hasSeaView?: boolean;
    hasPoolView?: boolean;
    hasTerrace?: boolean;
    hasJacuzzi?: boolean;
    hasKitchen?: boolean;
    hasKitchenette?: boolean;
    hasMicrowave?: boolean;
    hasSofaBed?: boolean;
    hasKingBed?: boolean;
    hasTwinBeds?: boolean;
    hasQueenBeds?: boolean;
    hasRainShower?: boolean;
    hasBath?: boolean;
    hasNespresso?: boolean;
    hasEspresso?: boolean;
    hasSmartTV?: boolean;
    hasDesk?: boolean;
    hasDiningTable?: boolean;
    hasLivingArea?: boolean;
    hasPrivateTerrace?: boolean;
    hasOutdoorSeating?: boolean;
    hasSpaAccess?: boolean;
    hasPanoramicView?: boolean;
    hasTwoTerraces?: boolean;
    hasAccessibleBathroom?: boolean;
    hasStepFreeAccess?: boolean;
  };

  // Pricing and policies
  pricing?: {
    basePrice: number;
    currency?: string;
    includesBreakfast?: boolean;
    freeCancellation?: boolean;
    noPrepayment?: boolean;
    priceMatch?: boolean;
  };

  // Media
  photos?: string[];
  media?: Media[];

  // Reservations
  reservations: RoomReservation[];
};

export type RoomReservation = {
  reservationId: ID;
  checkIn: string;
  checkOut: string;
};

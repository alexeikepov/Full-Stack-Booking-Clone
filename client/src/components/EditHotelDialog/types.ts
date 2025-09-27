export interface Hotel {
  id: string | number;
  name: string;
  address?: string;
  city?: string;
  country?: string;
  stars?: number;
  shortDescription?: string;
  description?: string;
  location?: { lat: number; lng: number };
  facilities?: Record<string, unknown>;
  rooms?: Room[];
  status?: string;
  media?: Array<string | { url?: string; type?: string }>;
  propertyHighlights?: {
    perfectFor: string;
    locationScore: number;
    locationDescription: string;
    roomsWith: string[];
  };
  houseRules?: {
    checkIn: { time: string; note: string; advanceNotice: string };
    checkOut: { time: string };
    cancellation: { policy: string; conditions: string };
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
      minimumAge: number | null;
      note: string;
    };
    pets: { allowed: boolean; note: string };
    paymentMethods: { methods: string[] };
    parties: { allowed: boolean; note: string };
  };
  surroundings?: {
    nearbyAttractions: { name: string; distance: string }[];
    topAttractions: { name: string; distance: string }[];
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
    publicTransport: { name: string; type: string; distance: string }[];
    closestAirports: { name: string; distance: string }[];
  };
  overview?: Record<string, unknown>;
  mostPopularFacilities?: Array<{ name: string; distance?: string; type?: string }>;
  categories?: Array<{ name: string; distance?: string; type?: string }>;
  travellersQuestions?: Array<{ question: string; answer: string }>;
  languagesSpoken?: string[];
}

export interface EditHotelDialogProps {
  isOpen: boolean;
  onClose: () => void;
  hotel: Hotel | null;
  onSave: (hotel: any) => void;
}

export interface FormData {
  name: string;
  address: string;
  city: string;
  country: string;
  stars: number;
  shortDescription: string;
  description: string;
  location: { lat: number; lng: number };
  facilities: {
    general: string[];
    greatForStay: unknown[];
    bathroom: unknown[];
    bedroom: unknown[];
    view: unknown[];
    outdoors: unknown[];
    kitchen: unknown[];
    roomAmenities: unknown[];
    livingArea: unknown[];
    mediaTechnology: unknown[];
    foodDrink: unknown[];
    internet: string;
    parking: string;
    receptionServices: unknown[];
    safetySecurity: unknown[];
    generalFacilities: unknown[];
    languagesSpoken?: string[];
  };
  rooms: Room[];
  status: string;
  media: string[];
  propertyHighlights: {
    perfectFor: string;
    locationScore: number;
    locationDescription: string;
    roomsWith: string[];
  };
  houseRules: {
    checkIn: { time: string; note: string; advanceNotice: string };
    checkOut: { time: string };
    cancellation: { policy: string; conditions: string };
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
      minimumAge: number | null;
      note: string;
    };
    pets: { allowed: boolean; note: string };
    paymentMethods: { methods: string[] };
    parties: { allowed: boolean; note: string };
  };
  surroundings: {
    nearbyAttractions: { name: string; distance: string }[];
    topAttractions: { name: string; distance: string }[];
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
    publicTransport: { name: string; type: string; distance: string }[];
    closestAirports: { name: string; distance: string }[];
  };
  overview: Record<string, unknown>;
  mostPopularFacilities: Array<{ name: string; distance?: string; type?: string }>;
  travellersQuestions: { question: string; answer: string }[];
}

export interface TabProps {
  formData: FormData;
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void;
  showAll: boolean;
}

export interface Room {
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
  media?: Array<string | { url?: string; type?: string }>;
  __newPhoto?: string;
}

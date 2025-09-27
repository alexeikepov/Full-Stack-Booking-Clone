export interface Hotel {
  id?: number;
  name: string;
  location: string;
  address: string;
  rating: number;
  rooms: number;
  status: string;
  owner: string;
  description: string;
  stars: number;
  amenities: string[];
  facilities: string[];
  contactInfo: {
    phone: string;
    email: string;
  };
  surroundings: {
    nearbyAttractions: Array<{ name: string; distance: string; type?: string }>;
    topAttractions: Array<{ name: string; distance: string; type?: string }>;
    restaurantsCafes: Array<{ name: string; distance: string; type?: string }>;
    naturalBeauty: Array<{ name: string; distance: string; type?: string }>;
    publicTransport: Array<{ name: string; distance: string; type?: string }>;
    closestAirports: Array<{ name: string; distance: string; type?: string }>;
  };
}

export interface AddHotelDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (hotel: Hotel) => void;
}

export interface StepProps {
  formData: Hotel;
  onUpdate: (field: string, value: string | number | string[]) => void;
  onContactUpdate: (field: string, value: string) => void;
  onSurroundingsUpdate: (
    field: string,
    items: Array<{ name: string; distance: string; type?: string }>
  ) => void;
}

export interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

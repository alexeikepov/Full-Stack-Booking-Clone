import {
  ApiHotel,
  SearchParams,
  ListHotelsResponse,
  AppProperty,
} from "../types/api.types";
import { API_CONFIG } from "./apiConfig";
import { demoApartments } from "../data/demoApartmentsData";

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// HTTP client utility
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      throw new ApiError(response.status, errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error && error.name === "AbortError") {
      const timeoutError = new Error(
        `Request timeout after ${API_CONFIG.TIMEOUT}ms for ${url}`,
      );
      throw timeoutError;
    }

    const networkError = new Error(
      `Network error connecting to ${url}: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
    throw networkError;
  }
}

// Transform API hotel data to app property format
function transformHotelToAppProperty(
  hotel: ApiHotel,
  nights: number = 1,
): AppProperty {
  // Get the first available room for pricing
  const firstRoom = hotel.rooms?.[0];
  const basePrice = firstRoom?.pricePerNight || 0;
  const totalPrice = basePrice * nights;

  // Calculate old price (simulate discount)
  const oldPrice = Math.round(totalPrice * 1.3);

  // Get rating text based on rating
  const getRatingText = (rating: number): string => {
    if (rating >= 9) return "Exceptional";
    if (rating >= 8) return "Very Good";
    if (rating >= 7) return "Good";
    if (rating >= 6) return "Pleasant";
    return "Fair";
  };

  // Get room description
  const getRoomDescription = (): string => {
    if (!hotel.rooms || hotel.rooms.length === 0) return "1 bed";
    const room = hotel.rooms[0];
    const bedrooms = room.bedrooms || 1;
    return `${bedrooms} bed${bedrooms > 1 ? "s" : ""}`;
  };

  // Generate image for each hotel using API images
  const getHotelImage = (): any => {
    // First try to use hotel main images from the API
    if (hotel.media && hotel.media.length > 0) {
      return { uri: hotel.media[0] };
    }

    // Then try room photos
    if (firstRoom?.photos && firstRoom.photos.length > 0) {
      return { uri: firstRoom.photos[0] };
    }

    // Fallback to local hotel images with variation based on hotel ID
    const hash = hotel._id.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
    const imageNumber = (Math.abs(hash) % 20) + 1;

    // Import images dynamically based on the calculated number
    const hotelImages = [
      require("../assets/images/hotel1.png"),
      require("../assets/images/hotel2.png"),
      require("../assets/images/hotel3.png"),
      require("../assets/images/hotel4.png"),
      require("../assets/images/hotel5.png"),
      require("../assets/images/hotel6.png"),
      require("../assets/images/hotel7.png"),
      require("../assets/images/hotel8.png"),
      require("../assets/images/hotel9.png"),
      require("../assets/images/hotel10.png"),
      require("../assets/images/hotel11.png"),
      require("../assets/images/hotel12.png"),
      require("../assets/images/hotel13.png"),
      require("../assets/images/hotel14.png"),
      require("../assets/images/hotel15.png"),
      require("../assets/images/hotel16.png"),
      require("../assets/images/hotel17.png"),
      require("../assets/images/hotel18.png"),
      require("../assets/images/hotel19.png"),
      require("../assets/images/hotel20.png"),
    ];

    return hotelImages[imageNumber - 1] || hotelImages[0];
  };

  return {
    id: hotel._id,
    title: hotel.name || "Unknown Hotel",
    rating: hotel.averageRating?.toFixed(1) || "0.0",
    description: hotel.description || getRoomDescription(),
    price: Math.round(totalPrice).toString(),
    currency: firstRoom?.pricing?.currency || "₪",
    imageSource: getHotelImage(),
    location: hotel.city || "Unknown City",
    distance:
      hotel.propertyHighlights?.locationDescription || "1 km from downtown",
    deal: (hotel.averageRating || 0) >= 8.5 ? "Getaway Deal" : undefined,
    oldPrice: oldPrice > totalPrice ? oldPrice.toString() : undefined,
    taxesIncluded: true,
    reviewCount: (hotel.reviewsCount || 0).toString(),
    ratingText: getRatingText(hotel.averageRating || 0),
    // Pass through all server image data for the gallery
    media: hotel.media || [],
    rooms: hotel.rooms || [],
    details: {
      address: hotel.address || "Address not available",
      roomType: firstRoom?.roomType || "Hotel room",
      includedExtras: [
        ...(firstRoom?.pricing?.includesBreakfast ? ["Breakfast"] : []),
        ...(hotel.facilities?.internet?.includes("free") ? ["WiFi"] : []),
        "TV",
      ].join(", "),
      breakfastIncluded: firstRoom?.pricing?.includesBreakfast || false,
      nonRefundable: !firstRoom?.pricing?.freeCancellation,
      totalPrice: `$${Math.round(totalPrice)}`,
      shareOptions: ["booking", "property", "app"],
    },
    // Pass through new fields for highlights
    surroundings: hotel.surroundings,
    overview: hotel.overview,
    houseRules: hotel.houseRules,
    stars: hotel.stars,
    guestReviews: hotel.guestReviews,
    coordinates: hotel.location
      ? {
          latitude: hotel.location.lat,
          longitude: hotel.location.lng,
        }
      : undefined,
  };
}

// Fallback function to use dummy data when API is disabled or fails
function getDummyDataFallback(params: SearchParams = {}): AppProperty[] {
  let filteredData = demoApartments;

  // Simple city filtering for dummy data
  if (params.city) {
    const cityName = params.city.split(",")[0].trim().toLowerCase();
    filteredData = demoApartments.filter((apartment) =>
      apartment.location?.toLowerCase().includes(cityName),
    );
  }

  return filteredData;
}

// API Service class
export class HotelApiService {
  // List hotels with search parameters
  static async listHotels(params: SearchParams = {}): Promise<AppProperty[]> {
    // Use dummy data if API is disabled
    if (!API_CONFIG.ENABLED) {
      return getDummyDataFallback(params);
    }

    try {
      const searchParams = new URLSearchParams();

      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.append(key, value.toString());
        }
      });

      const queryString = searchParams.toString();
      const endpoint = `/api/hotels${queryString ? `?${queryString}` : ""}`;

      const response = await apiRequest<ListHotelsResponse>(endpoint);

      if (!response.hotels || response.hotels.length === 0) {
        throw new Error("No hotels found");
      }

      // Calculate nights for pricing
      const nights = response.searchMeta?.nights || 1;

      return response.hotels.map((hotel) =>
        transformHotelToAppProperty(hotel, nights),
      );
    } catch (error) {
      console.warn("🔄 API call failed, falling back to dummy data:", {
        endpoint: `/api/hotels`,
        error: error instanceof Error ? error.message : error,
        baseUrl: API_CONFIG.BASE_URL,
        timeout: API_CONFIG.TIMEOUT,
      });
      return getDummyDataFallback(params);
    }
  }

  // Get hotel by ID
  static async getHotelById(
    id: string,
    params: {
      from?: string;
      to?: string;
      adults?: number;
      children?: number;
      rooms?: number;
    } = {},
  ): Promise<AppProperty> {
    // Use dummy data if API is disabled
    if (!API_CONFIG.ENABLED) {
      const dummyData = getDummyDataFallback();
      const found = dummyData.find((p) => p.id === id);
      if (found) return found;
      throw new Error("Property not found");
    }

    try {
      const searchParams = new URLSearchParams();

      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.append(key, value.toString());
        }
      });

      const queryString = searchParams.toString();
      const endpoint = `/api/hotels/${id}${queryString ? `?${queryString}` : ""}`;

      const hotel = await apiRequest<ApiHotel>(endpoint);

      // Calculate nights for pricing
      let nights = 1;
      if (params.from && params.to) {
        const fromDate = new Date(params.from);
        const toDate = new Date(params.to);
        nights = Math.max(
          1,
          Math.ceil(
            (toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24),
          ),
        );
      }

      return transformHotelToAppProperty(hotel, nights);
    } catch (error) {
      console.warn("🔄 API call failed, falling back to dummy data:", {
        endpoint: `/api/hotels/${id}`,
        error: error instanceof Error ? error.message : error,
        baseUrl: API_CONFIG.BASE_URL,
        timeout: API_CONFIG.TIMEOUT,
      });
      const dummyData = getDummyDataFallback();
      const found = dummyData.find((p) => p.id === id);
      if (found) return found;
      throw error;
    }
  }

  // Get available room types for a hotel
  static async getHotelRooms(hotelId: string): Promise<any[]> {
    if (!API_CONFIG.ENABLED) {
      return [];
    }

    try {
      const endpoint = `/api/hotels/${hotelId}/rooms`;
      return apiRequest<any[]>(endpoint);
    } catch (error) {
      console.warn("API call failed:", error);
      return [];
    }
  }

  // Get hotel availability
  static async getHotelAvailability(
    hotelId: string,
    params: {
      from?: string;
      to?: string;
      adults?: number;
      children?: number;
      rooms?: number;
    },
  ): Promise<any> {
    if (!API_CONFIG.ENABLED) {
      return { available: true };
    }

    try {
      const searchParams = new URLSearchParams();

      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.append(key, value.toString());
        }
      });

      const queryString = searchParams.toString();
      const endpoint = `/api/hotels/${hotelId}/availability${queryString ? `?${queryString}` : ""}`;

      return apiRequest<any>(endpoint);
    } catch {
      return { available: true };
    }
  }

  // Get suggested cities for search
  static async getSuggestedCities(query?: string): Promise<string[]> {
    if (!API_CONFIG.ENABLED) {
      return ["Rome", "Milan", "Paris", "London", "New York"];
    }

    try {
      const searchParams = new URLSearchParams();
      if (query) {
        searchParams.append("q", query);
      }

      const queryString = searchParams.toString();
      const endpoint = `/api/hotels/_meta/cities${queryString ? `?${queryString}` : ""}`;

      return apiRequest<string[]>(endpoint);
    } catch {
      return ["Rome", "Milan", "Paris", "London", "New York"];
    }
  }

  // Get hotel categories
  static async getCategories(): Promise<string[]> {
    if (!API_CONFIG.ENABLED) {
      return ["Hotel", "Apartment", "Resort", "Villa"];
    }

    try {
      const endpoint = "/api/hotels/_meta/categories";
      return apiRequest<string[]>(endpoint);
    } catch {
      return ["Hotel", "Apartment", "Resort", "Villa"];
    }
  }

  // Get facets for filtering
  static async getFacets(): Promise<any> {
    if (!API_CONFIG.ENABLED) {
      return {};
    }

    try {
      const endpoint = "/api/hotels/_meta/facets";
      return apiRequest<any>(endpoint);
    } catch {
      return {};
    }
  }
}

// Export default instance for convenience
export default HotelApiService;

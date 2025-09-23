import axios from "axios";

// Define review types locally to avoid import issues
export type CreateReviewData = {
  rating: number;
  comment: string;
  guestName: string;
  guestCountry: string;
  categoryRatings?: {
    staff?: number;
    comfort?: number;
    facilities?: number;
    location?: number;
    cleanliness?: number;
    value?: number;
  };
  travelType?: string;
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

// Define reservation types locally to avoid import issues
export type CreateReservationData = {
  roomName: string;
  roomId: string;
  quantity: number;
  guests: {
    adults: number;
    children: number;
  };
  checkIn: string | Date;
  checkOut: string | Date;
  guestInfo?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    specialRequests?: string;
    dietaryRequirements?: string;
    arrivalTime?: string;
    departureTime?: string;
  };
  children?: Array<{
    name?: string;
    age: number;
    needsCot?: boolean;
  }>;
  specialRequests?: Array<{
    type: string;
    description: string;
    additionalCost?: number;
  }>;
  payment?: {
    method?: string;
    paid?: boolean;
    transactionId?: string;
  };
  policies?: {
    freeCancellation?: boolean;
    noPrepayment?: boolean;
    priceMatch?: boolean;
    cancellationDeadline?: string;
    cancellationPolicy?: string;
  };
  notes?: string;
};

export type UpdateReservationData = Partial<CreateReservationData>;

export type SpecialRequestData = {
  type: string;
  description: string;
  additionalCost?: number;
};

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  withCredentials: true,
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export type SearchHotelsParams = {
  q?: string;
  city?: string;
  roomType?: "STANDARD" | "DELUXE" | "SUITE";
  minPrice?: number;
  maxPrice?: number;
  category?: string;
  from?: string; // yyyy-mm-dd
  to?: string; // yyyy-mm-dd
  adults?: number;
  children?: number;
  rooms?: number;
};

export async function searchHotels(params: SearchHotelsParams) {
  const res = await api.get("/api/hotels", { params });
  return res.data as any[];
}

// Admin Hotel management API functions
export async function getOwnerHotels() {
  const token = localStorage.getItem("admin_hotel_token");
  const res = await api.get("/api/admin-hotel/hotels", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function createHotel(hotelData: any) {
  const token = localStorage.getItem("admin_hotel_token");
  const res = await api.post("/api/admin-hotel/hotels", hotelData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function updateHotel(hotelId: string, hotelData: any) {
  const token = localStorage.getItem("admin_hotel_token");
  const res = await api.put(`/api/admin-hotel/hotels/${hotelId}`, hotelData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function deleteHotel(hotelId: string) {
  const token = localStorage.getItem("admin_hotel_token");
  const res = await api.delete(`/api/admin-hotel/hotels/${hotelId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function getOwnerAnalytics() {
  const token = localStorage.getItem("admin_hotel_token");
  const res = await api.get("/api/admin-hotel/analytics", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

// Reviews API functions
export async function getHotelReviews(
  hotelId: string,
  params?: {
    page?: number;
    limit?: number;
    sort?: "newest" | "oldest" | "rating_high" | "rating_low" | "helpful";
    rating?: number;
    travelType?: string;
    status?: string;
  }
) {
  const res = await api.get(`/api/hotels/${hotelId}/reviews`, { params });
  return res.data;
}

export async function createReview(
  hotelId: string,
  reviewData: CreateReviewData
) {
  const res = await api.post(`/api/hotels/${hotelId}/reviews`, reviewData);
  return res.data;
}

export async function updateReview(
  reviewId: string,
  reviewData: UpdateReviewData
) {
  const res = await api.patch(`/api/reviews/${reviewId}`, reviewData);
  return res.data;
}

export async function deleteReview(reviewId: string) {
  const res = await api.delete(`/api/reviews/${reviewId}`);
  return res.data;
}

export async function getReviewById(reviewId: string) {
  const res = await api.get(`/api/reviews/${reviewId}`);
  return res.data;
}

export async function addHotelResponse(
  reviewId: string,
  responseData: HotelResponseData
) {
  const res = await api.post(`/api/reviews/${reviewId}/response`, responseData);
  return res.data;
}

export async function voteHelpful(reviewId: string) {
  const res = await api.post(`/api/reviews/${reviewId}/helpful`);
  return res.data;
}

export async function reportReview(reviewId: string) {
  const res = await api.post(`/api/reviews/${reviewId}/report`);
  return res.data;
}

export async function getReviewStats(hotelId: string): Promise<ReviewStats> {
  const res = await api.get(`/api/hotels/${hotelId}/reviews/stats`);
  return res.data;
}

// Hotel rooms and availability API functions
export async function getHotelRooms(
  hotelId: string,
  params?: {
    from?: string;
    to?: string;
  }
) {
  const res = await api.get(`/api/hotels/${hotelId}/rooms`, { params });
  return res.data;
}

export async function getRoomAvailability(
  hotelId: string,
  roomType: string,
  from: string,
  to: string
) {
  const res = await api.get(`/api/hotels/${hotelId}/availability`, {
    params: { roomType, from, to },
  });
  return res.data;
}

// Reservations API functions
export async function getReservations(params?: {
  page?: number;
  limit?: number;
  status?: string;
  hotelId?: string;
}) {
  const res = await api.get("/api/reservations", { params });
  return res.data;
}

export async function getReservationById(reservationId: string) {
  const res = await api.get(`/api/reservations/${reservationId}`);
  return res.data;
}

export async function createReservation(
  reservationData: CreateReservationData
) {
  const res = await api.post("/api/reservations", reservationData);
  return res.data;
}

export async function updateReservation(
  reservationId: string,
  reservationData: UpdateReservationData
) {
  const res = await api.patch(
    `/api/reservations/${reservationId}`,
    reservationData
  );
  return res.data;
}

export async function updateReservationStatus(
  reservationId: string,
  status: string
) {
  const res = await api.patch(`/api/reservations/${reservationId}/status`, {
    status,
  });
  return res.data;
}

export async function checkInReservation(
  reservationId: string,
  data?: {
    roomNumber?: string;
    keyCardIssued?: boolean;
  }
) {
  const res = await api.patch(
    `/api/reservations/${reservationId}/check-in`,
    data
  );
  return res.data;
}

export async function checkOutReservation(
  reservationId: string,
  data?: {
    keyCardReturned?: boolean;
    finalBill?: number;
  }
) {
  const res = await api.patch(
    `/api/reservations/${reservationId}/check-out`,
    data
  );
  return res.data;
}

export async function addSpecialRequest(
  reservationId: string,
  requestData: SpecialRequestData
) {
  const res = await api.post(
    `/api/reservations/${reservationId}/special-request`,
    requestData
  );
  return res.data;
}

export async function approveSpecialRequest(
  reservationId: string,
  requestId: string
) {
  const res = await api.patch(
    `/api/reservations/${reservationId}/special-request/${requestId}/approve`
  );
  return res.data;
}

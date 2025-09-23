import axios from "axios";

// Define review types locally to avoid import issues
export type CreateReviewData = {
  rating: number;
  comment: string;
  negative?: string;
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
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
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

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

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
  const res = await api.get("/api/admin-hotel/hotels");
  return res.data;
}

export async function createHotel(hotelData: any) {
  const res = await api.post("/api/admin-hotel/hotels", hotelData);
  return res.data;
}

export async function updateHotel(hotelId: string, hotelData: any) {
  const res = await api.put(`/api/admin-hotel/hotels/${hotelId}`, hotelData);
  return res.data;
}

export async function deleteHotel(hotelId: string) {
  const res = await api.delete(`/api/admin-hotel/hotels/${hotelId}`);
  return res.data;
}

export async function getOwnerAnalytics(params?: { hotelId?: string }) {
  const res = await api.get("/api/admin-hotel/analytics", {
    params,
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

// My reviews (timeline)
export async function getMyReviews(params?: { page?: number; limit?: number }) {
  try {
    const res = await api.get("/api/me/reviews", { params });
    return res.data as {
      items: Array<{
        _id: string;
        hotel: { _id: string; name: string; city: string; averageRating?: number; reviewsCount?: number; media?: any[] };
        rating: number;
        comment?: string;
        createdAt: string;
        stayDate?: string;
      }>;
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  } catch (err: any) {
    if (err?.response?.status === 404) {
      // Fallback for older API paths
      try {
        const altHotelsMe = await api.get("/api/hotels/me/reviews", { params });
        return altHotelsMe.data;
      } catch {}
      try {
        const alt = await api.get("/api/reviews/my", { params });
        return alt.data;
      } catch {}
      try {
        const alt2 = await api.get("/api/reviews", { params: { ...params, me: 1 } });
        return alt2.data;
      } catch {}
    }
    throw err;
  }
}

export async function getMe() {
  const res = await api.get("/api/me");
  return res.data as {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role?: string;
    ownerApplicationStatus?: "none" | "pending" | "approved" | "rejected";
    genius?: { level: number; completedLast24Months: number; nextThreshold: number | null; remaining: number };
  };
}

// ----- Auth (Partner) -----
export type AuthResponse = {
  user: { id: string; name: string; email: string; phone?: string; role?: string };
  token: string;
};

export async function registerUser(params: { name: string; email: string; phone: string; password: string }): Promise<AuthResponse> {
  const res = await api.post("/api/users/register", params);
  return res.data as AuthResponse;
}

export async function loginUser(params: { email: string; password: string }): Promise<AuthResponse> {
  const res = await api.post("/api/users/login", params);
  return res.data as AuthResponse;
}

export async function createReview(
  hotelId: string,
  reviewData: CreateReviewData
) {
  const res = await api.post(`/api/hotels/${hotelId}/reviews`, reviewData);
  return res.data;
}

export async function updateMyReviewForHotel(
  hotelId: string,
  reviewData: UpdateReviewData
) {
  const res = await api.patch(`/api/hotels/${hotelId}/reviews/me`, reviewData);
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

// -------- Reviews (Admin) ---------
// Note: use the existing getHotelReviews defined above (/api/hotels/:id/reviews)

export async function respondToReview(reviewId: string, text: string) {
  const res = await api.post(
    `/api/reviews/${reviewId}/response`,
    { text }
  );
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

// Wishlist types
export type Wishlist = {
  _id: string;
  userId: string;
  name: string;
  description?: string;
  hotelIds: Array<{
    _id: string;
    name: string;
    city: string;
    location?: {
      lat: number;
      lng: number;
    };
    images?: Array<{
      url: string;
    }>;
    rating?: number;
    price?: number;
    averageRating?: number;
    reviewsCount?: number;
    stars?: number;
  }>;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateWishlistData = {
  name: string;
  description?: string;
  isPublic?: boolean;
};

export type UpdateWishlistData = Partial<CreateWishlistData>;

// Wishlist API functions
export async function getWishlists(): Promise<Wishlist[]> {
  const res = await api.get("/api/wishlists");
  return res.data;
}

export async function getWishlistById(wishlistId: string): Promise<Wishlist> {
  const res = await api.get(`/api/wishlists/${wishlistId}`);
  return res.data;
}

export async function createWishlist(
  data: CreateWishlistData
): Promise<Wishlist> {
  const res = await api.post("/api/wishlists", data);
  return res.data;
}

export async function updateWishlist(
  wishlistId: string,
  data: UpdateWishlistData
): Promise<Wishlist> {
  const res = await api.put(`/api/wishlists/${wishlistId}`, data);
  return res.data;
}

export async function deleteWishlist(wishlistId: string): Promise<void> {
  await api.delete(`/api/wishlists/${wishlistId}`);
}

export async function addHotelToWishlist(
  wishlistId: string,
  hotelId: string
): Promise<Wishlist> {
  const res = await api.post(`/api/wishlists/${wishlistId}/hotels`, {
    hotelId,
  });
  return res.data;
}

export async function removeHotelFromWishlist(
  wishlistId: string,
  hotelId: string
): Promise<Wishlist> {
  const res = await api.delete(
    `/api/wishlists/${wishlistId}/hotels/${hotelId}`
  );
  return res.data;
}

export async function checkHotelInWishlist(hotelId: string): Promise<{
  isInWishlist: boolean;
  wishlists: Array<{ _id: string; name: string }>;
}> {
  const res = await api.get(`/api/wishlists/check/${hotelId}`);
  return res.data;
}

export async function getPublicWishlist(wishlistId: string): Promise<Wishlist> {
  const res = await api.get(`/api/wishlists/public/${wishlistId}`);
  return res.data;
}

export async function getHotelById(hotelId: string) {
  const res = await api.get(`/api/hotels/${hotelId}`);
  return res.data;
}

export async function setHotelVisibility(hotelId: string, isVisible: boolean) {
  const res = await api.patch(`/api/admin-hotel/hotels/${hotelId}/visibility`, { isVisible });
  return res.data as { id: string; isVisible: boolean };
}

// ----- Platform owner: admin applications -----
export async function getAdminApplications(params?: { status?: "pending" | "approved" | "rejected" }) {
  const res = await api.get("/api/users/admin-applications", { params });
  return res.data as { items: Array<{ _id: string; name: string; email: string; phone: string; ownerApplicationStatus: string; role: string; requestedOwner: boolean; createdAt: string }> };
}

export async function approveAdminApplication(userId: string) {
  const res = await api.patch(`/api/users/${userId}/admin-approve`, { action: "approve" });
  return res.data as { id: string; role: string; ownerApplicationStatus: string };
}

export async function rejectAdminApplication(userId: string) {
  const res = await api.patch(`/api/users/${userId}/admin-approve`, { action: "reject" });
  return res.data as { id: string; role: string; ownerApplicationStatus: string };
}

export async function requestAdminRole() {
  const res = await api.post("/api/users/request-admin");
  return res.data as { ok: true; ownerApplicationStatus: string };
}

import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  withCredentials: true,
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

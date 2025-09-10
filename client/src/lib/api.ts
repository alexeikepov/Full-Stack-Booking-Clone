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
  from?: string;  // yyyy-mm-dd
  to?: string;    // yyyy-mm-dd
  adults?: number;
  children?: number;
  rooms?: number;
};

export async function searchHotels(params: SearchHotelsParams) {
  const res = await api.get("/api/hotels", { params });
  return res.data as any[];
}

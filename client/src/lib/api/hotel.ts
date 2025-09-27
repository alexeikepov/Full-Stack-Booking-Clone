import type { SearchHotelsParams } from './types';
import { api } from './instance';

export type { SearchHotelsParams };

export async function searchHotels(params: SearchHotelsParams) {
  const res = await api.get("/api/hotels", { params });
  return res.data as any[];
}

export async function searchHotelsByQuery(query: string): Promise<any[]> {
  const res = await api.get("/api/hotels", { params: { q: query } });
  return res.data;
}

export async function getHotelById(hotelId: string) {
  const res = await api.get(`/api/hotels/${hotelId}`);
  return res.data;
}

export async function getOwnerHotels() {
  const res = await api.get("/api/admin-hotel/hotels");
  return res.data;
}

export async function getAllHotelsForOwner() {
  try {
    const res = await api.get("/api/admin-hotel/hotels", { params: { all: 1 } });
    return res.data;
  } catch {}
  try {
    const res = await api.get("/api/owner/hotels");
    return res.data;
  } catch {}
  try {
    const res = await api.get("/api/hotels", { params: { all: 1 } });
    return res.data;
  } catch {}
  const res = await api.get("/api/hotels");
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

export async function setHotelVisibility(hotelId: string, isVisible: boolean) {
  const res = await api.patch(`/api/admin-hotel/hotels/${hotelId}/visibility`, { isVisible });
  return res.data as { id: string; isVisible: boolean };
}

export async function getOwnerAnalytics(params?: { hotelId?: string }) {
  const res = await api.get("/api/admin-hotel/analytics", {
    params,
  });
  return res.data;
}

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

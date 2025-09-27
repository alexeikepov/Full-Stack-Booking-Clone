import type { Wishlist, CreateWishlistData, UpdateWishlistData } from './types';
import { api } from './instance';

export type { Wishlist, CreateWishlistData, UpdateWishlistData };

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

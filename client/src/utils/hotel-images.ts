// src/utils/hotel-images.ts
import type { Hotel } from "@/types/hotel";

export function getPrimaryImage(hotel: Hotel): string {
  const hotelImage =
    hotel.media?.find(m => (m as any).type === "image")?.url ??
    hotel.media?.[0]?.url;

  if (hotelImage) return hotelImage;

  for (const room of hotel.rooms ?? []) {
    const roomImage =
      room.media?.find(m => (m as any).type === "image")?.url ??
      room.media?.[0]?.url ??
      room.photos?.[0];
    if (roomImage) return roomImage;
  }

  return "/placeholder-hotel.jpg";
}

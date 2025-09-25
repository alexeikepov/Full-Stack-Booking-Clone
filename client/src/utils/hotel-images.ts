// src/utils/hotel-images.ts
import type { Hotel } from "@/types/hotel";

// Кеш для изображений отелей
const imageCache = new Map<string, string | string[]>();

export function getPrimaryImage(hotel: Hotel): string {
  const hotelId = hotel._id?.$oid;

  // Проверяем кеш
  if (hotelId && imageCache.has(hotelId)) {
    const cached = imageCache.get(hotelId);
    if (typeof cached === "string") {
      return cached;
    }
  }

  // Try hotel images first (highest priority)
  // Handle both string URLs and objects with url property
  const hotelImage =
    hotel.media?.find((m) => (m as any).type === "image")?.url ??
    hotel.media?.[0]?.url ??
    (typeof hotel.media?.[0] === "string" ? hotel.media[0] : null);

  if (hotelImage) {
    if (hotelId) imageCache.set(hotelId, hotelImage);
    return hotelImage;
  }

  // Fallback to room images
  for (const room of hotel.rooms ?? []) {
    const roomImage =
      room.media?.find((m) => (m as any).type === "image")?.url ??
      room.media?.[0]?.url ??
      room.photos?.[0];
    if (roomImage) {
      if (hotelId) imageCache.set(hotelId, roomImage);
      return roomImage;
    }
  }
  // Always return placeholder for primary image when no real images exist
  const fallback = "/placeholder-hotel.svg";
  if (hotelId) imageCache.set(hotelId, fallback);
  return fallback;
}

export function getAllImages(hotel: Hotel): string[] {
  const hotelId = hotel._id?.$oid;
  const cacheKey = `${hotelId}_all`;

  // Проверяем кеш
  if (hotelId && imageCache.has(cacheKey)) {
    const cached = imageCache.get(cacheKey);
    if (Array.isArray(cached)) {
      return cached;
    }
  }

  const hotelImages: string[] = [];
  const roomImages: string[] = [];

  // Collect ALL hotel images FIRST (highest priority)
  if (hotel.media && hotel.media.length > 0) {
    hotel.media.forEach((m, index) => {
      // Handle both string URLs and objects with url property
      if (typeof m === "string") {
        hotelImages.push(m);
      } else if (m.url) {
        hotelImages.push(m.url);
      }
    });
  }

  // Track all images we've seen to avoid any duplicates
  const allSeenImages = new Set<string>();
  hotelImages.forEach((img) => allSeenImages.add(img));

  // Collect ALL room images SECOND (lower priority)
  hotel.rooms?.forEach((room, roomIndex) => {
    // Add room media
    if (room.media && room.media.length > 0) {
      room.media.forEach((m, mediaIndex) => {
        if (m.url && !allSeenImages.has(m.url)) {
          roomImages.push(m.url);
          allSeenImages.add(m.url);
        }
      });
    }

    // Add room photos (exclude hotel images and any duplicates)
    if (room.photos && room.photos.length > 0) {
      room.photos.forEach((photo, photoIndex) => {
        if (photo && !allSeenImages.has(photo)) {
          roomImages.push(photo);
          allSeenImages.add(photo);
        }
      });
    }
  });

  // Combine all images first, then remove ALL duplicates globally
  const allImagesCombined = [...hotelImages, ...roomImages];

  // Remove ALL duplicates globally, keeping first occurrence
  const seenImages = new Set<string>();
  const uniqueImages: string[] = [];

  for (const img of allImagesCombined) {
    if (!seenImages.has(img)) {
      seenImages.add(img);
      uniqueImages.push(img);
    }
  }

  // Separate back into hotel and room images based on original order
  const uniqueHotelImages: string[] = [];
  const uniqueRoomImages: string[] = [];

  for (const img of uniqueImages) {
    if (hotelImages.includes(img) && !uniqueHotelImages.includes(img)) {
      uniqueHotelImages.push(img);
    } else if (roomImages.includes(img) && !uniqueRoomImages.includes(img)) {
      uniqueRoomImages.push(img);
    }
  }

  // Combine: hotel images first, then room images (no duplicates)
  const images = [...uniqueHotelImages, ...uniqueRoomImages];

  // Define what constitutes "real" vs "placeholder" images
  const isRealImage = (img: string) => {
    // Real images: actual hotel photos from booking.com or other real sources
    return (
      img !== "/placeholder-hotel.svg" &&
      !img.includes("picsum.photos") && // Remove random placeholder images
      !img.includes("placeholder") &&
      !img.includes("dummy") &&
      !img.includes("fake")
    );
  };

  // Filter real images vs placeholder images
  const realImages = images.filter(isRealImage);
  const placeholderImages = images.filter((img) => !isRealImage(img));

  // Ensure we always have exactly 8 images total
  const TARGET_IMAGE_COUNT = 8;
  const realCount = realImages.length;
  const neededPlaceholders = Math.max(0, TARGET_IMAGE_COUNT - realCount);

  // Take only the number of placeholders we need
  const finalPlaceholders = placeholderImages.slice(0, neededPlaceholders);

  // If we don't have enough placeholders, generate more
  const additionalPlaceholders: string[] = [];
  for (let i = finalPlaceholders.length; i < neededPlaceholders; i++) {
    additionalPlaceholders.push("/placeholder-hotel.svg");
  }

  // Return real images first, then placeholders to reach exactly 8 images
  const finalImages = [
    ...realImages,
    ...finalPlaceholders,
    ...additionalPlaceholders,
  ];

  if (hotelId) imageCache.set(cacheKey, finalImages);
  return finalImages;
}

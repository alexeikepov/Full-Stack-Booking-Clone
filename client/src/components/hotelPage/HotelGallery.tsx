import { useState } from "react";
import type { Hotel } from "@/types/hotel";

interface HotelGalleryProps {
  hotel: Hotel;
}

function getPrimaryImage(hotel: Hotel): string {
  const hotelImage: string | undefined =
    (hotel.media?.find((m: any) => m?.url)?.url as string | undefined) ??
    (hotel.media?.[0]?.url as string | undefined);
  if (hotelImage) return hotelImage;

  for (const r of hotel.rooms ?? []) {
    const roomImg =
      (r.media?.find((m: any) => m?.url)?.url as string | undefined) ??
      (r.media?.[0]?.url as string | undefined) ??
      r.photos?.[0];
    if (roomImg) return roomImg;
  }
  return "/placeholder-hotel.jpg";
}

function getAllImages(hotel: Hotel): string[] {
  const images: string[] = [];

  // Add hotel images
  if (hotel.media) {
    hotel.media.forEach((m) => {
      if (m.url) images.push(m.url);
    });
  }

  // Add room images
  hotel.rooms?.forEach((room) => {
    if (room.media) {
      room.media.forEach((m) => {
        if (m.url) images.push(m.url);
      });
    }
    if (room.photos) {
      room.photos.forEach((photo) => {
        if (photo) images.push(photo);
      });
    }
  });

  // If no images, use placeholder
  if (images.length === 0) {
    images.push("/placeholder-hotel.jpg");
  }

  return images;
}

export default function HotelGallery({ hotel }: HotelGalleryProps) {
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const allImages = getAllImages(hotel);
  const mainImage = getPrimaryImage(hotel);
  const sideImages = allImages.slice(1, 5);

  if (showAllPhotos) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center">
        <div className="max-w-6xl w-full mx-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white text-2xl font-semibold">
              {hotel.name} - All photos
            </h2>
            <button
              onClick={() => setShowAllPhotos(false)}
              className="text-white hover:text-gray-300 text-3xl font-bold bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center"
            >
              ×
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[70vh] overflow-y-auto">
            {allImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${hotel.name} photo ${index + 1}`}
                className="w-full h-32 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setShowAllPhotos(false)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="grid grid-cols-4 gap-2 h-96">
          {/* Main image */}
          <div className="col-span-2 row-span-2">
            <img
              src={mainImage}
              alt={hotel.name}
              className="w-full h-full object-cover rounded-l-lg cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setShowAllPhotos(true)}
            />
          </div>

          {/* Side images */}
          {sideImages.map((image, index) => (
            <div
              key={index}
              className="col-span-1"
            >
              <img
                src={image}
                alt={`${hotel.name} photo ${index + 2}`}
                className={`w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity ${
                  index === 1
                    ? "rounded-tr-lg"
                    : index === 3
                    ? "rounded-br-lg"
                    : ""
                }`}
                onClick={() => setShowAllPhotos(true)}
              />
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={() => setShowAllPhotos(true)}
            className="flex items-center gap-2 text-[#0071c2] hover:underline font-medium"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Show all {allImages.length} photos
          </button>

          <div className="flex gap-4">
            <button className="text-[#0071c2] hover:underline text-sm font-medium">
              + Save to Wish List
            </button>
            <button className="text-[#0071c2] hover:underline text-sm font-medium">
              We Price Match
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import type { Hotel } from "@/types/hotel";
import ReactCountryFlag from "react-country-flag";

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
  const sideImages = allImages.slice(1);

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
      <div className="mx-auto max-w-6xl px-4 pt-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left side - Photo gallery */}
          <div className="col-span-9">
            <div className="space-y-13">
              {/* Main gallery - 3 photos */}
              <div className="grid grid-cols-3 gap-1 h-80 bg-white p-1 rounded-lg">
                {/* Main image - large left side */}
                <div className="col-span-2 row-span-2">
                  <img
                    src={mainImage}
                    alt={hotel.name}
                    className="w-full h-full object-cover rounded-l-lg cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setShowAllPhotos(true)}
                  />
                </div>

                {/* Right side - 2 small images stacked vertically */}
                <div className="col-span-1 row-span-2 grid grid-rows-2 gap-1">
                  {/* Top right - small image */}
                  <div className="row-span-1">
                    <img
                      src={sideImages[0] || mainImage}
                      alt={`${hotel.name} photo 2`}
                      className="w-full h-full object-cover rounded-tr-lg cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setShowAllPhotos(true)}
                    />
                  </div>

                  {/* Bottom right - small image */}
                  <div className="row-span-1">
                    <img
                      src={sideImages[1] || mainImage}
                      alt={`${hotel.name} photo 3`}
                      className="w-full h-full object-cover rounded-br-lg cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setShowAllPhotos(true)}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom section - 5 thumbnails */}
              <div className="grid grid-cols-5 gap-1 h-20 bg-white p-1 rounded-lg">
                {[0, 1, 2, 3, 4].map((index) => (
                  <div key={index} className="relative">
                    <img
                      src={sideImages[index + 2] || mainImage}
                      alt={`${hotel.name} photo ${index + 4}`}
                      className="w-full h-full object-cover rounded cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setShowAllPhotos(true)}
                    />
                    {index === 4 && (
                      // Overlay for last thumbnail
                      <div
                        className="absolute inset-0 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity rounded"
                        onClick={() => setShowAllPhotos(true)}
                      >
                        <div className="text-white text-center bg-black bg-opacity-30 px-2 py-1 rounded">
                          <div className="text-sm font-bold underline">
                            +{Math.max(0, allImages.length - 5)} photos
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right side - Hotel info panel */}
          <div className="col-span-3">
            <div className="bg-white border border-gray-200 rounded-lg p-3 h-full">
              {/* Rating section */}
              <div className="mb-4">
                <div className="flex items-center justify-end gap-3 mb-2 pb-2 border-b border-gray-200">
                  <div>
                    <div className="text-xl font-bold text-gray-900">
                      Fabulous
                    </div>
                    <div className="text-sm text-gray-600">372 reviews</div>
                  </div>
                  <div className="bg-[#003b95] text-white px-3 py-2 rounded rounded-bl-none font-bold text-lg">
                    8.9
                  </div>
                </div>
              </div>

              {/* Guest review section */}
              <div className="mb-4">
                <div className="text-sm font-semibold text-gray-900 mb-2">
                  Guests who stayed here loved
                </div>
                <div className="text-sm text-gray-700 mb-2">
                  "Wonderful and stylish hotel, big and clean rooms, nice
                  location. We've got complimentary wine bottle for a little
                  waiting time which was really..."
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">
                      M
                    </span>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-gray-900 flex items-center gap-2">
                      Michael
                      <span className="text-gray-600 flex items-center gap-1">
                        <ReactCountryFlag
                          countryCode="IL"
                          svg
                          style={{ width: "16px", height: "12px" }}
                        />
                        Israel
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Free WiFi section */}
              <div className="mb-4 border-t border-b border-gray-200">
                <div className="flex items-center justify-between pt-2 pb-2">
                  <span className="text-sm font-bold text-gray-900">
                    Free WiFi
                  </span>
                  <div className="bg-white border border-gray-500 px-2 py-1 rounded rounded-bl-none text-base">
                    9.9
                  </div>
                </div>
              </div>

              {/* Map section */}
              <div className="flex-1 relative">
                <div className="bg-blue-50 rounded-lg h-48 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="text-lg font-semibold mb-2">
                      Map will be here
                    </div>
                    <div className="text-sm">Google Maps integration</div>
                  </div>
                </div>
                <button className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-[#0071c2] text-white py-2 px-4 rounded text-sm font-medium hover:bg-[#005fa3] transition-colors">
                  Show on map
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

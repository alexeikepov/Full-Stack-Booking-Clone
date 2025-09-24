import { useState } from "react";
import HotelsMap from "@/components/HotelsMap";
import type { Hotel } from "@/types/hotel";
import ReactCountryFlag from "react-country-flag";
import { useQuery } from "@tanstack/react-query";
import { getHotelReviews } from "@/lib/api";

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
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const allImages = getAllImages(hotel);
  const mainImage = getPrimaryImage(hotel);
  const sideImages = allImages.slice(1);

  const totalReviews =
    (hotel as any).reviewsCount ??
    hotel.guestReviews?.totalReviews ??
    undefined;
  const averageRating =
    (hotel as any).averageRating ??
    hotel.guestReviews?.overallRating ??
    undefined;
  const overallLabel =
    (hotel as any).ratingLabel ?? hotel.guestReviews?.overallLabel ?? undefined;
  // Former per-category display kept for reference
  // const freeWifiScore =
  //   hotel.categoryRatings?.freeWifi ??
  //   hotel.guestReviews?.categories?.freeWifi ??
  //   undefined;

  // Latest review (for sidebar snippet)
  const hotelId = (hotel as any).id || hotel._id?.$oid;
  const { data: latestReviews } = useQuery({
    queryKey: ["reviews", hotelId, "latest"],
    queryFn: () =>
      getHotelReviews(String(hotelId), { sort: "newest", limit: 1 }),
    enabled: Boolean(hotelId),
    staleTime: 60 * 1000,
  });
  const latestReview: any | undefined = Array.isArray(latestReviews)
    ? latestReviews[0]
    : undefined;
  const latestReviewText: string | undefined =
    latestReview?.comment || latestReview?.text;
  const latestReviewerName: string | undefined = latestReview?.guestName;
  const latestReviewerCountry: string | undefined = latestReview?.guestCountry;

  const getCountryCode = (country?: string): string => {
    if (!country) return "IL";
    const map: Record<string, string> = {
      Israel: "IL",
      "United States": "US",
      USA: "US",
      "United Kingdom": "GB",
      UK: "GB",
      Germany: "DE",
      France: "FR",
      Spain: "ES",
      Italy: "IT",
      Canada: "CA",
      Australia: "AU",
      Japan: "JP",
      China: "CN",
      Brazil: "BR",
      Mexico: "MX",
      India: "IN",
    };
    return map[country] || "IL";
  };

  // Best category rating for sidebar badge
  const categoryRatings =
    (hotel as any).categoryRatings || hotel.guestReviews?.categories || {};
  const categoryNames = (hotel as any).categoryNames || {
    staff: "Staff",
    comfort: "Comfort",
    freeWifi: "Free WiFi",
    facilities: "Facilities",
    valueForMoney: "Value for money",
    cleanliness: "Cleanliness",
    location: "Location",
  };
  const entries = Object.entries(categoryRatings).filter(
    ([, v]) => typeof v === "number" && isFinite(v as number)
  ) as Array<[string, number]>;
  const bestCategory = entries.length
    ? entries.reduce((a, b) => (a[1] >= b[1] ? a : b))
    : null;
  const bestCategoryLabel = bestCategory
    ? categoryNames[bestCategory[0] as keyof typeof categoryNames] ||
      bestCategory[0].charAt(0).toUpperCase() + bestCategory[0].slice(1)
    : undefined;
  const bestCategoryScore = bestCategory ? bestCategory[1] : undefined;

  const openViewer = (index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, allImages.length - 1)));
    setIsViewerOpen(true);
  };
  const closeViewer = () => setIsViewerOpen(false);
  const showNext = () => setCurrentIndex((i) => (i + 1) % allImages.length);
  const showPrev = () =>
    setCurrentIndex((i) => (i - 1 + allImages.length) % allImages.length);

  // Keyboard navigation when viewer is open
  if (typeof window !== "undefined" && isViewerOpen) {
    window.onkeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeViewer();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
    };
  } else if (typeof window !== "undefined") {
    window.onkeydown = null;
  }

  if (isViewerOpen) {
    return (
      <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
        <button
          aria-label="Close"
          onClick={closeViewer}
          className="absolute top-4 right-4 text-white/90 hover:text-white text-3xl leading-none"
        >
          ×
        </button>
        <button
          aria-label="Previous"
          onClick={showPrev}
          className="absolute left-4 md:left-8 text-white/90 hover:text-white text-3xl"
        >
          ‹
        </button>
        <img
          src={allImages[currentIndex]}
          alt={`${hotel.name} photo ${currentIndex + 1}`}
          className="max-h-[80vh] max-w-[90vw] object-contain select-none"
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            if (target.src !== "/placeholder-hotel.jpg") {
              target.src = "/placeholder-hotel.jpg";
            }
          }}
        />
        <button
          aria-label="Next"
          onClick={showNext}
          className="absolute right-4 md:right-8 text-white/90 hover:text-white text-3xl"
        >
          ›
        </button>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-sm">
          {currentIndex + 1} / {allImages.length}
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
            <div className="space-y-2 md:space-y-3">
              {/* Main gallery - 3 photos */}
              <div className="grid grid-cols-3 grid-rows-2 gap-1 h-80 bg-white p-1 rounded-lg overflow-hidden">
                {/* Main image - large left side */}
                <div className="col-span-2 row-span-2 overflow-hidden rounded-l-lg">
                  <img
                    src={mainImage}
                    alt={hotel.name}
                    className="block w-full h-full object-cover object-center cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => openViewer(0)}
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      if (target.src !== "/placeholder-hotel.jpg") {
                        target.src = "/placeholder-hotel.jpg";
                      }
                    }}
                  />
                </div>

                {/* Right side - 2 small images stacked vertically */}
                <div className="col-span-1 row-span-2 grid grid-rows-2 gap-1">
                  {/* Top right - small image */}
                  <div className="row-span-1 overflow-hidden rounded-tr-lg">
                    <img
                      src={sideImages[0] || mainImage}
                      alt={`${hotel.name} photo 2`}
                      className="block w-full h-full object-cover object-center cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => openViewer(1)}
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        if (target.src !== "/placeholder-hotel.jpg") {
                          target.src = "/placeholder-hotel.jpg";
                        }
                      }}
                    />
                  </div>

                  {/* Bottom right - small image */}
                  <div className="row-span-1 overflow-hidden rounded-br-lg">
                    <img
                      src={sideImages[1] || mainImage}
                      alt={`${hotel.name} photo 3`}
                      className="block w-full h-full object-cover object-center cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => openViewer(2)}
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        if (target.src !== "/placeholder-hotel.jpg") {
                          target.src = "/placeholder-hotel.jpg";
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom section - 5 thumbnails */}
              <div className="grid grid-cols-5 gap-1 h-20 bg-white p-1 rounded-lg -mt-1.5 md:-mt-4">
                {[0, 1, 2, 3, 4].map((index) => (
                  <div key={index} className="relative overflow-hidden rounded">
                    <img
                      src={sideImages[index + 2] || mainImage}
                      alt={`${hotel.name} photo ${index + 4}`}
                      className="block w-full h-full object-cover object-center cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => openViewer(index + 3)}
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        if (target.src !== "/placeholder-hotel.jpg") {
                          target.src = "/placeholder-hotel.jpg";
                        }
                      }}
                    />
                    {index === 4 && (
                      // Overlay for last thumbnail
                      <div
                        className="absolute inset-0 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity rounded"
                        onClick={() => openViewer(3 + 4)}
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
                      {overallLabel || "Fabulous"}
                    </div>
                    <div className="text-sm text-gray-600">
                      {typeof totalReviews === "number"
                        ? `${totalReviews} reviews`
                        : "372 reviews"}
                    </div>
                  </div>
                  <div className="bg-[#003b95] text-white px-3 py-2 rounded rounded-bl-none font-bold text-lg">
                    {typeof averageRating === "number"
                      ? averageRating.toFixed(1)
                      : "8.9"}
                  </div>
                </div>
              </div>

              {/* Guest review section */}
              {latestReviewText && (
                <div className="mb-4">
                  <div className="text-sm font-semibold text-gray-900 mb-2">
                    Guests who stayed here loved
                  </div>
                  <div className="text-sm text-gray-700 mb-2">
                    {latestReviewText}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">
                        {(latestReviewerName || " ")
                          .trim()
                          .charAt(0)
                          .toUpperCase() || "M"}
                      </span>
                    </div>
                    <div className="text-sm">
                      <div className="font-medium text-gray-900 flex items-center gap-2">
                        {latestReviewerName || "Guest"}
                        <span className="text-gray-600 flex items-center gap-1">
                          <ReactCountryFlag
                            countryCode={getCountryCode(
                              latestReviewerCountry || hotel.country
                            )}
                            svg
                            style={{ width: "16px", height: "12px" }}
                          />
                          {latestReviewerCountry || hotel.country || "Israel"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Best category section tied to latest review */}
              {latestReviewText &&
                bestCategoryLabel &&
                typeof bestCategoryScore === "number" && (
                  <div className="mb-4 border-t border-b border-gray-200">
                    <div className="flex items-center justify-between pt-2 pb-2">
                      <span className="text-sm font-bold text-gray-900">
                        {bestCategoryLabel}
                      </span>
                      <div className="bg-white border border-gray-500 px-2 py-1 rounded rounded-bl-none text-base">
                        {bestCategoryScore.toFixed(1)}
                      </div>
                    </div>
                  </div>
                )}

              {/* Map section */}
              <div className="flex-1">
                <div className="rounded-lg overflow-hidden border h-48">
                  <HotelsMap hotels={[hotel]} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useMemo, useCallback } from "react";
import type { Hotel } from "@/types/hotel";
import { useQuery } from "@tanstack/react-query";
import { getHotelReviews } from "@/lib/api";
import { getAllImages, getPrimaryImage } from "@/utils/hotel-images";
import ImageViewer from "./ImageViewer";
import HotelInfoPanel from "./HotelInfoPanel";
import ImageGrid from "./ImageGrid";

interface HotelGalleryProps {
  hotel: Hotel;
}

export default function HotelGallery({ hotel }: HotelGalleryProps) {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const allImages = useMemo(
    () => getAllImages(hotel),
    [hotel.media, hotel.rooms]
  );

  const realImages = useMemo(() => {
    const filtered = allImages.filter(
      (img) => img !== "/placeholder-hotel.svg"
    );
    return filtered;
  }, [allImages]);

  const mainImage = useMemo(
    () => getPrimaryImage(hotel),
    [hotel.media, hotel.rooms]
  );

  const sideImages = useMemo(() => {
    return realImages.filter((img) => img !== mainImage).slice(0, 2);
  }, [realImages, mainImage]);

  const thumbnailImages = useMemo(() => {
    const usedImages = new Set([mainImage, ...sideImages]);
    return realImages.filter((img) => !usedImages.has(img));
  }, [realImages, mainImage, sideImages]);

  const hasRealImages = useMemo(() => {
    return realImages.length > 0;
  }, [realImages]);

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

  const openViewer = useCallback(
    (index: number) => {
      if (hasRealImages && realImages.length > 0) {
        setCurrentIndex(Math.max(0, Math.min(index, realImages.length - 1)));
        setIsViewerOpen(true);
      }
    },
    [realImages.length, hasRealImages]
  );

  const closeViewer = useCallback(() => setIsViewerOpen(false), []);
  const showNext = useCallback(
    () => setCurrentIndex((i) => (i + 1) % realImages.length),
    [realImages.length]
  );
  const showPrev = useCallback(
    () =>
      setCurrentIndex((i) => (i - 1 + realImages.length) % realImages.length),
    [realImages.length]
  );

  return (
    <div className="bg-white">
      <ImageViewer
        isOpen={isViewerOpen}
        currentIndex={currentIndex}
        images={realImages}
        hotel={hotel}
        onClose={closeViewer}
        onNext={showNext}
        onPrev={showPrev}
      />

      <div className="mx-auto max-w-6xl px-4 pt-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-9">
            <ImageGrid
              hotel={hotel}
              mainImage={mainImage}
              sideImages={sideImages}
              thumbnailImages={thumbnailImages}
              hasRealImages={hasRealImages}
              onImageClick={openViewer}
            />
          </div>

          <div className="col-span-3">
            <HotelInfoPanel
              hotel={hotel}
              totalReviews={totalReviews}
              averageRating={averageRating}
              overallLabel={overallLabel}
              latestReviewText={latestReviewText}
              latestReviewerName={latestReviewerName}
              latestReviewerCountry={latestReviewerCountry}
              bestCategoryLabel={bestCategoryLabel}
              bestCategoryScore={bestCategoryScore}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

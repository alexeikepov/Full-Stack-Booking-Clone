import type { Hotel } from "@/types/hotel";
import { Button } from "@/components/ui/button";
import HotelStars from "./HotelStars";
import WishlistButton from "@/components/layout/WishlistButton";
import PriceMatchModal from "@/components/ui/PriceMatchModal";
import { useState } from "react";
import HotelShareModal from "./HotelShareModal";

interface HotelHeaderProps {
  hotel: Hotel;
  onShowMap?: () => void;
}

export default function HotelHeader({ hotel, onShowMap }: HotelHeaderProps) {
  const [isPriceMatchModalOpen, setIsPriceMatchModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  console.log("HotelHeader hotel data:", {
    _id: hotel._id,
    name: hotel.name,
    hotelId: hotel._id?.$oid || hotel._id,
  });

  const handleShareClick = () => {
    setIsShareModalOpen(true);
  };

  const handlePriceMatchClick = () => {
    setIsPriceMatchModalOpen(true);
  };

  const handleReserveClick = () => {
    const availabilityElement = document.getElementById("info");
    if (availabilityElement) {
      availabilityElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Hotel stars and yellow thumbs up icon */}
            <div className="flex items-center gap-3 mb-3">
              <HotelStars stars={hotel.stars} />
              <div className="w-6 h-6 bg-yellow-400 rounded flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.734a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
              </div>
            </div>

            {/* Hotel name */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 leading-tight">
              {hotel.name}
            </h1>

            {/* Location with map pin */}
            <div className="flex items-center gap-2 text-base">
              <svg
                className="w-5 h-5 flex-shrink-0 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-900 hover:underline cursor-pointer font-medium">
                {hotel.address}, {hotel.city}
              </span>
              <span className="text-gray-900">–</span>
              <button
                onClick={() => {
                  if (onShowMap) {
                    onShowMap();
                  } else {
                    // Fallback to scroll behavior
                    const mapElement = document.getElementById("hotel-map");
                    if (mapElement) {
                      mapElement.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                    }
                  }
                }}
                className="text-blue-600 hover:underline cursor-pointer font-medium"
              >
                Excellent location - show map
              </button>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex flex-col items-end gap-4">
            {/* Top row: Heart, Share, Reserve */}
            <div className="flex items-center gap-3">
              <WishlistButton
                hotelId={
                  typeof hotel._id === "string"
                    ? hotel._id
                    : hotel._id?.$oid || ""
                }
                hotelName={hotel.name}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                size="md"
              />

              <button
                onClick={handleShareClick}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title="Share"
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
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                  />
                </svg>
              </button>

              <Button
                onClick={handleReserveClick}
                className="bg-[#0071c2] hover:bg-[#005fa3] px-6 py-2 text-base font-semibold rounded-sm"
              >
                Reserve
              </Button>
            </div>

            {/* Bottom row: Price Match */}
            <div className="flex items-center gap-2 text-blue-600">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              <span
                onClick={handlePriceMatchClick}
                className="text-sm font-medium hover:bg-blue-50 rounded px-2 py-1 cursor-pointer transition-colors"
              >
                We Price Match
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Price Match Modal */}
      <PriceMatchModal
        isOpen={isPriceMatchModalOpen}
        onClose={() => setIsPriceMatchModalOpen(false)}
      />

      {/* Hotel Share Modal */}
      <HotelShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        hotel={hotel}
      />
    </div>
  );
}

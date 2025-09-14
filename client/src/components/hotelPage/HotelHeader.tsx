import type { Hotel } from "@/types/hotel";
import { Button } from "@/components/ui/button";

interface HotelHeaderProps {
  hotel: Hotel;
}

export default function HotelHeader({ hotel }: HotelHeaderProps) {
  const ratingText =
    hotel.averageRating && hotel.averageRating >= 8.5
      ? "Fabulous"
      : hotel.averageRating && hotel.averageRating >= 8
      ? "Very good"
      : hotel.averageRating && hotel.averageRating >= 7
      ? "Good"
      : "Review";

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              {hotel.stars && (
                <div className="text-[#febb02] text-lg">
                  {Array(hotel.stars).fill("★").join("")}
                </div>
              )}
              <span className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full font-medium">
                Hotel
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight">
              {hotel.name}
            </h1>

            <div className="flex items-center gap-2 text-base text-blue-600 mb-4">
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="hover:underline cursor-pointer font-medium">
                {hotel.address}, {hotel.city}
              </span>
              <span className="text-blue-600 hover:underline cursor-pointer font-medium">
                – Excellent location - show map
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              {hotel.averageRating && (
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-base font-semibold text-gray-900">
                      {ratingText}
                    </div>
                    <div className="text-sm text-gray-600">
                      {hotel.reviewsCount || 372} reviews
                    </div>
                  </div>
                  <div className="bg-[#003b95] text-white px-3 py-2 rounded font-bold text-lg">
                    {hotel.averageRating.toFixed(1)}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                className="text-blue-600 border-blue-600 hover:bg-blue-50 px-4 py-2"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                Save
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="text-blue-600 border-blue-600 hover:bg-blue-50 px-4 py-2"
              >
                <svg
                  className="w-4 h-4 mr-2"
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
                Share
              </Button>

              <Button className="bg-[#0071c2] hover:bg-[#005fa3] px-6 py-2 text-base font-semibold">
                Reserve
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import ReactCountryFlag from "react-country-flag";
import HotelsMap from "@/components/maps/HotelsMap";
import type { Hotel } from "@/types/hotel";

interface HotelInfoPanelProps {
  hotel: Hotel;
  totalReviews?: number;
  averageRating?: number;
  overallLabel?: string;
  latestReviewText?: string;
  latestReviewerName?: string;
  latestReviewerCountry?: string;
  bestCategoryLabel?: string;
  bestCategoryScore?: number;
}

export default function HotelInfoPanel({
  hotel,
  totalReviews,
  averageRating,
  overallLabel,
  latestReviewText,
  latestReviewerName,
  latestReviewerCountry,
  bestCategoryLabel,
  bestCategoryScore,
}: HotelInfoPanelProps) {
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

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 h-full">
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

      {latestReviewText && (
        <div className="mb-4">
          <div className="text-sm font-semibold text-gray-900 mb-2">
            Guests who stayed here loved
          </div>
          <div className="text-sm text-gray-700 mb-2">{latestReviewText}</div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-sm">
                {(latestReviewerName || " ").trim().charAt(0).toUpperCase() ||
                  "M"}
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

      <div className="flex-1">
        <div id="hotel-map" className="rounded-lg overflow-hidden border h-48">
          <HotelsMap hotels={[hotel]} />
        </div>
      </div>
    </div>
  );
}

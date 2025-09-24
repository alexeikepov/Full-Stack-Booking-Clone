import type { Hotel } from "@/types/hotel";
import ReactCountryFlag from "react-country-flag";
import { useQuery } from "@tanstack/react-query";
import { getHotelReviews, getReviewStats } from "@/lib/api";
import { useState } from "react";
import ReviewCard from "./ReviewCard";
import CreateReviewForm from "./CreateReviewForm";

interface GuestReviewsProps {
  hotel: Hotel;
}

export default function GuestReviews({ hotel }: GuestReviewsProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "rating_high" | "rating_low" | "helpful"
  >("newest");

  // Fetch reviews from backend
  const {
    data: reviewsData,
    isLoading: reviewsLoading,
    error: reviewsError,
  } = useQuery({
    queryKey: ["reviews", hotel.id || hotel._id?.$oid, sortBy],
    queryFn: () =>
      getHotelReviews(hotel.id || hotel._id?.$oid, { sort: sortBy, limit: 10 }),
    retry: 1,
  });

  // Fetch review stats
  const { data: reviewStats } = useQuery({
    queryKey: ["reviewStats", hotel.id || hotel._id?.$oid],
    queryFn: () => getReviewStats(hotel.id || hotel._id?.$oid),
  });

  // Fetch all reviews for modal (enabled only when modal is open)
  const { data: allReviewsData, isLoading: allReviewsLoading } = useQuery({
    queryKey: ["reviews", hotel.id || hotel._id?.$oid, "all", "newest"],
    queryFn: () =>
      getHotelReviews(hotel.id || hotel._id?.$oid, {
        sort: "newest",
        limit: 1000,
      }),
    enabled: showAllReviews,
    staleTime: 0,
  });

  // Use backend data if available, otherwise fallback to hotel data
  const categoryRatings = reviewStats?.categoryAverages ||
    hotel.guestReviews?.categories ||
    hotel.categoryRatings ||
    (hotel as any).categoryRatings || {
      staff: 9.5,
      comfort: 9.1,
      freeWifi: 9.9,
      facilities: 8.8,
      valueForMoney: 8.8,
      cleanliness: 9.3,
      location: 9.5,
    };

  const categoryNames = hotel.categoryNames ||
    (hotel as any).categoryNames || {
      staff: "Staff",
      comfort: "Comfort",
      freeWifi: "Free WiFi",
      facilities: "Facilities",
      valueForMoney: "Value for money",
      cleanliness: "Cleanliness",
      location: "Location",
    };

  const highScoreCategories = hotel.highScoreCategories ||
    (hotel as any).highScoreCategories || ["freeWifi", "location"];
  const highScoreTexts =
    hotel.highScoreTexts || (hotel as any).highScoreTexts || {};
  const reviewTopics = Array.isArray(hotel.reviewTopics)
    ? hotel.reviewTopics
    : [];

  // Use reviews from backend if available, otherwise fallback to hotel data
  const guestReviews = reviewsData || hotel.guestReviews || [];

  // Use the same logic as HotelGallery
  const totalReviews =
    (hotel as any).reviewsCount ??
    hotel.guestReviews?.totalReviews ??
    reviewStats?.totalReviews ??
    undefined;
  const averageRating =
    (hotel as any).averageRating ??
    hotel.guestReviews?.overallRating ??
    reviewStats?.averageRating ??
    undefined;
  const ratingLabel =
    (hotel as any).ratingLabel ?? hotel.guestReviews?.overallLabel ?? undefined;

  // Debug logging
  console.log("GuestReviews Debug:", {
    reviewStats,
    hotelData: {
      reviewsCount: hotel.reviewsCount,
      averageRating: hotel.averageRating,
      ratingLabel: hotel.ratingLabel,
      categoryRatings: hotel.categoryRatings,
    },
    finalValues: {
      totalReviews,
      averageRating,
      ratingLabel,
      categoryRatings,
    },
  });

  // Функция для получения флага страны
  const getCountryFlag = (country: string) => {
    const countryCodeMap: Record<string, string> = {
      Israel: "IL",
      "United States": "US",
      "United Kingdom": "GB",
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
      Russia: "RU",
      "South Korea": "KR",
      Netherlands: "NL",
      Sweden: "SE",
      Norway: "NO",
      Denmark: "DK",
      Finland: "FI",
      Poland: "PL",
      "Czech Republic": "CZ",
      Hungary: "HU",
      Romania: "RO",
      Bulgaria: "BG",
      Greece: "GR",
      Turkey: "TR",
      Egypt: "EG",
      "South Africa": "ZA",
      Argentina: "AR",
      Chile: "CL",
      Colombia: "CO",
      Peru: "PE",
      Venezuela: "VE",
      Uruguay: "UY",
      Paraguay: "PY",
      Bolivia: "BO",
      Ecuador: "EC",
      Guyana: "GY",
      Suriname: "SR",
      "French Guiana": "GF",
    };

    const countryCode = countryCodeMap[country] || "IL";

    return (
      <ReactCountryFlag
        countryCode={countryCode}
        svg
        style={{
          width: "20px",
          height: "15px",
          borderRadius: "2px",
        }}
      />
    );
  };

  const ProgressBar = ({ score }: { score: number }) => {
    const percentage = (score / 10) * 100;
    const isHighScore = score >= 9.5;

    return (
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${
            isHighScore ? "bg-green-500" : "bg-[#003b95]"
          }`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    );
  };

  const CategoryItem = ({
    name,
    score,
    showArrow = false,
    arrowText = "",
  }: {
    name: string;
    score: number;
    showArrow?: boolean;
    arrowText?: string;
  }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{name}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900">{score}</span>
          {showArrow && (
            <div className="flex items-center gap-1">
              <span className="text-green-600">↗</span>
            </div>
          )}
        </div>
      </div>
      <ProgressBar score={score} />
    </div>
  );

  return (
    <div id="reviews" className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Guest reviews</h2>
          <div className="flex items-center gap-4">
            <div className="bg-[#003b95] text-white px-4 py-2 rounded font-bold text-lg">
              {typeof averageRating === "number"
                ? averageRating.toFixed(1)
                : "8.9"}
            </div>
            <div>
              <div className="font-bold text-lg text-gray-900">
                {ratingLabel || "Fabulous"}
              </div>
              <div className="text-sm text-gray-600">
                {typeof totalReviews === "number"
                  ? `${totalReviews} reviews`
                  : "372 reviews"}
              </div>
            </div>
            <button
              className="text-[#0071c2] hover:underline font-medium"
              onClick={() => setShowAllReviews(true)}
            >
              Read all reviews
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Categories:
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <CategoryItem
                name={categoryNames.staff}
                score={categoryRatings.staff}
              />
              <CategoryItem
                name={categoryNames.comfort}
                score={categoryRatings.comfort}
              />
              <CategoryItem
                name={categoryNames.freeWifi}
                score={categoryRatings.freeWifi}
                showArrow={highScoreCategories.includes("freeWifi")}
                arrowText={highScoreTexts.freeWifi}
              />
            </div>

            {/* Middle Column */}
            <div className="space-y-4">
              <CategoryItem
                name={categoryNames.facilities}
                score={categoryRatings.facilities}
              />
              <CategoryItem
                name={categoryNames.valueForMoney}
                score={categoryRatings.valueForMoney}
              />
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <CategoryItem
                name={categoryNames.cleanliness}
                score={categoryRatings.cleanliness}
              />
              <CategoryItem
                name={categoryNames.location}
                score={categoryRatings.location}
                showArrow={highScoreCategories.includes("location")}
                arrowText={highScoreTexts.location}
              />
            </div>
          </div>
        </div>

        {reviewTopics.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Select topics to read reviews:
            </h3>
            <div className="flex flex-wrap gap-2">
              {reviewTopics.map((topic) => (
                <button
                  key={topic}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  + {topic}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* All Reviews Modal */}
      {showAllReviews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white w-full max-w-4xl max-h-[80vh] rounded-lg shadow-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                All reviews
              </h3>
              <button
                aria-label="Close"
                onClick={() => setShowAllReviews(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              >
                ×
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[70vh]">
              {allReviewsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading reviews...</p>
                </div>
              ) : Array.isArray(allReviewsData) && allReviewsData.length > 0 ? (
                <div className="space-y-6">
                  {allReviewsData.map((review: any) => (
                    <ReviewCard
                      key={review._id || review.id}
                      review={review}
                      onVoteHelpful={() => {}}
                      onReport={() => {}}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-600">
                  No reviews yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

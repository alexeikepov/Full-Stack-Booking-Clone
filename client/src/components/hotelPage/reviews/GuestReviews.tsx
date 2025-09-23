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

  // Use backend data if available, otherwise fallback to hotel data
  const categoryRatings = reviewStats?.categoryAverages ||
    hotel.guestReviews?.categories ||
    hotel.categoryRatings || {
      staff: 9.5,
      comfort: 9.1,
      freeWifi: 9.9,
      facilities: 8.8,
      valueForMoney: 8.8,
      cleanliness: 9.3,
      location: 9.5,
    };

  const categoryNames = hotel.categoryNames || {
    staff: "Staff",
    comfort: "Comfort",
    freeWifi: "Free WiFi",
    facilities: "Facilities",
    valueForMoney: "Value for money",
    cleanliness: "Cleanliness",
    location: "Location",
  };

  const highScoreCategories = hotel.highScoreCategories || [
    "freeWifi",
    "location",
  ];
  const highScoreTexts = hotel.highScoreTexts || {};
  const reviewTopics = hotel.reviewTopics || [
    "Location",
    "Room",
    "Clean",
    "Noise",
    "Bed",
  ];

  // Use reviews from backend if available
  const guestReviews = reviewsData || hotel.guestReviews || [];
  const totalReviews =
    reviewStats?.totalReviews ||
    hotel.guestReviews?.totalReviews ||
    hotel.reviewsCount ||
    375;
  const averageRating =
    reviewStats?.averageRating ||
    hotel.guestReviews?.overallRating ||
    hotel.averageRating ||
    8.9;
  const ratingLabel =
    hotel.guestReviews?.overallLabel || hotel.ratingLabel || "Fabulous";

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
              {averageRating.toFixed(1)}
            </div>
            <div>
              <div className="font-bold text-lg text-gray-900">
                {ratingLabel}
              </div>
              <div className="text-sm text-gray-600">
                {totalReviews} reviews
              </div>
            </div>
            <button className="text-[#0071c2] hover:underline font-medium">
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

        {/* Reviews section */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Reviews
            </h3>

            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="rating_high">Highest Rating</option>
                <option value="rating_low">Lowest Rating</option>
                <option value="helpful">Most Helpful</option>
              </select>

              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
              >
                Write a Review
              </button>
            </div>
          </div>

          {/* Create Review Form */}
          {showCreateForm && (
            <div className="mb-8">
              <CreateReviewForm
                hotelId={hotel.id || hotel._id?.$oid}
                onSuccess={() => setShowCreateForm(false)}
                onCancel={() => setShowCreateForm(false)}
              />
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-6">
            {reviewsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading reviews...</p>
              </div>
            ) : reviewsError ? (
              <div className="text-center py-8">
                <p className="text-red-600 mb-2">Failed to load reviews</p>
                <p className="text-gray-500 text-sm">Please try again later</p>
              </div>
            ) : guestReviews.length > 0 ? (
              guestReviews.map((review) => (
                <ReviewCard
                  key={review._id || review.id}
                  review={review}
                  onVoteHelpful={(reviewId) => {
                    // Handle vote helpful
                    console.log("Vote helpful for review:", reviewId);
                  }}
                  onReport={(reviewId) => {
                    // Handle report
                    console.log("Report review:", reviewId);
                  }}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">
                  No reviews yet. Be the first to write a review!
                </p>
              </div>
            )}
          </div>

          {/* Load More Button */}
          {guestReviews.length > 0 && (
            <div className="flex items-center justify-center mt-8">
              <button className="px-6 py-2 border border-[#0071c2] text-[#0071c2] rounded-lg font-medium hover:bg-[#0071c2] hover:text-white transition-colors">
                Load More Reviews
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

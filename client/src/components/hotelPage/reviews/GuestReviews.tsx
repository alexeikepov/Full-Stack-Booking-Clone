import type { Hotel } from "@/types/hotel";
import { useQuery } from "@tanstack/react-query";
import { getHotelReviews, getReviewStats } from "@/lib/api";
import { useState } from "react";
import ReviewCard, { type Review as ReviewCardType } from "./ReviewCard";

interface GuestReviewsProps {
  hotel: Hotel;
}

export default function GuestReviews({ hotel }: GuestReviewsProps) {
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "rating_high" | "rating_low" | "helpful"
  >("newest");

  const hotelId =
    (hotel as any)?.id ||
    (hotel as any)?._id?.$oid ||
    (hotel as any)?._id ||
    "";
  const {
    data: reviewsData,
    isLoading: reviewsLoading,
    error: reviewsError,
  } = useQuery({
    queryKey: ["reviews", hotelId, sortBy],
    queryFn: () =>
      getHotelReviews(String(hotelId), { sort: sortBy, limit: 10 }),
    retry: 1,
  });

  const { data: reviewStats } = useQuery({
    queryKey: ["reviewStats", hotelId],
    queryFn: () => getReviewStats(String(hotelId)),
  });
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
  const reviewTopics = Array.isArray(hotel.reviewTopics)
    ? hotel.reviewTopics
    : [];

  const guestReviews = reviewsData || hotel.guestReviews || [];
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
  }: {
    name: string;
    score: number;
    showArrow?: boolean;
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
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Categories:
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <CategoryItem
                name={categoryNames.staff}
                score={categoryRatings.staff ?? 0}
              />
              <CategoryItem
                name={categoryNames.comfort}
                score={categoryRatings.comfort ?? 0}
              />
              <CategoryItem
                name={
                  (categoryNames as any).freeWifi ??
                  (categoryNames as any).wifi ??
                  "Free WiFi"
                }
                score={
                  (categoryRatings as any).freeWifi ??
                  (categoryRatings as any).wifi ??
                  0
                }
                showArrow={highScoreCategories.includes("freeWifi")}
              />
            </div>

            <div className="space-y-4">
              <CategoryItem
                name={categoryNames.facilities}
                score={categoryRatings.facilities ?? 0}
              />
              {
                <CategoryItem
                  name={
                    (categoryNames as any).valueForMoney ??
                    (categoryNames as any).value ??
                    "Value for money"
                  }
                  score={
                    (categoryRatings as any).valueForMoney ??
                    (categoryRatings as any).value ??
                    0
                  }
                />
              }
            </div>

            <div className="space-y-4">
              <CategoryItem
                name={categoryNames.cleanliness}
                score={categoryRatings.cleanliness ?? 0}
              />
              <CategoryItem
                name={categoryNames.location}
                score={categoryRatings.location ?? 0}
                showArrow={highScoreCategories.includes("location")}
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
            </div>
          </div>

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
              guestReviews.map((review: ReviewCardType) => (
                <ReviewCard
                  key={(review as any)._id}
                  review={review}
                  onVoteHelpful={(reviewId) => {
                    console.log("Vote helpful for review:", reviewId);
                  }}
                  onReport={(reviewId) => {
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

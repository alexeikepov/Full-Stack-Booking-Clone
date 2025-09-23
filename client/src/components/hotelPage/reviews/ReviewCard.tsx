import React from "react";

// Define Review type locally to avoid import issues
export type Review = {
  _id: string;
  hotel: string;
  user: string;
  rating: number;
  comment: string;
  guestName: string;
  guestCountry: string;
  guestInitial: string;
  categoryRatings?: {
    staff?: number;
    comfort?: number;
    facilities?: number;
    location?: number;
    cleanliness?: number;
    value?: number;
  };
  travelType?: string;
  photos?: string[];
  helpful?: number;
  verified?: boolean;
  anonymous?: boolean;
  hotelResponse?: {
    response: string;
    respondedBy?: string;
    respondedAt?: Date;
  };
  createdAt?: Date;
  updatedAt?: Date;
};

interface ReviewCardProps {
  review: Review;
  onVoteHelpful?: (reviewId: string) => void;
  onReport?: (reviewId: string) => void;
  showActions?: boolean;
}

export default function ReviewCard({
  review,
  onVoteHelpful,
  onReport,
  showActions = true,
}: ReviewCardProps) {
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 9) return "text-green-600";
    if (rating >= 7) return "text-yellow-600";
    return "text-red-600";
  };

  const getTravelTypeLabel = (travelType?: string) => {
    const labels: Record<string, string> = {
      BUSINESS: "Business",
      LEISURE: "Leisure",
      COUPLE: "Couple",
      FAMILY: "Family",
      FRIENDS: "Friends",
      SOLO: "Solo",
    };
    return labels[travelType || ""] || travelType;
  };

  return (
    <div className="border-b border-gray-200 py-6 last:border-b-0">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
            {review.guestInitial}
          </div>
          <div>
            <div className="font-semibold text-gray-900">
              {review.guestName}
            </div>
            <div className="text-sm text-gray-500">{review.guestCountry}</div>
          </div>
        </div>

        <div className="text-right">
          <div
            className={`text-2xl font-bold ${getRatingColor(review.rating)}`}
          >
            {review.rating}
          </div>
          <div className="text-sm text-gray-500">
            {review.stayDate && formatDate(review.stayDate)}
          </div>
        </div>
      </div>

      {/* Travel type and room type */}
      <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600">
        {review.travelType && (
          <span className="bg-gray-100 px-2 py-1 rounded">
            {getTravelTypeLabel(review.travelType)}
          </span>
        )}
        {review.roomType && (
          <span className="bg-gray-100 px-2 py-1 rounded">
            {review.roomType}
          </span>
        )}
        {review.isVerified && (
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
            Verified
          </span>
        )}
      </div>

      {/* Category ratings */}
      {review.categoryRatings && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {Object.entries(review.categoryRatings).map(([category, rating]) => (
            <div key={category} className="text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 capitalize">
                  {category.replace(/([A-Z])/g, " $1").trim()}
                </span>
                <span className={`font-semibold ${getRatingColor(rating)}`}>
                  {rating}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review comment */}
      {review.comment && (
        <div className="text-gray-700 mb-4">
          <p className="leading-relaxed">{review.comment}</p>
        </div>
      )}

      {/* Hotel response */}
      {review.hotelResponse && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
          <div className="flex items-center mb-2">
            <span className="text-sm font-semibold text-blue-800">
              Hotel Response
            </span>
            {review.hotelResponse.respondedAt && (
              <span className="text-xs text-blue-600 ml-2">
                {formatDate(review.hotelResponse.respondedAt)}
              </span>
            )}
          </div>
          <p className="text-blue-700 text-sm">{review.hotelResponse.text}</p>
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onVoteHelpful?.(review._id)}
              className="flex items-center space-x-1 text-sm text-gray-600 hover:text-blue-600"
            >
              <span>👍</span>
              <span>Helpful ({review.helpfulVotes || 0})</span>
            </button>

            <button
              onClick={() => onReport?.(review._id)}
              className="text-sm text-gray-600 hover:text-red-600"
            >
              Report
            </button>
          </div>

          <div className="text-xs text-gray-500">
            {formatDate(review.createdAt)}
          </div>
        </div>
      )}
    </div>
  );
}

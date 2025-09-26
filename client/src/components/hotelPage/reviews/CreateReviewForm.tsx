import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReview, updateMyReviewForHotel } from "@/lib/api";

// Define CreateReviewData type locally to match server schema
export type CreateReviewData = {
  rating: number;
  comment: string;
  negative?: string;
  guestName: string;
  guestCountry: string;
  guestInitial: string;
  categoryRatings?: {
    staff?: number;
    comfort?: number;
    freeWifi?: number;
    facilities?: number;
    valueForMoney?: number;
    cleanliness?: number;
    location?: number;
  };
  travelType?: string;
  stayDate?: string;
  roomType?: string;
};

interface CreateReviewFormProps {
  hotelId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function CreateReviewForm({
  hotelId,
  onSuccess,
  onCancel,
}: CreateReviewFormProps) {
  const [formData, setFormData] = useState<CreateReviewData>({
    rating: 5,
    comment: "",
    guestName: "",
    guestCountry: "",
    guestInitial: "",
    categoryRatings: {
      staff: 5,
      comfort: 5,
      freeWifi: 5,
      facilities: 5,
      valueForMoney: 5,
      cleanliness: 5,
      location: 5,
    },
    travelType: "LEISURE",
  });

  const queryClient = useQueryClient();

  const createReviewMutation = useMutation({
    mutationFn: async (data: CreateReviewData) => {
      console.log("Creating/updating review with data:", data);
      return await createReview(hotelId, data);
    },
    onSuccess: (data) => {
      console.log("Review created/updated successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["hotel", hotelId] });
      queryClient.invalidateQueries({ queryKey: ["reviews", hotelId] });
      alert("Review saved successfully!");
      onSuccess?.();
    },
    onError: (error: any) => {
      console.error("Review creation/update failed:", error);
      const errorMessage =
        error?.response?.data?.error ||
        error?.message ||
        "An error occurred while saving the review";
      alert(`Error: ${errorMessage}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createReviewMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCategoryRatingChange = (category: string, value: number) => {
    setFormData((prev) => ({
      ...prev,
      categoryRatings: {
        ...prev.categoryRatings,
        [category]: value,
      },
    }));
  };

  const travelTypes = [
    { value: "BUSINESS", label: "Business" },
    { value: "LEISURE", label: "Leisure" },
    { value: "COUPLE", label: "Couple" },
    { value: "FAMILY", label: "Family" },
    { value: "FRIENDS", label: "Friends" },
    { value: "SOLO", label: "Solo" },
  ];

  const categories = [
    { key: "staff", label: "Staff" },
    { key: "comfort", label: "Comfort" },
    { key: "freeWifi", label: "Free WiFi" },
    { key: "facilities", label: "Facilities" },
    { key: "valueForMoney", label: "Value for Money" },
    { key: "cleanliness", label: "Cleanliness" },
    { key: "location", label: "Location" },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Write a Review</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Overall Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Overall Rating *
          </label>
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => handleInputChange("rating", rating)}
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-semibold ${
                  formData.rating >= rating
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "border-gray-300 text-gray-400 hover:border-blue-400"
                }`}
              >
                {rating}
              </button>
            ))}
          </div>
        </div>

        {/* Guest Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Name *
            </label>
            <input
              type="text"
              required
              value={formData.guestName}
              onChange={(e) => handleInputChange("guestName", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country *
            </label>
            <input
              type="text"
              required
              value={formData.guestCountry}
              onChange={(e) =>
                handleInputChange("guestCountry", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Initial *
            </label>
            <input
              type="text"
              required
              maxLength={5}
              value={formData.guestInitial}
              onChange={(e) =>
                handleInputChange("guestInitial", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Travel Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Travel Type
          </label>
          <select
            value={formData.travelType}
            onChange={(e) => handleInputChange("travelType", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {travelTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Category Ratings */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Category Ratings
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((category) => (
              <div
                key={category.key}
                className="flex items-center justify-between"
              >
                <span className="text-sm text-gray-600">{category.label}</span>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() =>
                        handleCategoryRatingChange(category.key, rating)
                      }
                      className={`w-6 h-6 rounded-full border text-xs ${
                        (formData.categoryRatings?.[
                          category.key as keyof typeof formData.categoryRatings
                        ] || 0) >= rating
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "border-gray-300 text-gray-400 hover:border-blue-400"
                      }`}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Positive/Negative */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              What did you like?
            </label>
            <textarea
              value={formData.comment}
              onChange={(e) => handleInputChange("comment", e.target.value)}
              rows={6}
              maxLength={2000}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Positive aspects..."
            />
            <div className="text-xs text-gray-500 text-right">
              {formData.comment.length}/2000
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              What could be improved?
            </label>
            <textarea
              value={formData.negative || ""}
              onChange={(e) => handleInputChange("negative", e.target.value)}
              rows={6}
              maxLength={2000}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Negative aspects (optional)..."
            />
            <div className="text-xs text-gray-500 text-right">
              {formData.negative?.length || 0}/2000
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={createReviewMutation.isPending}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createReviewMutation.isPending ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </form>
    </div>
  );
}

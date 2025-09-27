import type {
  CreateReviewData,
  UpdateReviewData,
  HotelResponseData,
  ReviewStats,
} from "./types/index.js";
import { api } from "./instance.js";

export type {
  CreateReviewData,
  UpdateReviewData,
  HotelResponseData,
  ReviewStats,
};

export async function getHotelReviews(
  hotelId: string,
  params?: {
    page?: number;
    limit?: number;
    sort?: "newest" | "oldest" | "rating_high" | "rating_low" | "helpful";
    rating?: number;
    travelType?: string;
    status?: string;
  }
) {
  const res = await api.get(`/api/hotels/${hotelId}/reviews`, { params });
  return res.data;
}

export async function getMyReviews(params?: { page?: number; limit?: number }) {
  try {
    const res = await api.get("/api/me/reviews", { params });
    return res.data as {
      items: Array<{
        _id: string;
        hotel: {
          _id: string;
          name: string;
          city: string;
          averageRating?: number;
          reviewsCount?: number;
          media?: any[];
        };
        rating: number;
        comment?: string;
        createdAt: string;
        stayDate?: string;
      }>;
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  } catch (err: any) {
    if (err?.response?.status === 404) {
      try {
        const altHotelsMe = await api.get("/api/hotels/me/reviews", { params });
        return altHotelsMe.data;
      } catch {}
      try {
        const alt = await api.get("/api/reviews/my", { params });
        return alt.data;
      } catch {}
      try {
        const alt2 = await api.get("/api/reviews", {
          params: { ...params, me: 1 },
        });
        return alt2.data;
      } catch {}
    }
    throw err;
  }
}

export async function createReview(
  hotelId: string,
  reviewData: CreateReviewData
) {
  const res = await api.post(`/api/hotels/${hotelId}/reviews`, reviewData);
  return res.data;
}

export async function updateMyReviewForHotel(
  hotelId: string,
  reviewData: UpdateReviewData
) {
  const res = await api.patch(`/api/hotels/${hotelId}/reviews/me`, reviewData);
  return res.data;
}

export async function updateReview(
  reviewId: string,
  reviewData: UpdateReviewData
) {
  const res = await api.patch(`/api/reviews/${reviewId}`, reviewData);
  return res.data;
}

export async function deleteReview(reviewId: string) {
  const res = await api.delete(`/api/reviews/${reviewId}`);
  return res.data;
}

export async function getReviewById(reviewId: string) {
  const res = await api.get(`/api/reviews/${reviewId}`);
  return res.data;
}

export async function addHotelResponse(
  reviewId: string,
  responseData: HotelResponseData
) {
  const res = await api.post(`/api/reviews/${reviewId}/response`, responseData);
  return res.data;
}

export async function respondToReview(reviewId: string, text: string) {
  const res = await api.post(`/api/reviews/${reviewId}/response`, { text });
  return res.data;
}

export async function voteHelpful(reviewId: string) {
  const res = await api.post(`/api/reviews/${reviewId}/helpful`);
  return res.data;
}

export async function reportReview(reviewId: string) {
  const res = await api.post(`/api/reviews/${reviewId}/report`);
  return res.data;
}

export async function getReviewStats(hotelId: string): Promise<ReviewStats> {
  const res = await api.get(`/api/hotels/${hotelId}/reviews/stats`);
  return res.data;
}

import { Router } from "express";
import {
  createReview,
  getReviews,
  getReviewById,
  updateReview,
  deleteReview,
  addHotelResponse,
  voteHelpful,
  reportReview,
  getReviewStats,
} from "../controller/reviewController";
import { requireAuth, maybeAuth } from "../middlewares/auth";

const router = Router();

// ---------- Public ----------
router.get("/hotel/:hotelId", maybeAuth, getReviews);
router.get("/hotel/:hotelId/stats", getReviewStats);
router.get("/:reviewId", maybeAuth, getReviewById);

// ---------- Protected (user) ----------
router.post("/hotel/:hotelId", requireAuth, createReview);
router.patch("/:reviewId", requireAuth, updateReview);
router.delete("/:reviewId", requireAuth, deleteReview);
router.post("/:reviewId/helpful", requireAuth, voteHelpful);
router.post("/:reviewId/report", requireAuth, reportReview);

// ---------- Protected (hotel admin/owner) ----------
router.post("/:reviewId/response", requireAuth, addHotelResponse);

export default router;

import { Router } from "express";
import {
  createHotel,
  listHotels,
  getHotelById,
  updateHotel,
  deleteHotel,
  getAvailability,
  createReview,
  updateMyReview,
  deleteMyReview,
  listReviews,
  getMyReviewForHotel,  // ← add this import
} from "../controller/hotelController";
import { requireAuth,maybeAuth } from "../middlewares/auth";
const router = Router();

// Public
router.get("/", maybeAuth, listHotels);
router.get("/:id", getHotelById);
router.get("/:hotelId/availability", getAvailability);
router.get("/:hotelId/reviews", listReviews);

// Reviews: user-scoped but hotel-specific
router.get("/:hotelId/reviews/me", requireAuth, getMyReviewForHotel); // ← add this route

// Protected (hotel admin/owner actions)
router.post("/", requireAuth, createHotel);
router.put("/:id", requireAuth, updateHotel);
router.delete("/:id", requireAuth, deleteHotel);

// Review CRUD for the authenticated user
router.post("/:hotelId/reviews", requireAuth, createReview);
router.patch("/:hotelId/reviews/me", requireAuth, updateMyReview);
router.delete("/:hotelId/reviews/me", requireAuth, deleteMyReview);

export default router;

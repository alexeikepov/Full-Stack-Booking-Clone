import { Router } from "express";
import {
  createHotel,
  listHotels,
  getHotelById,
  updateHotel,
  deleteHotel,
  getAvailability,
  getHotelRooms,
  createReview,
  updateMyReview,
  deleteMyReview,
  listReviews,
  getMyReviewForHotel,
  getMyReviews,
  listCategories,
  suggestCities,
  suggestHotels,
  facetsSnapshot,
} from "../controller/hotel";
import { getReviewStats } from "../controller/review";
import { requireAuth, maybeAuth } from "../middlewares/auth";

const router = Router();

// ---------- Public ----------
router.get("/", maybeAuth, listHotels);
router.get("/:id", getHotelById);
router.get("/:hotelId/availability", getAvailability);
router.get("/:hotelId/rooms", getHotelRooms); // החזרת כל החדרים של מלון
router.get("/:hotelId/reviews", listReviews);
router.get("/:hotelId/reviews/stats", getReviewStats);

// Reviews: user-scoped but hotel-specific
router.get("/:hotelId/reviews/me", requireAuth, getMyReviewForHotel);
router.get("/me/reviews", requireAuth, getMyReviews);

// Categories, cities, facets
router.get("/_meta/categories", listCategories);
router.get("/_meta/cities", suggestCities);
router.get("/_meta/hotels", suggestHotels);
router.get("/_meta/facets", facetsSnapshot);

// ---------- Protected (hotel admin/owner) ----------
router.post("/", requireAuth, createHotel);
router.put("/:id", requireAuth, updateHotel);
router.delete("/:id", requireAuth, deleteHotel);

// ---------- Review CRUD ----------
router.post("/:hotelId/reviews", requireAuth, createReview);
router.patch("/:hotelId/reviews/me", requireAuth, updateMyReview);
router.delete("/:hotelId/reviews/me", requireAuth, deleteMyReview);

export default router;

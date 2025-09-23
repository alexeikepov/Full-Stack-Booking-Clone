import { Router } from "express";
import { requireAuth } from "../middlewares/auth";
import {
  createWishlist,
  getUserWishlists,
  getWishlistById,
  updateWishlist,
  deleteWishlist,
  addHotelToWishlist,
  removeHotelFromWishlist,
  checkHotelInWishlist,
  getPublicWishlist,
} from "../controller/wishlistController";

const router = Router();

// User's wishlists
router.get("/", requireAuth, getUserWishlists);
router.post("/", requireAuth, createWishlist);

// Specific wishlist operations
router.get("/:id", requireAuth, getWishlistById);
router.put("/:id", requireAuth, updateWishlist);
router.delete("/:id", requireAuth, deleteWishlist);

// Hotel operations within wishlist
router.post("/:id/hotels", requireAuth, addHotelToWishlist);
router.delete("/:id/hotels/:hotelId", requireAuth, removeHotelFromWishlist);

// Check if hotel is in wishlist
router.get("/check/:hotelId", requireAuth, checkHotelInWishlist);

// Public wishlist (no auth required)
router.get("/public/:id", getPublicWishlist);

export default router;

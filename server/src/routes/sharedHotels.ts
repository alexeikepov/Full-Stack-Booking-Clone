import { Router } from "express";
import { requireAuth } from "../middlewares/auth";
import {
  shareHotel,
  getSharedHotels,
  getMySharedHotels,
  updateSharedHotelStatus,
  deleteSharedHotel,
} from "../controller/sharedHotelController";

const router = Router();

// Share a hotel
router.post("/", requireAuth, shareHotel);

// Get shared hotels (received)
router.get("/", requireAuth, getSharedHotels);

// Get hotels I shared
router.get("/my-shares", requireAuth, getMySharedHotels);

// Update shared hotel status
router.patch("/:sharedHotelId/status", requireAuth, updateSharedHotelStatus);

// Delete shared hotel
router.delete("/:sharedHotelId", requireAuth, deleteSharedHotel);

export default router;

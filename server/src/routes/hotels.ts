import { Router } from "express";
import {
  createHotel,
  listHotels,
  getHotelById,
  updateHotel,
  deleteHotel,
} from "../controller/hotelController";
import { requireAuth } from "../middlewares/auth";

const router = Router();

// Public
router.get("/", listHotels);
router.get("/:id", getHotelById);

// Protected (typically owner/admin)
router.post("/", requireAuth, createHotel);
router.put("/:id", requireAuth, updateHotel);
router.delete("/:id", requireAuth, deleteHotel);

export default router;

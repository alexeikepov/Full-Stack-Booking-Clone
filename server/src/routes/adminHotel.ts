import { Router } from "express";
import { requireAuth } from "../middlewares/auth";
import {
  getAdminHotels,
  createAdminHotel,
  updateAdminHotel,
  deleteAdminHotel,
} from "../controller/adminHotelController";
import { getAnalytics } from "../controller/adminAnalyticsController";
import { updateHotelVisibility } from "../controller/adminVisibilityController";

const router = Router();

router.get("/hotels", requireAuth, getAdminHotels);

router.post("/hotels", requireAuth, createAdminHotel);

router.put("/hotels/:id", requireAuth, updateAdminHotel);

router.delete("/hotels/:id", requireAuth, deleteAdminHotel);

router.get("/analytics", requireAuth, getAnalytics);

router.patch("/hotels/:id/visibility", requireAuth, updateHotelVisibility);

export default router;

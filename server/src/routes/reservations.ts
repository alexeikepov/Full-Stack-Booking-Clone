import { Router } from "express";
import {
  createReservation,
  listReservations,
  getReservationById,
  cancelReservation,
  updateReservationStatus,
  deleteReservation,
} from "../controller/reservationController";
import { requireAuth } from "../middlewares/auth";

const router = Router();

// List (my reservations by default; admin can pass ?all=1 to see all)
router.get("/", requireAuth, listReservations);

// Create
router.post("/", requireAuth, createReservation);

// Get by id
router.get("/:id", requireAuth, getReservationById);

// Cancel (self or admin)
router.patch("/:id/cancel", requireAuth, cancelReservation);

// Update status (admin only)
router.patch("/:id/status", requireAuth, updateReservationStatus);

// Hard delete (admin only)
router.delete("/:id", requireAuth, deleteReservation);

export default router;

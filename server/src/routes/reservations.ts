import { Router } from "express";
import {
  createReservation,
  listReservations,
  getReservationById,
  updateReservation,
  cancelReservation,
  updateReservationStatus,
  deleteReservation,
  getMyActiveReservations,
  getCancellationReservationByID,
  getPastReservationByID,
  checkInReservation,
  checkOutReservation,
  addSpecialRequest,
  approveSpecialRequest,
} from "../controller/reservation";
import { requireAuth, maybeAuth } from "../middlewares/auth";

const router = Router();

// List (my reservations by default; admin can pass ?all=1 to see all)
router.get("/", requireAuth, listReservations);

// Create
router.post("/", requireAuth, createReservation);

// Get by id
router.get("/:id", requireAuth, getReservationById);

// Update reservation (user or admin)
router.patch("/:id", requireAuth, updateReservation);

// Cancel (self or admin)
router.patch("/:id/cancel", requireAuth, cancelReservation);

// Update status (admin only)
router.patch("/:id/status", requireAuth, updateReservationStatus);

// Check-in/out (admin only)
router.patch("/:id/check-in", requireAuth, checkInReservation);
router.patch("/:id/check-out", requireAuth, checkOutReservation);

// Special requests
router.post("/:id/special-request", requireAuth, addSpecialRequest);
router.patch(
  "/:id/special-request/:requestId/approve",
  requireAuth,
  approveSpecialRequest
);

// Hard delete (admin only)
router.delete("/:id", requireAuth, deleteReservation);

// My active reservations
router.get("/my/active", requireAuth, getMyActiveReservations);

// My cancelled reservations
router.get("/my/cancelled", requireAuth, getCancellationReservationByID);

// My past reservations (completed)
router.get("/my/past", requireAuth, getPastReservationByID);

export default router;

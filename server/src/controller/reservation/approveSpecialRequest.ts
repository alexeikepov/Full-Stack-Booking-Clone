import { Response, NextFunction } from "express";
import mongoose from "mongoose";
import { ReservationModel } from "../../models/Reservation";
import { AuthedRequest } from "../../middlewares/auth";

function isAdmin(role?: string) {
  return role === "OWNER" || role === "HOTEL_ADMIN";
}

// PATCH /api/reservations/:id/special-request/:requestId/approve  (admin only)
export async function approveSpecialRequest(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (!isAdmin(req.user?.role)) {
      return res.status(403).json({ error: "Admin only" });
    }

    const { id, requestId } = req.params;

    if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(requestId)) {
      return res
        .status(400)
        .json({ error: "Invalid reservation or request id" });
    }

    const reservation = await ReservationModel.findById(id);
    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    const request = reservation.specialRequests?.find(
      (req) => req._id?.toString() === requestId
    );
    if (!request) {
      return res.status(404).json({ error: "Special request not found" });
    }

    request.status = "APPROVED";
    request.approvedBy = req.user!.id as any;
    request.approvedAt = new Date();

    await reservation.save();

    res.json(reservation);
  } catch (err) {
    next(err);
  }
}

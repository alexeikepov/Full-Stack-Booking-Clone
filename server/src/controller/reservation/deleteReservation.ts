import { Response, NextFunction } from "express";
import mongoose from "mongoose";
import { ReservationModel } from "../../models/Reservation";
import { AuthedRequest } from "../../middlewares/auth";

function isAdmin(role?: string) {
  return role === "OWNER" || role === "HOTEL_ADMIN";
}

// DELETE /api/reservations/:id  (admin only)
export async function deleteReservation(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (!isAdmin(req.user?.role))
      return res.status(403).json({ error: "Admin only" });

    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid reservation id" });
    }

    const r = await ReservationModel.findByIdAndDelete(id);
    if (!r) return res.status(404).json({ error: "Reservation not found" });
    res.json({ message: "Reservation deleted" });
  } catch (err) {
    next(err);
  }
}


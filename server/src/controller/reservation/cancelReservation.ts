import { Response, NextFunction } from "express";
import mongoose from "mongoose";
import { ReservationModel } from "../../models/Reservation";
import { AuthedRequest } from "../../middlewares/auth";

function isAdmin(role?: string) {
  return role === "OWNER" || role === "HOTEL_ADMIN";
}

// PATCH /api/reservations/:id/cancel  (user or admin)
export async function cancelReservation(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid reservation id" });
    }

    const r = await ReservationModel.findById(id);
    if (!r) return res.status(404).json({ error: "Reservation not found" });

    if (!isAdmin(req.user?.role) && String(r.user) !== String(req.user!.id)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    if (r.status !== "CANCELLED") {
      r.status = "CANCELLED";
      await r.save();
    }

    const populated = await ReservationModel.findById(id)
      .populate("hotel", "name city address")
      .select("-__v")
      .lean();

    res.json(populated ?? r);
  } catch (err) {
    next(err);
  }
}

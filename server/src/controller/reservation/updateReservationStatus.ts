import { Response, NextFunction } from "express";
import mongoose from "mongoose";
import { ReservationModel } from "../../models/Reservation";
import { AuthedRequest } from "../../middlewares/auth";
import { updateStatusSchema } from "../../schemas/reservationSchemas";

function isAdmin(role?: string) {
  return role === "OWNER" || role === "HOTEL_ADMIN";
}

// PATCH /api/reservations/:id/status  (admin only)
export async function updateReservationStatus(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (!isAdmin(req.user?.role)) {
      return res.status(403).json({ error: "Admin only" });
    }

    const { id } = req.params;
    const { status } = updateStatusSchema.parse(req.body);

    const r = await ReservationModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate("hotel", "name city address")
      .select("-__v")
      .lean();

    if (!r) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    res.json(r);
  } catch (err) {
    next(err);
  }
}


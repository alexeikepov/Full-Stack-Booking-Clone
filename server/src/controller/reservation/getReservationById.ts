import { Response, NextFunction } from "express";
import mongoose from "mongoose";
import { ReservationModel } from "../../models/Reservation";
import { AuthedRequest } from "../../middlewares/auth";

function isAdmin(role?: string) {
  return role === "OWNER" || role === "HOTEL_ADMIN";
}

// GET /api/reservations/:id
export async function getReservationById(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid reservation id" });
    }

    const r = await ReservationModel.findById(id)
      .populate("hotel", "name city address")
      .select("-__v")
      .lean();

    if (!r) return res.status(404).json({ error: "Reservation not found" });
    if (
      !isAdmin(req.user?.role) &&
      String((r as any).user) !== String(req.user!.id)
    ) {
      return res.status(403).json({ error: "Forbidden" });
    }
    res.json(r);
  } catch (err) {
    next(err);
  }
}

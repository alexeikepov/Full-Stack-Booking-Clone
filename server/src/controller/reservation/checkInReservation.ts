import { Response, NextFunction } from "express";
import mongoose from "mongoose";
import { ReservationModel } from "../../models/Reservation";
import { AuthedRequest } from "../../middlewares/auth";
import { checkInSchema } from "../../schemas/reservationSchemas";

function isAdmin(role?: string) {
  return role === "OWNER" || role === "HOTEL_ADMIN";
}

// PATCH /api/reservations/:id/check-in  (admin only)
export async function checkInReservation(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (!isAdmin(req.user?.role)) {
      return res.status(403).json({ error: "Admin only" });
    }

    const { id } = req.params;
    const { roomNumber } = checkInSchema.parse(req.body);

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid reservation id" });
    }

    const reservation = await ReservationModel.findByIdAndUpdate(
      id,
      {
        status: "CHECKED_IN",
        "checkInDetails.checkedInAt": new Date(),
        "checkInDetails.checkedInBy": req.user!.id,
        "checkInDetails.roomNumber": roomNumber,
        "checkInDetails.keyCardIssued": true,
      },
      { new: true }
    )
      .populate("hotel", "name city address")
      .select("-__v")
      .lean();

    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    res.json(reservation);
  } catch (err) {
    next(err);
  }
}


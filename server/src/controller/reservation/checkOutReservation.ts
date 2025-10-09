import { Response, NextFunction } from "express";
import mongoose from "mongoose";
import { ReservationModel } from "../../models/Reservation";
import { AuthedRequest } from "../../middlewares/auth";
import { checkOutSchema } from "../../schemas/reservationSchemas";

function isAdmin(role?: string) {
  return role === "OWNER" || role === "HOTEL_ADMIN";
}

// PATCH /api/reservations/:id/check-out  (admin only)
export async function checkOutReservation(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (!isAdmin(req.user?.role)) {
      return res.status(403).json({ error: "Admin only" });
    }

    const { id } = req.params;
    const { finalBill } = checkOutSchema.parse(req.body);

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid reservation id" });
    }

    const reservation = await ReservationModel.findByIdAndUpdate(
      id,
      {
        status: "CHECKED_OUT",
        "checkOutDetails.checkedOutAt": new Date(),
        "checkOutDetails.checkedOutBy": req.user!.id,
        "checkOutDetails.keyCardReturned": true,
        "checkOutDetails.finalBill": finalBill || 0,
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


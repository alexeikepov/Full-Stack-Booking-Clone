import { Response, NextFunction } from "express";
import mongoose from "mongoose";
import { ReservationModel } from "../../models/Reservation";
import { AuthedRequest } from "../../middlewares/auth";
import { specialRequestSchema } from "../../schemas/reservationSchemas";

function isAdmin(role?: string) {
  return role === "OWNER" || role === "HOTEL_ADMIN";
}

// PATCH /api/reservations/:id/special-request  (user or admin)
export async function addSpecialRequest(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const { type, description, additionalCost } = specialRequestSchema.parse(
      req.body
    );

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid reservation id" });
    }

    const reservation = await ReservationModel.findById(id);
    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    if (
      !isAdmin(req.user?.role) &&
      String(reservation.user) !== String(req.user!.id)
    ) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const specialRequest = {
      type,
      description,
      status: "PENDING" as const,
      additionalCost,
    };

    reservation.specialRequests = reservation.specialRequests || [];
    reservation.specialRequests.push(specialRequest);
    await reservation.save();

    res.json(reservation);
  } catch (err) {
    next(err);
  }
}

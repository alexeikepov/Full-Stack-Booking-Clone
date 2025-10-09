import { Response, NextFunction } from "express";
import mongoose from "mongoose";
import { ReservationModel } from "../../models/Reservation";
import { AuthedRequest } from "../../middlewares/auth";
import { updateReservationSchema } from "../../schemas/reservationSchemas";

function isAdmin(role?: string) {
  return role === "OWNER" || role === "HOTEL_ADMIN";
}

// PATCH /api/reservations/:id  (user or admin)
export async function updateReservation(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid reservation id" });
    }

    const dto = updateReservationSchema.parse(req.body);

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

    Object.assign(reservation, dto);

    if (dto.checkIn) {
      reservation.checkIn = new Date(dto.checkIn as any);
    }
    if (dto.checkOut) {
      reservation.checkOut = new Date(dto.checkOut as any);
    }

    // Handle sharedWith - convert string IDs to ObjectIds
    if (dto.sharedWith) {
      reservation.sharedWith = dto.sharedWith.map(
        (id) => new mongoose.Types.ObjectId(id)
      );
    }

    if (dto.checkIn || dto.checkOut || dto.quantity) {
      const nights = Math.ceil(
        (reservation.checkOut.getTime() - reservation.checkIn.getTime()) /
          (1000 * 60 * 60 * 24)
      );
      const basePrice =
        reservation.pricePerNight * nights * reservation.quantity;

      let childrenCost = 0;
      if (reservation.children) {
        childrenCost =
          reservation.children.reduce((total, child) => {
            return total + (child.needsCot ? 70 : 0);
          }, 0) * nights;
      }

      reservation.nights = nights;
      reservation.totalPrice = basePrice + childrenCost;
      reservation.pricing = {
        basePrice,
        taxes: 0,
        fees: 0,
        discounts: 0,
        total: reservation.totalPrice,
      };
    }

    await reservation.save();

    const populated = await ReservationModel.findById(id)
      .populate("hotel", "name city address")
      .select("-__v")
      .lean();

    res.json(populated ?? reservation);
  } catch (err) {
    next(err);
  }
}


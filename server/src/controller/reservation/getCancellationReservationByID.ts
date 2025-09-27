import { Response, NextFunction } from "express";
import { ReservationModel } from "../../models/Reservation";
import { AuthedRequest } from "../../middlewares/auth";

// GET /api/reservations/:id/cancel (user)
export async function getCancellationReservationByID(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.id;
    const rows = await ReservationModel.find({
      user: userId,
      status: "CANCELLED",
    })
      .populate("hotel", "name city address")
      .select("-__v")
      .sort({ createdAt: -1 })
      .lean();

    res.json(rows);
  } catch (err) {
    next(err);
  }
}

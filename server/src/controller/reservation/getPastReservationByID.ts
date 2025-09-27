import { Response, NextFunction } from "express";
import { ReservationModel } from "../../models/Reservation";
import { AuthedRequest } from "../../middlewares/auth";

// GET /api/reservations/:id/past (user)
export async function getPastReservationByID(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.id;
    const rows = await ReservationModel.find({
      user: userId,
      status: "COMPLETED",
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


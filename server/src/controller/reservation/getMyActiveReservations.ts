import { Response, NextFunction } from "express";
import { ReservationModel } from "../../models/Reservation";
import { AuthedRequest } from "../../middlewares/auth";

// GET /api/reservations/my/active
export async function getMyActiveReservations(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const rows = await ReservationModel.find({
      user: userId,
      status: { $in: ["PENDING", "CONFIRMED"] },
    })
      .populate("hotel", "name city address")
      .select("-__v")
      .sort({ createdAt: -1 })
      .lean();

    if (!rows.length)
      return res.status(404).json({ error: "No active reservations" });
    res.json(rows);
  } catch (err) {
    next(err);
  }
}


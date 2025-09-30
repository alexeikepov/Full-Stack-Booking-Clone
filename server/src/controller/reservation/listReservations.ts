import { Response, NextFunction } from "express";
import mongoose from "mongoose";
import { ReservationModel } from "../../models/Reservation";
import { AuthedRequest } from "../../middlewares/auth";

function isAdmin(role?: string) {
  return role === "OWNER" || role === "HOTEL_ADMIN";
}

// GET /api/reservations
export async function listReservations(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    console.log("listReservations - User ID:", req.user?.id);

    const wantsAll =
      (req.query.all === "1" || req.query.all === "true") &&
      isAdmin(req.user?.role);
    const q = req.query as any;
    const filter: any = wantsAll
      ? {}
      : {
          $or: [
            { user: req.user!.id },
            { sharedWith: { $in: [req.user!.id] } },
          ],
        };

    console.log("Filter:", JSON.stringify(filter, null, 2));

    if (q.status) filter.status = q.status;
    if (q.hotelId && isAdmin(req.user?.role)) {
      try {
        filter.hotel = new mongoose.Types.ObjectId(String(q.hotelId));
      } catch {}
    }

    const list = await ReservationModel.find(filter)
      .sort({ createdAt: -1 })
      .populate({
        path: "hotel",
        select: "name city address media rooms",
        populate: {
          path: "rooms",
          select: "media photos",
        },
      })
      .select("-__v")
      .lean();

    console.log("Found reservations:", list.length);
    // Log hotel data for debugging
    if (list.length > 0) {
      console.log("Sample hotel data:", JSON.stringify(list[0].hotel, null, 2));
    }

    res.json(list);
  } catch (err) {
    next(err);
  }
}


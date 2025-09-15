import { Request, Response, NextFunction } from "express";
import mongoose, { Types } from "mongoose";
import { z } from "zod";
import { ReservationModel } from "../models/Reservation";
import { HotelModel } from "../models/Hotel";
import { AuthedRequest } from "../middlewares/auth";

const createReservationSchema = z.object({
  hotelId: z.string().min(1),
  roomType: z.enum(["STANDARD", "DELUXE", "SUITE"]),
  quantity: z.number().int().positive(),
  guests: z.number().int().positive(),
  from: z.union([z.string(), z.date()]),
  to: z.union([z.string(), z.date()]),
  notes: z.string().max(2000).optional(),
});

const updateStatusSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]),
});

function isAdmin(role?: string) {
  return role === "OWNER" || role === "HOTEL_ADMIN";
}

// POST /api/reservations
export async function createReservation(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const dto = createReservationSchema.parse(req.body);

    const from = new Date(dto.from as any);
    const to = new Date(dto.to as any);
    if (isNaN(+from) || isNaN(+to) || to <= from) {
      return res.status(400).json({ error: "Invalid date range" });
    }

    const hotel = await HotelModel.findById(dto.hotelId).lean();
    if (!hotel) return res.status(404).json({ error: "Hotel not found" });

    const roomInfo = (hotel as any).rooms?.find(
      (r: any) => r.roomType === dto.roomType
    );
    if (!roomInfo)
      return res
        .status(400)
        .json({ error: "Room type not available in hotel" });

    const hotelObjectId = new Types.ObjectId(dto.hotelId);
    const overlap = await ReservationModel.aggregate<{ qty: number }>([
      {
        $match: {
          hotel: hotelObjectId,
          roomType: dto.roomType,
          status: { $in: ["PENDING", "CONFIRMED"] },
          from: { $lt: to },
          to: { $gt: from },
        },
      },
      { $group: { _id: null, qty: { $sum: "$quantity" } } },
      { $project: { qty: 1, _id: 0 } },
    ]);

    const alreadyBooked = overlap[0]?.qty ?? 0;
    const totalRooms =
      roomInfo.totalRooms ??
      roomInfo.availableRooms ??
      roomInfo.totalUnits ??
      0;
    const availableNow = Math.max(0, totalRooms - alreadyBooked);

    if (dto.quantity > availableNow) {
      return res
        .status(409)
        .json({ error: "Not enough rooms available", available: availableNow });
    }

    const created = await ReservationModel.create({
      user: req.user!.id,
      hotel: dto.hotelId,
      roomType: dto.roomType,
      quantity: dto.quantity,
      guests: dto.guests,
      from,
      to,
      pricePerNight: roomInfo.pricePerNight,
      status: "PENDING",
      payment: { method: "NONE", paid: false },
      notes: dto.notes ?? "",
    });

    const populated = await ReservationModel.findById(created._id)
      .populate("hotel", "name city address")
      .select("-__v")
      .lean();

    res.status(201).json(populated ?? created);
  } catch (err) {
    next(err);
  }
}

// GET /api/reservations
export async function listReservations(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const wantsAll =
      (req.query.all === "1" || req.query.all === "true") &&
      isAdmin(req.user?.role);
    const filter = wantsAll ? {} : { user: req.user!.id };

    const list = await ReservationModel.find(filter)
      .sort({ createdAt: -1 })
      .populate("hotel", "name city address")
      .select("-__v")
      .lean();

    res.json(list);
  } catch (err) {
    next(err);
  }
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

// GET /api/reservations/:id/cancel (user)
export async function getCancellationReesevatioByID(
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

// PATCH /api/reservations/:id/cancel  (user or admin)
export async function cancelReservation(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid reservation id" });
    }

    const r = await ReservationModel.findById(id);
    if (!r) return res.status(404).json({ error: "Reservation not found" });

    if (!isAdmin(req.user?.role) && String(r.user) !== String(req.user!.id)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    if (r.status !== "CANCELLED") {
      r.status = "CANCELLED";
      await r.save();
    }

    const populated = await ReservationModel.findById(id)
      .populate("hotel", "name city address")
      .select("-__v")
      .lean();

    res.json(populated ?? r);
  } catch (err) {
    next(err);
  }
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

// DELETE /api/reservations/:id  (admin only)
export async function deleteReservation(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (!isAdmin(req.user?.role))
      return res.status(403).json({ error: "Admin only" });

    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid reservation id" });
    }

    const r = await ReservationModel.findByIdAndDelete(id);
    if (!r) return res.status(404).json({ error: "Reservation not found" });
    res.json({ message: "Reservation deleted" });
  } catch (err) {
    next(err);
  }
}

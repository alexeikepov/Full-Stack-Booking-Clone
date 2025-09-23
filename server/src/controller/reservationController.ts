import { Response, NextFunction } from "express";
import mongoose, { Types } from "mongoose";
import { z } from "zod";
import { ReservationModel } from "../models/Reservation";
import { HotelModel } from "../models/Hotel";
import { AuthedRequest } from "../middlewares/auth";

const createReservationSchema = z.object({
  hotelId: z.string().min(1),
  roomType: z.string().min(1),
  roomName: z.string().min(1),
  roomId: z.string().min(1),
  quantity: z.number().int().positive(),

  guests: z.object({
    adults: z.number().int().positive(),
    children: z.number().int().min(0).default(0),
  }),

  checkIn: z.union([z.string(), z.date()]),
  checkOut: z.union([z.string(), z.date()]),

  guestInfo: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
    country: z.string().optional(),
    specialRequests: z.string().optional(),
    dietaryRequirements: z.string().optional(),
    arrivalTime: z.string().optional(),
    departureTime: z.string().optional(),
  }),

  children: z
    .array(
      z.object({
        name: z.string().optional(),
        age: z.number().int().positive(),
        needsCot: z.boolean().default(false),
      })
    )
    .optional(),

  specialRequests: z
    .array(
      z.object({
        type: z.string(),
        description: z.string(),
        additionalCost: z.number().min(0).default(0),
      })
    )
    .optional(),

  payment: z
    .object({
      method: z
        .enum([
          "NONE",
          "CASH",
          "CARD",
          "PAYPAL",
          "AMERICAN_EXPRESS",
          "VISA",
          "MASTERCARD",
          "JCB",
          "MAESTRO",
          "DISCOVER",
          "UNIONPAY",
        ])
        .default("NONE"),
      paid: z.boolean().default(false),
      transactionId: z.string().optional(),
    })
    .optional(),

  policies: z
    .object({
      freeCancellation: z.boolean().default(true),
      noPrepayment: z.boolean().default(true),
      priceMatch: z.boolean().default(true),
      cancellationDeadline: z.string().optional(),
      cancellationPolicy: z.string().optional(),
    })
    .optional(),

  notes: z.string().max(2000).optional(),
});

const updateStatusSchema = z.object({
  status: z.enum([
    "PENDING",
    "CONFIRMED",
    "CANCELLED",
    "COMPLETED",
    "NO_SHOW",
    "CHECKED_IN",
    "CHECKED_OUT",
  ]),
});

const updateReservationSchema = createReservationSchema.partial();

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

    const checkIn = new Date(dto.checkIn as any);
    const checkOut = new Date(dto.checkOut as any);
    if (isNaN(+checkIn) || isNaN(+checkOut) || checkOut <= checkIn) {
      return res.status(400).json({ error: "Invalid date range" });
    }

    const hotel = await HotelModel.findById(dto.hotelId).lean();
    if (!hotel) return res.status(404).json({ error: "Hotel not found" });

    const roomInfo = (hotel as any).rooms?.find(
      (r: any) => r._id.toString() === dto.roomId
    );
    if (!roomInfo) {
      return res.status(400).json({ error: "Room not found in hotel" });
    }

    const hotelObjectId = new Types.ObjectId(dto.hotelId);
    const overlap = await ReservationModel.aggregate<{ qty: number }>([
      {
        $match: {
          hotel: hotelObjectId,
          roomId: new Types.ObjectId(dto.roomId),
          status: { $in: ["PENDING", "CONFIRMED"] },
          checkIn: { $lt: checkOut },
          checkOut: { $gt: checkIn },
        },
      },
      { $group: { _id: null, qty: { $sum: "$quantity" } } },
      { $project: { qty: 1, _id: 0 } },
    ]);

    const alreadyBooked = overlap[0]?.qty ?? 0;
    const totalRooms =
      roomInfo.totalRooms ?? roomInfo.availableRooms ?? roomInfo.totalUnits ?? 0;
    const availableNow = Math.max(0, totalRooms - alreadyBooked);

    if (dto.quantity > availableNow) {
      return res.status(409).json({
        error: "Not enough rooms available",
        available: availableNow,
        requested: dto.quantity,
      });
    }

    const nights = Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
    );
    const basePrice = roomInfo.pricePerNight * nights * dto.quantity;

    let childrenCost = 0;
    if (dto.children) {
      childrenCost =
        dto.children.reduce((total, child) => {
          return total + (child.needsCot ? 70 : 0);
        }, 0) * nights;
    }

    const totalPrice = basePrice + childrenCost;

    const created = await ReservationModel.create({
      user: req.user!.id,
      hotel: dto.hotelId,
      roomType: dto.roomType,
      roomName: dto.roomName,
      roomId: dto.roomId,
      quantity: dto.quantity,
      guests: {
        adults: dto.guests.adults,
        children: dto.guests.children,
        total: dto.guests.adults + dto.guests.children,
      },
      checkIn,
      checkOut,
      nights,
      pricePerNight: roomInfo.pricePerNight,
      totalPrice,
      currency: "₪",
      status: "PENDING",
      payment: dto.payment || { method: "NONE", paid: false },
      guestInfo: dto.guestInfo,
      children: dto.children || [],
      specialRequests: dto.specialRequests || [],
      policies: dto.policies || {
        freeCancellation: true,
        noPrepayment: true,
        priceMatch: true,
      },
      pricing: {
        basePrice,
        taxes: 0,
        fees: 0,
        discounts: 0,
        total: totalPrice,
      },
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
    const q = req.query as any;
    const filter: any = wantsAll ? {} : { user: req.user!.id };
    if (q.status) filter.status = q.status;
    if (q.hotelId && isAdmin(req.user?.role)) {
      try {
        filter.hotel = new mongoose.Types.ObjectId(String(q.hotelId));
      } catch {}
    }

    const list = await ReservationModel.find(filter)
      .sort({ createdAt: -1 })
      .populate("hotel", "name city address media rooms")
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

    if (dto.checkIn || dto.checkOut || dto.quantity) {
      const nights = Math.ceil(
        (reservation.checkOut.getTime() - reservation.checkIn.getTime()) /
          (1000 * 60 * 60 * 24)
      );
      const basePrice = reservation.pricePerNight * nights * reservation.quantity;

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
    const { roomNumber } = req.body;

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
    const { finalBill } = req.body;

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

// PATCH /api/reservations/:id/special-request  (user or admin)
export async function addSpecialRequest(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const { type, description, additionalCost = 0 } = req.body;

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

// PATCH /api/reservations/:id/special-request/:requestId/approve  (admin only)
export async function approveSpecialRequest(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (!isAdmin(req.user?.role)) {
      return res.status(403).json({ error: "Admin only" });
    }

    const { id, requestId } = req.params;

    if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(requestId)) {
      return res
        .status(400)
        .json({ error: "Invalid reservation or request id" });
    }

    const reservation = await ReservationModel.findById(id);
    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    const request = reservation.specialRequests?.find(
      (req) => req._id?.toString() === requestId
    );
    if (!request) {
      return res.status(404).json({ error: "Special request not found" });
    }

    request.status = "APPROVED";
    request.approvedBy = req.user!.id as any;
    request.approvedAt = new Date();

    await reservation.save();

    res.json(reservation);
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



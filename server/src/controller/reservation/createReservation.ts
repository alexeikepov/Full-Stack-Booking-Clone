import { Response, NextFunction } from "express";
import mongoose, { Types } from "mongoose";
import { ReservationModel } from "../../models/Reservation";
import { HotelModel } from "../../models/Hotel";
import { AuthedRequest } from "../../middlewares/auth";
import { createReservationSchema } from "../../schemas/reservationSchemas";

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
      roomInfo.totalRooms ??
      roomInfo.availableRooms ??
      roomInfo.totalUnits ??
      0;
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

import { Request, Response, NextFunction } from "express";
import { HotelModel } from "../models/Hotel";
import { AuthedRequest } from "../middlewares/auth";
import { isOwnerOrAdmin } from "../middlewares/adminAuth";
import { processHotelUpdateData } from "../utils/hotelDataProcessor";

export async function getAdminHotels(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (!isOwnerOrAdmin(req.user?.role))
      return res.status(403).json({ error: "Forbidden" });

    const userId = req.user!.id;
    const filter = { $or: [{ ownerId: userId }, { adminIds: userId }] } as any;
    const hotels = await HotelModel.find(filter).sort({ createdAt: -1 }).lean();
    res.json(
      hotels.map((h: any) => {
        const approved = h.approvalStatus === "APPROVED";
        const visible = h.isVisible !== false;
        const status = approved && visible ? "active" : "inactive";
        return {
          id: String(h._id),
          name: h.name,
          city: h.city,
          address: h.address,
          averageRating: h.averageRating ?? 0,
          reviewsCount: h.reviewsCount ?? 0,
          rooms: Array.isArray(h.rooms) ? h.rooms.length : 0,
          status,
          isVisible: visible,
          approvalStatus: h.approvalStatus,
          createdAt: h.createdAt,
        };
      })
    );
  } catch (err) {
    next(err);
  }
}

export async function createAdminHotel(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (!isOwnerOrAdmin(req.user?.role))
      return res.status(403).json({ error: "Forbidden" });
    const payload = req.body || {};
    const hotel = await HotelModel.create({
      name: payload.name,
      city: payload.city,
      address: payload.address,
      country: payload.country,
      description: payload.description,
      shortDescription: payload.shortDescription,
      location: payload.location,
      rooms: payload.rooms || [],
      media: payload.media || [],
      facilities: payload.facilities || {},
      propertyHighlights: payload.propertyHighlights || {},
      houseRules: payload.houseRules || undefined,
      surroundings: payload.surroundings || undefined,
      overview: payload.overview || undefined,
      mostPopularFacilities: payload.mostPopularFacilities || [],
      categories: payload.categories || [],
      travellersQuestions: payload.travellersQuestions || [],
      ownerId: req.user!.id,
      adminIds: [req.user!.id],
      isVisible: true,
    });
    res.status(201).json({
      id: hotel.id,
      name: hotel.name,
      city: hotel.city,
      address: hotel.address,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateAdminHotel(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (!isOwnerOrAdmin(req.user?.role)) {
      return res
        .status(403)
        .json({ error: "Forbidden - insufficient permissions" });
    }

    const { id } = req.params;
    const update = req.body || {};

    const processedUpdate = processHotelUpdateData(update);

    let hotel;
    if (req.user?.role === "OWNER") {
      hotel = await HotelModel.findByIdAndUpdate(id, processedUpdate, {
        new: true,
        runValidators: true,
      }).lean();
    } else {
      hotel = await HotelModel.findOneAndUpdate(
        {
          _id: id,
          $or: [{ ownerId: req.user!.id }, { adminIds: req.user!.id }],
        },
        processedUpdate,
        { new: true, runValidators: true }
      ).lean();
    }
    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }

    res.json({
      id: String(hotel._id),
      name: hotel.name,
      city: hotel.city,
      address: hotel.address,
      status:
        hotel.approvalStatus === "APPROVED" && hotel.isVisible !== false
          ? "active"
          : "inactive",
    });
  } catch (err: any) {
    if (err.name === "ValidationError") {
      const validationErrors = Object.values(err.errors)
        .map((e: any) => `${e.path}: ${e.message}`)
        .join(", ");
      return res
        .status(400)
        .json({ error: `Validation error: ${validationErrors}` });
    }
    if (err.name === "CastError") {
      return res.status(400).json({
        error: `Invalid data format for field ${err.path}: ${err.message}`,
      });
    }
    next(err);
  }
}

export async function deleteAdminHotel(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (!isOwnerOrAdmin(req.user?.role))
      return res.status(403).json({ error: "Forbidden" });
    const { id } = req.params;
    const hotel = await HotelModel.findByIdAndDelete(id).lean();
    if (!hotel) return res.status(404).json({ error: "Hotel not found" });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

import { Response, NextFunction } from "express";
import mongoose from "mongoose";
import { z } from "zod";
import { HotelModel } from "../../models/Hotel";
import { AuthedRequest } from "../../middlewares/auth";

const roomSchema = z.object({
  roomType: z.enum(["STANDARD", "DELUXE", "SUITE"]),
  pricePerNight: z.number().nonnegative(),
  totalRooms: z.number().int().nonnegative(),
  availableRooms: z.number().int().nonnegative().optional(),
});

const surroundingsSchema = z.object({
  nearbyAttractions: z
    .array(
      z.object({
        name: z.string(),
        distance: z.string(),
      })
    )
    .optional(),
  topAttractions: z
    .array(
      z.object({
        name: z.string(),
        distance: z.string(),
      })
    )
    .optional(),
  restaurantsCafes: z
    .array(
      z.object({
        name: z.string(),
        type: z.string(),
        distance: z.string(),
      })
    )
    .optional(),
  naturalBeauty: z
    .array(
      z.object({
        name: z.string(),
        type: z.string(),
        distance: z.string(),
      })
    )
    .optional(),
  publicTransport: z
    .array(
      z.object({
        name: z.string(),
        type: z.string(),
        distance: z.string(),
      })
    )
    .optional(),
  closestAirports: z
    .array(
      z.object({
        name: z.string(),
        distance: z.string(),
      })
    )
    .optional(),
});

const updateHotelSchema = z.object({
  name: z.string().min(2).optional(),
  city: z.string().min(2).optional(),
  address: z.string().min(2).optional(),
  location: z
    .object({
      coordinates: z.tuple([z.number(), z.number()]),
    })
    .optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  amenities: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
  rooms: z.array(roomSchema).min(1).optional(),
  surroundings: surroundingsSchema.optional(),
});

export async function updateHotel(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ error: "Invalid hotel id" });
    const dto = updateHotelSchema.parse(req.body);
    const h = await HotelModel.findById(id);
    if (!h) return res.status(404).json({ error: "Hotel not found" });

    if (dto.location?.coordinates) {
      (dto as any).location = {
        lat: dto.location.coordinates[1],
        lng: dto.location.coordinates[0],
      };
    }

    if (Array.isArray(dto.rooms)) {
      const normalizedRooms = dto.rooms.map((r) => ({
        name: r.roomType,
        pricePerNight: r.pricePerNight,
        totalRooms: r.totalRooms,
      }));
      (dto as any).rooms = normalizedRooms;
    }

    Object.assign(h, dto);
    await h.save();
    res.json(h);
  } catch (err) {
    next(err);
  }
}


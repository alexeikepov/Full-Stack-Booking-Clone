import { Response, NextFunction } from "express";
import { z } from "zod";
import { HotelModel } from "../../models/Hotel";
import { AuthedRequest } from "../../middlewares/auth";

const roomSchema = z.object({
  // roomType is the UI/API label; stored as Room.name in DB
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

const createHotelSchema = z.object({
  name: z.string().min(2),
  city: z.string().min(2),
  address: z.string().min(2),
  location: z
    .object({
      coordinates: z.tuple([z.number(), z.number()]), // [lng, lat] from client
    })
    .optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  amenities: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
  rooms: z.array(roomSchema).min(1),
  surroundings: surroundingsSchema.optional(),
});

export async function createHotel(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const dto = createHotelSchema.parse(req.body);

    const loc = dto.location?.coordinates
      ? { lat: dto.location.coordinates[1], lng: dto.location.coordinates[0] }
      : undefined;

    const normalizedRooms =
      dto.rooms?.map((r) => ({
        name: r.roomType,
        pricePerNight: r.pricePerNight,
        totalRooms: r.totalRooms,
      })) ?? [];

    const doc = await HotelModel.create({
      name: dto.name,
      city: dto.city,
      address: dto.address,
      location: loc,
      description: dto.description,
      categories: dto.categories,
      media: dto.images?.map((src) => ({ url: src, type: "image" })) ?? [],
      rooms: normalizedRooms,
      surroundings: dto.surroundings,
      ownerId: req.user?.id,
    });

    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
}

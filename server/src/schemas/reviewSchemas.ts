// src/schemas/reviewSchemas.ts
import { z } from "zod";

export const reviewCreateSchema = z.object({
  rating: z.number().int().min(1).max(10),
  comment: z.string().max(2000).optional().default(""),
  negative: z.string().max(2000).optional().default(""),

  // Guest info
  guestName: z.string().min(1).max(100),
  guestCountry: z.string().min(1).max(100),
  guestInitial: z.string().min(1).max(5),

  // Detailed ratings
  categoryRatings: z
    .object({
      staff: z.number().int().min(1).max(10).optional(),
      comfort: z.number().int().min(1).max(10).optional(),
      freeWifi: z.number().int().min(1).max(10).optional(),
      facilities: z.number().int().min(1).max(10).optional(),
      valueForMoney: z.number().int().min(1).max(10).optional(),
      cleanliness: z.number().int().min(1).max(10).optional(),
      location: z.number().int().min(1).max(10).optional(),
    })
    .optional(),

  // Stay details
  stayDate: z.string().optional(),
  roomType: z.string().optional(),
  travelType: z
    .enum(["BUSINESS", "LEISURE", "COUPLE", "FAMILY", "FRIENDS", "SOLO"])
    .optional(),
});

export const reviewUpdateSchema = reviewCreateSchema.partial();

export const reviewResponseSchema = z.object({
  text: z.string().min(1).max(1000),
});

export type ReviewCreateInput = z.infer<typeof reviewCreateSchema>;
export type ReviewUpdateInput = z.infer<typeof reviewUpdateSchema>;
export type ReviewResponseInput = z.infer<typeof reviewResponseSchema>;

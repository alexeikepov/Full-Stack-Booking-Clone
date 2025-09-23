// src/controller/trendingCityController.ts
import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { getTopCities } from "../services/trendingCityService";

const querySchema = z.object({
  windowDays: z.coerce.number().int().positive().max(365).optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  statuses: z
    .string()
    .transform((s) => s.split(",").map((x) => x.trim()))
    .optional(),
});

export async function topCities(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = querySchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid query", issues: parsed.error.issues });
    }

    const { windowDays, limit, statuses } = parsed.data;
    const rows = await getTopCities({
      windowDays,
      limit,
      statuses: statuses as any,
    });

    res.json(rows);
  } catch (err) {
    next(err);
  }
}

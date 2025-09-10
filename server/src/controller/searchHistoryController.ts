// src/controller/searchHistoryController.ts
import { Response, NextFunction } from "express";
import { z } from "zod";
import { AuthedRequest } from "../middlewares/auth";
import { saveLastSearch, getLastSearchForUser } from "../services/searchHistoryService";

const filtersSchema = z.object({
  city: z.string().min(1).optional(),
  from: z.union([z.string(), z.date()]).optional(),
  to: z.union([z.string(), z.date()]).optional(),
  adults: z.coerce.number().int().positive().optional(),
  children: z.coerce.number().int().nonnegative().optional(),
  rooms: z.coerce.number().int().positive().optional(),
});

export async function postLastSearch(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.id) return res.status(401).json({ error: "Unauthorized" });
    const dto = filtersSchema.parse(req.body);
    await saveLastSearch(req.user.id, dto);
    res.status(204).send();
  } catch (err) { next(err); }
}

export async function getLastSearch(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.id) return res.status(401).json({ error: "Unauthorized" });
    const last = await getLastSearchForUser(req.user.id);
    if (!last) return res.status(404).json({ error: "No last search" });
    res.json(last);
  } catch (err) { next(err); }
}

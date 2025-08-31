import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middlewares/auth";

const router = Router();

const createHotelSchema = z.object({
  name: z.string().min(2),
  city: z.string().min(2),
  address: z.string().min(2),
  rooms: z.number().int().positive(),
});

router.get("/", async (_req, res) => {
  // TODO: replace with DB query
  res.json([]);
});

router.post("/", requireAuth, async (req, res, next) => {
  try {
    const dto = createHotelSchema.parse(req.body);
    // TODO: insert into DB
    res.status(201).json({ id: "demo-hotel-id", ...dto });
  } catch (err) {
    next(err);
  }
});

export default router;

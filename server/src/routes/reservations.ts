import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middlewares/auth";

const router = Router();

const createReservationSchema = z.object({
  hotelId: z.string().min(1),
  room: z.number().int().positive(),
  from: z.string().datetime(),
  to: z.string().datetime(),
  guests: z.number().int().positive(),
});

router.get("/", requireAuth, async (_req, res) => {
  // TODO: replace with DB query filtered by user
  res.json([]);
});

router.post("/", requireAuth, async (req, res, next) => {
  try {
    const dto = createReservationSchema.parse(req.body);
    // TODO: insert into DB and associate with userId
    res.status(201).json({ id: "demo-res-id", ...dto });
  } catch (err) {
    next(err);
  }
});

export default router;

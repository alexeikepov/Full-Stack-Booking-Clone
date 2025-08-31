import { Router } from "express";

const router = Router();

// GET reservations
router.get("/", async (req, res) => {
  res.json([{ id: "1", hotelId: "1", userIds: ["2"] }]);
});

// POST create reservation
router.post("/", async (req, res) => {
  const data = req.body;
  res.status(201).json({ message: "Reservation created", data });
});

export default router;

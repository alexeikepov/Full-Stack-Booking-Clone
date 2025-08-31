import { Router } from "express";

const router = Router();

// GET all hotels
router.get("/", async (req, res) => {
  // TODO: query DB
  res.json([{ id: "1", name: "Hotel Demo" }]);
});

// POST create hotel
router.post("/", async (req, res) => {
  const data = req.body;
  // TODO: insert DB
  res.status(201).json({ message: "Hotel created", data });
});

export default router;

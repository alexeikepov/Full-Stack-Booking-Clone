// src/routes/trendingCities.ts
import { Router } from "express";
import { topCities } from "../controller/trendingCityController";

const router = Router();
router.get("/trending/cities", topCities);
export default router;

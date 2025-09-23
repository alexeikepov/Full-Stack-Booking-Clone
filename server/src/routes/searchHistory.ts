// src/routes/searchHistory.ts
import { Router } from "express";
import { requireAuth } from "../middlewares/auth";
import { postLastSearch, getLastSearch } from "../controller/searchHistoryController";

const router = Router();
router.post("/me/last-search", requireAuth, postLastSearch);
router.get("/me/last-search", requireAuth, getLastSearch);
export default router;

// server.ts (clean server bootstrap)

import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import http from "http";
import rateLimit from "express-rate-limit";

import { config } from "./src/config";
import { notFound, errorHandler } from "./src/middlewares/errors";
import trendingCitiesRoutes from "./src/routes/trendingCities";
import adminHotelRoutes from "./src/routes/adminHotel";
import userRoutes from "./src/routes/users";
import meRoutes from "./src/routes/me";
import hotelRoutes from "./src/routes/hotels";
import reservationRoutes from "./src/routes/reservations";
import reviewRoutes from "./src/routes/reviews";
import wishlistRoutes from "./src/routes/wishlists";
import cron from "node-cron";
import { ReservationModel } from "./src/models/Reservation";
import searchHistoryRoutes from "./src/routes/searchHistory";
import authRoutes from "./src/routes/auth";
import friendRequestRoutes from "./src/routes/friendRequests";

async function start() {
  const app = express();

  // Trust proxy (required on some hosts)
  const trustProxy = process.env.NODE_ENV === "production" ? 1 : false;
  app.set("trust proxy", trustProxy);
  // CORS (set exact client origin)
  app.use(cors({ origin: config.clientUrl, credentials: true }));

  // Body parsers
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));

  // Healthcheck
  app.get("/health", (_req, res) => {
    res.json({ ok: true, env: config.nodeEnv, time: new Date().toISOString() });
  });

  // Rate-limit auth endpoints
  const authLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use("/api/users/login", authLimiter);
  app.use("/api/users/register", authLimiter);

  // Routes
  app.use("/api/users", userRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api", meRoutes);
  app.use("/api/hotels", hotelRoutes);
  app.use("/api/reservations", reservationRoutes);
  app.use("/api/reviews", reviewRoutes);
  app.use("/api/wishlists", wishlistRoutes);
  app.use("/api/admin-hotel", adminHotelRoutes);
  app.use("/api", trendingCitiesRoutes);
  app.use("/api", searchHistoryRoutes);
  app.use("/api/friend-requests", friendRequestRoutes);

  // 404 + error handling
  app.use(notFound);
  app.use(errorHandler);

  // DB connect
  await mongoose.connect(config.mongoUri, { serverSelectionTimeoutMS: 3000 });

  // Listen
  const server = http.createServer(app);
  server.listen(config.port, () => {
    console.log(`🚀 API on http://localhost:${config.port}`);
    console.log(`🌍 CORS origin: ${config.clientUrl}`);
  });

  // Nightly cron: mark past reservations as COMPLETED
  cron.schedule("0 0 * * *", async () => {
    const now = new Date();
    const result = await ReservationModel.updateMany(
      { to: { $lt: now }, status: { $in: ["PENDING", "CONFIRMED"] } },
      { $set: { status: "COMPLETED" } }
    );
    console.log(
      `✅ Cron: ${result.modifiedCount} reservations marked as COMPLETED`
    );
  });

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    console.log(`\n🛑 ${signal} received, shutting down...`);
    server.close(() => console.log("HTTP server closed"));
    await mongoose.connection.close();
    console.log("Mongo connection closed");
    process.exit(0);
  };
  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

start().catch((e) => {
  console.error("❌ Failed to start server:", e);
  process.exit(1);
});

export default {};

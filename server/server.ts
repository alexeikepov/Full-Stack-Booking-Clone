import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import http from "http";
import rateLimit from "express-rate-limit";

import { config } from "./src/config";
import { notFound, errorHandler } from "./src/middlewares/errors";
import trendingCitiesRoutes from "./src/routes/trendingCities";
import authRoutes from "./src/routes/auth";
import userRoutes from "./src/routes/users";         
import meRoutes from "./src/routes/me";
import hotelRoutes from "./src/routes/hotels";
import reservationRoutes from "./src/routes/reservations";
import cron from "node-cron";
import { ReservationModel } from "./src/models/Reservation";
import { clerkMiddleware } from "@clerk/express";
import searchHistoryRoutes from "./src/routes/searchHistory";

  
async function start() {
  const app = express();

  // Core middleware
  app.set("trust proxy", true);
  app.use(clerkMiddleware()); 

  app.use(cors({ origin: config.clientUrl, credentials: true }));
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));

  // Health
  app.get("/health", (_req, res) => {
    res.json({ ok: true, env: config.nodeEnv, time: new Date().toISOString() });
  });

  // Rate-limit only for sensitive auth endpoints
  const authLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use("/api/auth", authLimiter);
  app.use("/api/users/login", authLimiter);
  app.use("/api/users/register", authLimiter);

  // Routes
  app.use("/api/auth", authRoutes);           // /api/auth/register, /api/auth/login
  app.use("/api/users", userRoutes);          // ✅ /api/users/*
  app.use("/api", meRoutes);                  // /api/me
  app.use("/api/hotels", hotelRoutes);        // /api/hotels/*
  app.use("/api/reservations", reservationRoutes); // /api/reservations/*
  app.use("/api", trendingCitiesRoutes);
app.use("/api", searchHistoryRoutes);

  // 404 + error handling
  app.use(notFound);
  app.use(errorHandler);

  // DB connect (with fast fail if Mongo is down)
  await mongoose.connect(config.mongoUri, {
    serverSelectionTimeoutMS: 5000, 
  });

  // Listen
  const server = http.createServer(app);
  server.listen(config.port, () => {
    console.log(`🚀 API on http://localhost:${config.port}`);
    console.log(`🌍 CORS origin: ${config.clientUrl}`);
  });
  // Cron job to update reservation statuses daily at midnight
  cron.schedule("0 0 * * *", async () => {
    const now = new Date();
    const result = await ReservationModel.updateMany(
      { to: { $lt: now }, status: { $in: ["PENDING", "CONFIRMED"] } },
      { $set: { status: "COMPLETED" } }
    );
    console.log(`✅ Cron ran: ${result.modifiedCount} reservations marked as COMPLETED`);
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

import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import http from "http";
import rateLimit from "express-rate-limit";

import { config } from "./src/config";
import { notFound, errorHandler } from "./src/middlewares/errors";

import authRoutes from "./src/routes/auth";
import meRoutes from "./src/routes/me";
import hotelRoutes from "./src/routes/hotels";
import reservationRoutes from "./src/routes/reservations";

async function start() {
  const app = express();

  // Core middleware
  app.set("trust proxy", true);
  app.use(cors({ origin: config.clientUrl, credentials: true }));
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));

  // Health
  app.get("/health", (_req, res) => {
    res.json({ ok: true, env: config.nodeEnv, time: new Date().toISOString() });
  });

  // Rate-limit sensitive routes
  const authLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use("/api/auth", authLimiter);

  // Routes
  app.use("/api/auth", authRoutes);
  app.use("/api", meRoutes); // /api/me
  app.use("/api/hotels", hotelRoutes);
  app.use("/api/reservations", reservationRoutes);

  // 404 + error handling
  app.use(notFound);
  app.use(errorHandler);

  // DB connect
  await mongoose.connect(config.mongoUri);

  // Listen
  const server = http.createServer(app);
  server.listen(config.port, () => {
    console.log(`🚀 API on http://localhost:${config.port}`);
    console.log(`🌍 CORS origin: ${config.clientUrl}`);
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

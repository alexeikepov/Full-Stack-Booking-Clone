import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import mongoose from "mongoose";
import http from "http";
import { config } from "./src/config";

import hotelRoutes from "./src/routes/hotels";
import reservationRoutes from "./src/routes/reservations";
import { authMiddleware } from "./src/middlewares/auth";

const app = express();

app.set("trust proxy", true);
app.use(cors({ origin: config.clientUrl, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req, res) => {
  res.json({ ok: true, env: config.nodeEnv, time: new Date().toISOString() });
});

app.get("/", (_req, res) => {
  res.json({ message: "Booking API is up" });
});

// Protected routes
app.use("/api/hotels", authMiddleware, hotelRoutes);
app.use("/api/reservations", authMiddleware, reservationRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not Found", path: req.path });
});

// Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("API Error:", err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || "Internal Server Error",
    status,
  });
});

const server = http.createServer(app);

async function start() {
  try {
    await mongoose.connect(config.mongoUri);
    console.log("✅ MongoDB connected");

    server.listen(config.port, () => {
      console.log(`🚀 API running on http://localhost:${config.port}`);
      console.log(`🌍 CORS origin: ${config.clientUrl}`);
    });

    const shutdown = async (signal: string) => {
      console.log(`\n🛑 ${signal} received, shutting down...`);
      server.close(() => console.log("HTTP server closed"));
      await mongoose.connection.close();
      console.log("Mongo connection closed");
      process.exit(0);
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (e) {
    console.error("❌ Failed to start server:", e);
    process.exit(1);
  }
}

start();

export default app;

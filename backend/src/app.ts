import express from "express";
import cors from "cors";
import helmetImport from "helmet";
import rateLimitImport from "express-rate-limit";
import { authRoutes } from "./routes/authRoutes.js";
import { geocodingRoutes } from "./routes/geocodingRoutes.js";
import { kundliRoutes } from "./routes/kundliRoutes.js";
import { shareRoutes } from "./routes/shareRoutes.js";

const helmet = (helmetImport as typeof helmetImport & { default?: typeof helmetImport }).default ?? helmetImport;
const rateLimit =
  (rateLimitImport as typeof rateLimitImport & { default?: typeof rateLimitImport }).default ?? rateLimitImport;

export function getHealthStatus() {
  return {
    status: "ok",
    service: "biodata-backend"
  };
}

// Support comma-separated list of allowed origins via CORS_ORIGIN env var.
// e.g. CORS_ORIGIN=https://rishte.daanyam.in,https://daanyam-rishte.vercel.app
const allowedOrigins = (process.env.CORS_ORIGIN ?? "http://localhost:5173")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) => {
        // Allow server-to-server / curl requests (no origin header)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        callback(new Error(`CORS: origin '${origin}' is not allowed`));
      },
      credentials: true,
    })
  );

  // Photos are still base64 in bioData snapshots (see LAUNCH_RUNBOOK Step 8.1).
  // Bumped from default 100kb to 10mb so share-create + biodata-update don't 413.
  // Revert to 100kb once photos move to R2 (TODO).
  app.use(express.json({ limit: "10mb" }));
  app.use(
    "/api/shares/:token",
    rateLimit({
      windowMs: 60 * 1000,
      max: 60,
      standardHeaders: true,
      legacyHeaders: false,
    })
  );

  // Phone-OTP send is the most abused auth endpoint — limit per IP.
  // 6 sends/IP/10min is generous for real users, painful for scripts.
  app.use(
    "/api/auth/send-otp",
    rateLimit({
      windowMs: 10 * 60 * 1000,
      max: 6,
      standardHeaders: true,
      legacyHeaders: false,
    })
  );
  app.use(
    "/api/auth/verify-otp",
    rateLimit({
      windowMs: 10 * 60 * 1000,
      max: 20,
      standardHeaders: true,
      legacyHeaders: false,
    })
  );

  app.get("/api/health", (_req, res) => {
    res.status(200).json(getHealthStatus());
  });
  app.use("/api/auth", authRoutes);
  app.use("/api/geocoding", geocodingRoutes);
  app.use("/api/kundli", kundliRoutes);
  app.use("/api/shares", shareRoutes);

  return app;
}

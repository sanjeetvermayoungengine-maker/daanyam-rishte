import express from "express";
import cors from "cors";
import helmetImport from "helmet";
import rateLimitImport from "express-rate-limit";
import { authRoutes } from "./routes/authRoutes.js";
import { geocodingRoutes } from "./routes/geocodingRoutes.js";
import { kundliRoutes } from "./routes/kundliRoutes.js";
import { shareRoutes } from "./routes/shareRoutes.js";
import { createCorsOriginChecker, parseAllowedOrigins, parseOriginSuffixes } from "./corsOrigin.js";

const helmet = (helmetImport as typeof helmetImport & { default?: typeof helmetImport }).default ?? helmetImport;
const rateLimit =
  (rateLimitImport as typeof rateLimitImport & { default?: typeof rateLimitImport }).default ?? rateLimitImport;

export function getHealthStatus() {
  return {
    status: "ok",
    service: "biodata-backend"
  };
}

// Exact origins: CORS_ORIGIN=https://rishte.daanyam.in,https://rishte-preview.daanyam.in
// Suffixes (preview only): CORS_ORIGIN_SUFFIXES=.vercel.app
const allowedOrigins = parseAllowedOrigins(process.env.CORS_ORIGIN);
const allowedOriginSuffixes = parseOriginSuffixes(process.env.CORS_ORIGIN_SUFFIXES);
const checkCorsOrigin = createCorsOriginChecker(allowedOrigins, allowedOriginSuffixes);

export function createApp() {
  const app = express();

  // Cloud Run / Vercel sit behind a reverse proxy — required for express-rate-limit.
  app.set("trust proxy", 1);

  app.use(helmet());
  app.use(
    cors({
      origin: checkCorsOrigin,
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

  app.use(
    "/api/geocoding",
    rateLimit({ windowMs: 60_000, max: 30, standardHeaders: true, legacyHeaders: false })
  );
  app.use(
    "/api/kundli",
    rateLimit({ windowMs: 60_000, max: 10, standardHeaders: true, legacyHeaders: false })
  );
  app.use(
    "/api/shares",
    rateLimit({
      windowMs: 60_000,
      max: 6,
      standardHeaders: true,
      legacyHeaders: false,
      skip: (req) => req.method !== "POST" || req.path !== "/",
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

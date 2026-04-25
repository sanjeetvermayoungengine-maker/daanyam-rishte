import express from "express";
import cors from "cors";

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

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow server-to-server / curl requests (no origin header)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        callback(new Error(`CORS: origin '${origin}' is not allowed`));
      },
      credentials: true,
    })
  );

  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.status(200).json(getHealthStatus());
  });

  return app;
}

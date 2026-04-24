import express from "express";
export function getHealthStatus() {
    return {
        status: "ok",
        service: "biodata-backend"
    };
}
export function createApp() {
    const app = express();
    app.use(express.json());
    app.get("/api/health", (_req, res) => {
        res.status(200).json(getHealthStatus());
    });
    return app;
}

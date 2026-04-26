import { Router } from "express";
import { GeocodingServiceError, searchBirthPlaces } from "../services/geocodingService.js";

export const geocodingRoutes = Router();

geocodingRoutes.get("/places", async (req, res) => {
  try {
    const query = typeof req.query.q === "string" ? req.query.q : "";
    const matches = await searchBirthPlaces(query);
    res.status(200).json({ matches });
  } catch (error) {
    if (error instanceof GeocodingServiceError) {
      res.status(error.statusCode).json({ error: error.message, matches: [] });
      return;
    }

    res.status(500).json({
      error: "Something went wrong while searching for birthplaces.",
      matches: []
    });
  }
});

import { Router } from "express";
import { AstroEngineClientError } from "../services/astroEngineClient.js";
import { generateKundli, KundliGenerationError } from "../services/kundliService.js";
import type { KundliGenerationRequest } from "../types/horoscope.js";

export const kundliRoutes = Router();

kundliRoutes.post("/generate", async (req, res) => {
  try {
    const input = req.body as Partial<KundliGenerationRequest>;
    const kundli = await generateKundli(input.birthDetails ?? {
      dob: "",
      birthTime: "",
      birthPlace: ""
    });

    res.status(200).json({ kundli });
  } catch (error) {
    if (error instanceof KundliGenerationError) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }

    if (error instanceof AstroEngineClientError) {
      res.status(error.statusCode).json({
        error: error.statusCode === 502
          ? "Kundli generation is temporarily unavailable because the astro engine rejected the request."
          : "Kundli generation is temporarily unavailable. Please try again in a moment."
      });
      return;
    }

    res.status(500).json({ error: "Something went wrong while generating the kundli." });
  }
});

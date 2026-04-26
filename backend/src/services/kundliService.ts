import { getAstroEngineAdapter, type AstroEngineAdapter } from "./astroEngineAdapter.js";
import type {
  AstroDashaPeriod,
  AstroEngineChartRequest,
  AstroEngineChartResponse,
  BirthDetailsInput,
  ComputedKundliResult,
} from "../types/horoscope.js";

const DEFAULT_TIMEZONE = process.env.ASTRO_ENGINE_DEFAULT_TIMEZONE ?? "Asia/Kolkata";

export class KundliGenerationError extends Error {
  constructor(message: string, readonly statusCode: number) {
    super(message);
    this.name = "KundliGenerationError";
  }
}

function parseCoordinate(value: string | null | undefined, label: string) {
  if (!value?.trim()) {
    return null;
  }

  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new KundliGenerationError(`${label} must be a valid number.`, 400);
  }

  return parsed;
}

function resolveGeo(input: BirthDetailsInput) {
  if (input.birthLocation) {
    if (!Number.isFinite(input.birthLocation.latitude) || !Number.isFinite(input.birthLocation.longitude)) {
      throw new KundliGenerationError("Selected birthplace coordinates are invalid.", 400);
    }

    return {
      latitude_deg: input.birthLocation.latitude,
      longitude_deg: input.birthLocation.longitude,
      elevation_m: 0
    };
  }

  const latitude = parseCoordinate(input.birthLatitude, "Birth latitude");
  const longitude = parseCoordinate(input.birthLongitude, "Birth longitude");

  if ((latitude === null) !== (longitude === null)) {
    throw new KundliGenerationError(
      "Provide both latitude and longitude together for a manual birth location override.",
      400
    );
  }

  if (latitude !== null && longitude !== null) {
    return {
      latitude_deg: latitude,
      longitude_deg: longitude,
      elevation_m: 0
    };
  }
  throw new KundliGenerationError(
    "Select a resolved birthplace before generating the kundli.",
    422
  );
}

export function mapBirthDetailsToChartRequest(input: BirthDetailsInput): AstroEngineChartRequest {
  if (!input.dob) {
    throw new KundliGenerationError("Birth date is required.", 400);
  }

  if (!input.birthTime) {
    throw new KundliGenerationError("Birth time is required.", 400);
  }

  if (!input.birthPlace.trim()) {
    throw new KundliGenerationError("Birth place is required.", 400);
  }

  const timezone = input.birthTimezone?.trim() || DEFAULT_TIMEZONE;
  const localDateTime = `${input.dob}T${input.birthTime.length === 5 ? `${input.birthTime}:00` : input.birthTime}`;

  return {
    datetime: {
      kind: "local",
      local: localDateTime,
      timezone
    },
    geo: resolveGeo(input),
    ayanamsa: "lahiri",
    projection: "sidereal_only",
    compact: false
  };
}

function formatDashaPeriod(label: string, period: AstroDashaPeriod | undefined) {
  if (!period?.lord) {
    return null;
  }

  const range = [period.start?.slice(0, 10), period.end?.slice(0, 10)].filter(Boolean).join(" to ");
  return range ? `${label}: ${period.lord} (${range})` : `${label}: ${period.lord}`;
}

export function mapChartResponseToComputedKundli(response: AstroEngineChartResponse): ComputedKundliResult {
  const dashaSummary = [
    formatDashaPeriod("Maha", response.data?.dasha?.current?.maha),
    formatDashaPeriod("Antar", response.data?.dasha?.current?.antar),
    formatDashaPeriod("Pratyantar", response.data?.dasha?.current?.pratyantar)
  ].filter(Boolean).join(" | ");

  return {
    rashi: response.data?.summary?.moon_rashi ?? "",
    nakshatra: response.data?.moon_nakshatra ?? "",
    pada: response.data?.moon_pada ?? null,
    lagna: response.data?.summary?.lagna_rashi ?? response.data?.lagna?.rashi ?? "",
    dashaSummary: dashaSummary || null,
    generatedAt: new Date().toISOString(),
    source: "astro_engine",
    engine: {
      apiVersion: response.metadata?.version ?? null,
      engineSemanticVersion: response.metadata?.engine_semantic_version ?? null,
      schemaVersion: response.data?.schema_version ?? null,
      ayanamsa: response.metadata?.ayanamsa_used ?? null,
      houseSystem: response.metadata?.house_system ?? null
    },
    rawEngineResponse: response
  };
}

export async function generateKundli(input: BirthDetailsInput) {
  const request = mapBirthDetailsToChartRequest(input);
  const response = await getAstroEngineAdapter().generateChart(request);
  return mapChartResponseToComputedKundli(response);
}

export async function generateKundliWithAdapter(
  input: BirthDetailsInput,
  adapter: AstroEngineAdapter
) {
  const request = mapBirthDetailsToChartRequest(input);
  const response = await adapter.generateChart(request);
  return mapChartResponseToComputedKundli(response);
}

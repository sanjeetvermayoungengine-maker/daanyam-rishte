import type { GeocodingProvider } from "../types/geocoding.js";
import type { ResolvedBirthPlace } from "../types/horoscope.js";

const DEFAULT_BASE_URL = "https://nominatim.openstreetmap.org";
const DEFAULT_TIMEOUT_MS = 5000;
const DEFAULT_LIMIT = 5;

interface NominatimResult {
  lat?: string;
  lon?: string;
  display_name?: string;
  importance?: number;
  address?: {
    country?: string;
    state?: string;
    region?: string;
    state_district?: string;
    county?: string;
  };
}

export class GeocodingServiceError extends Error {
  constructor(
    message: string,
    readonly statusCode: number,
    readonly code:
      | "config_error"
      | "bad_request"
      | "network_error"
      | "upstream_error"
      | "bad_response"
  ) {
    super(message);
    this.name = "GeocodingServiceError";
  }
}

function clampConfidence(value: unknown) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return null;
  }

  if (value < 0) {
    return 0;
  }

  if (value > 1) {
    return 1;
  }

  return Number(value.toFixed(3));
}

function parseCoordinate(value: string | undefined, label: string) {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new GeocodingServiceError(`Geocoding provider returned an invalid ${label}.`, 502, "bad_response");
  }

  return parsed;
}

export function normalizeNominatimResult(result: NominatimResult): ResolvedBirthPlace {
  if (!result.display_name?.trim()) {
    throw new GeocodingServiceError("Geocoding provider returned a result without a display name.", 502, "bad_response");
  }

  return {
    displayName: result.display_name,
    latitude: parseCoordinate(result.lat, "latitude"),
    longitude: parseCoordinate(result.lon, "longitude"),
    country: result.address?.country?.trim() ?? "",
    region: result.address?.state_district?.trim() ?? result.address?.county?.trim() ?? null,
    state: result.address?.state?.trim() ?? result.address?.region?.trim() ?? null,
    confidence: clampConfidence(result.importance)
  };
}

function normalizeNominatimBaseUrl(value: string | undefined) {
  return (value?.trim() || DEFAULT_BASE_URL).replace(/\/+$/, "");
}

function resolveTimeoutMs(value: string | undefined) {
  if (!value?.trim()) {
    return DEFAULT_TIMEOUT_MS;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new GeocodingServiceError("GEOCODING_TIMEOUT_MS must be a positive number.", 500, "config_error");
  }

  return parsed;
}

function resolveMaxResults(value: string | undefined) {
  if (!value?.trim()) {
    return DEFAULT_LIMIT;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new GeocodingServiceError("GEOCODING_MAX_RESULTS must be a positive integer.", 500, "config_error");
  }

  return parsed;
}

function createNominatimProvider(): GeocodingProvider {
  const baseUrl = normalizeNominatimBaseUrl(process.env.GEOCODING_BASE_URL);
  const configuredTimeoutMs = resolveTimeoutMs(process.env.GEOCODING_TIMEOUT_MS);
  const configuredLimit = resolveMaxResults(process.env.GEOCODING_MAX_RESULTS);
  const userAgent = process.env.GEOCODING_USER_AGENT?.trim() || "DaanyamRishte/1.0";
  const email = process.env.GEOCODING_CONTACT_EMAIL?.trim();

  return {
    async searchLocations(query, options) {
      const fetchImpl = options?.fetchImpl ?? fetch;
      const limit = Math.min(options?.limit ?? configuredLimit, configuredLimit);
      const timeoutMs = options?.timeoutMs ?? configuredTimeoutMs;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const params = new URLSearchParams({
          q: query,
          format: "jsonv2",
          addressdetails: "1",
          limit: String(limit)
        });

        if (email) {
          params.set("email", email);
        }

        const response = await fetchImpl(`${baseUrl}/search?${params.toString()}`, {
          headers: {
            accept: "application/json",
            "user-agent": userAgent
          },
          signal: controller.signal
        });

        if (!response.ok) {
          throw new GeocodingServiceError("Geocoding provider request failed.", 503, "upstream_error");
        }

        const body = await response.json();
        if (!Array.isArray(body)) {
          throw new GeocodingServiceError("Geocoding provider returned an unexpected response.", 502, "bad_response");
        }

        return body.map((entry) => normalizeNominatimResult(entry as NominatimResult));
      } catch (error) {
        if (error instanceof GeocodingServiceError) {
          throw error;
        }

        throw new GeocodingServiceError("Unable to reach the geocoding service right now.", 503, "network_error");
      } finally {
        clearTimeout(timeout);
      }
    }
  };
}

export function createGeocodingProvider(): GeocodingProvider {
  const provider = (process.env.GEOCODING_PROVIDER ?? "nominatim").trim().toLowerCase();

  if (provider === "nominatim") {
    return createNominatimProvider();
  }

  throw new GeocodingServiceError(
    `Unsupported geocoding provider "${provider}".`,
    500,
    "config_error"
  );
}

const geocodingProvider = createGeocodingProvider();

export async function searchBirthPlaces(
  query: string,
  options?: {
    limit?: number;
    fetchImpl?: typeof fetch;
    timeoutMs?: number;
    provider?: GeocodingProvider;
  }
) {
  const normalizedQuery = query.trim();
  if (normalizedQuery.length < 2) {
    throw new GeocodingServiceError("Enter at least 2 characters to search for a birthplace.", 400, "bad_request");
  }

  const provider = options?.provider ?? geocodingProvider;
  return provider.searchLocations(normalizedQuery, {
    limit: options?.limit,
    fetchImpl: options?.fetchImpl,
    timeoutMs: options?.timeoutMs
  });
}

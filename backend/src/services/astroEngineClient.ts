import type { AstroEngineChartRequest, AstroEngineChartResponse } from "../types/horoscope.js";

const DEFAULT_TIMEOUT_MS = 12000;

export class AstroEngineClientError extends Error {
  constructor(
    message: string,
    readonly statusCode: number,
    readonly code:
      | "config_error"
      | "network_error"
      | "unauthorized"
      | "bad_response"
      | "upstream_error"
  ) {
    super(message);
    this.name = "AstroEngineClientError";
  }
}

export function normalizeAstroEngineBaseUrl(value: string | undefined) {
  const baseUrl = value?.trim();

  if (!baseUrl) {
    throw new AstroEngineClientError(
      "Astro engine URL is not configured.",
      500,
      "config_error"
    );
  }

  return baseUrl.replace(/\/+$/, "");
}

export function isAstroEngineChartResponse(value: unknown): value is AstroEngineChartResponse {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as AstroEngineChartResponse;
  return typeof candidate.data?.moon_nakshatra === "string"
    && typeof candidate.data?.lagna?.rashi === "string"
    && typeof candidate.data?.summary?.moon_rashi === "string";
}

export async function postSiderealChart(
  payload: AstroEngineChartRequest,
  options?: {
    baseUrl?: string;
    apiKey?: string;
    timeoutMs?: number;
    fetchImpl?: typeof fetch;
  }
) {
  const fetchImpl = options?.fetchImpl ?? fetch;
  const controller = new AbortController();
  const timeoutMs = options?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const baseUrl = normalizeAstroEngineBaseUrl(options?.baseUrl ?? process.env.ASTRO_ENGINE_URL);
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetchImpl(`${baseUrl}/chart/sidereal`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(options?.apiKey ?? process.env.ASTRO_ENGINE_SERVICE_KEY
          ? { "x-api-key": options?.apiKey ?? process.env.ASTRO_ENGINE_SERVICE_KEY ?? "" }
          : {})
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    if (!response.ok) {
      let upstreamMessage = "Astro engine request failed.";

      try {
        const body = await response.json() as { error?: string };
        if (typeof body.error === "string" && body.error.trim()) {
          upstreamMessage = body.error;
        }
      } catch {
        // Ignore JSON parsing failures for non-JSON upstream errors.
      }

      throw new AstroEngineClientError(
        response.status === 401
          ? "Astro engine authentication failed."
          : `Astro engine request failed: ${upstreamMessage}`,
        response.status === 401 ? 502 : 503,
        response.status === 401 ? "unauthorized" : "upstream_error"
      );
    }

    const responseJson = await response.json();
    if (!isAstroEngineChartResponse(responseJson)) {
      throw new AstroEngineClientError(
        "Astro engine returned an unexpected chart payload.",
        502,
        "bad_response"
      );
    }

    return responseJson;
  } catch (error) {
    if (error instanceof AstroEngineClientError) {
      throw error;
    }

    throw new AstroEngineClientError(
      "Unable to reach the astro engine right now.",
      503,
      "network_error"
    );
  } finally {
    clearTimeout(timeout);
  }
}

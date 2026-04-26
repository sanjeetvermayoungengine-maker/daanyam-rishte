import type { ResolvedBirthPlace } from "./horoscope.js";

export interface GeocodingSearchResponse {
  matches: ResolvedBirthPlace[];
}

export interface GeocodingProvider {
  searchLocations(
    query: string,
    options?: {
      limit?: number;
      fetchImpl?: typeof fetch;
      timeoutMs?: number;
    }
  ): Promise<ResolvedBirthPlace[]>;
}

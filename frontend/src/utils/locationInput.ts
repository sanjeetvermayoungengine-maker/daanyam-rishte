import type { ResolvedBirthPlace } from "../store/bioDataSlice";

function clampCoordinate(value: number, min: number, max: number) {
  return Number.isFinite(value) && value >= min && value <= max;
}

function parseCoordinatePair(latitudeRaw: string, longitudeRaw: string) {
  const latitude = Number(latitudeRaw);
  const longitude = Number(longitudeRaw);

  if (!clampCoordinate(latitude, -90, 90) || !clampCoordinate(longitude, -180, 180)) {
    return null;
  }

  return {
    latitude,
    longitude
  };
}

function parseCoordinatesFromText(input: string) {
  const patterns = [
    /@(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/i,
    /[?&](?:q|query|ll)=(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/i,
    /!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/i,
    /\b(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\b/
  ];

  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (!match) {
      continue;
    }

    const parsed = parseCoordinatePair(match[1], match[2]);
    if (parsed) {
      return parsed;
    }
  }

  return null;
}

export function tryResolveSharedLocation(input: string): ResolvedBirthPlace | null {
  const trimmed = input.trim();
  if (!trimmed) {
    return null;
  }

  const parsed = parseCoordinatesFromText(trimmed);
  if (!parsed) {
    return null;
  }

  return {
    displayName: trimmed.startsWith("http")
      ? "Shared map location"
      : `Pinned location (${parsed.latitude.toFixed(4)}, ${parsed.longitude.toFixed(4)})`,
    latitude: parsed.latitude,
    longitude: parsed.longitude,
    country: "",
    region: null,
    state: null,
    confidence: 1
  };
}

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function tokenizeDisplayName(displayName: string) {
  return displayName
    .split(",")
    .map((part) => normalizeText(part))
    .filter(Boolean);
}

export function findClearBirthPlaceMatch(
  query: string,
  matches: ResolvedBirthPlace[]
): ResolvedBirthPlace | null {
  if (matches.length === 0) {
    return null;
  }

  if (matches.length === 1) {
    return matches[0];
  }

  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) {
    return null;
  }

  return matches.find((match) => tokenizeDisplayName(match.displayName).includes(normalizedQuery)) ?? null;
}

export type KundliComputationStatus = "idle" | "loading" | "ready" | "error";

export interface ResolvedBirthPlace {
  displayName: string;
  latitude: number;
  longitude: number;
  country: string;
  region: string | null;
  state: string | null;
  confidence: number | null;
}

export interface BirthDetailsInput {
  dob: string;
  birthTime: string;
  birthPlace: string;
  selectedBirthPlaceLabel?: string | null;
  birthLatitude?: string | null;
  birthLongitude?: string | null;
  birthTimezone?: string | null;
  birthLocation?: ResolvedBirthPlace | null;
}

export interface KundliGenerationRequest {
  birthDetails: BirthDetailsInput;
}

export interface ComputedKundliResult {
  rashi: string;
  nakshatra: string;
  pada: number | null;
  lagna: string;
  dashaSummary: string | null;
  generatedAt: string;
  source: "astro_engine";
  engine: {
    apiVersion: string | null;
    engineSemanticVersion: string | null;
    schemaVersion: string | null;
    ayanamsa: string | null;
    houseSystem: string | null;
  };
  rawEngineResponse: AstroEngineChartResponse | null;
}

export interface KundliComputationState {
  status: KundliComputationStatus;
  error: string | null;
  result: ComputedKundliResult | null;
}

export interface HoroscopeSnapshot {
  dob: string;
  birthTime: string;
  birthPlace: string;
  selectedBirthPlaceLabel: string;
  birthLatitude: string;
  birthLongitude: string;
  birthTimezone: string;
  birthLocation: ResolvedBirthPlace | null;
  gotra: string;
  marsDosha: string;
  computedKundli: KundliComputationState;
}

export interface AstroEngineChartRequest {
  datetime: {
    kind: "local";
    local: string;
    timezone: string;
  };
  geo: {
    latitude_deg: number;
    longitude_deg: number;
    elevation_m?: number;
  };
  ayanamsa: "lahiri";
  projection: "sidereal_only";
  compact: false;
}

export interface AstroEngineChartResponse {
  data?: {
    schema_version?: string;
    summary?: {
      moon_rashi?: string;
      lagna_rashi?: string;
    };
    lagna?: {
      rashi?: string;
      sidereal_longitude_deg?: number;
    };
    moon_nakshatra?: string;
    moon_pada?: number;
    dasha?: {
      as_of_utc?: string;
      birth_nakshatra?: string;
      birth_pada?: number;
      current?: {
        maha?: AstroDashaPeriod;
        antar?: AstroDashaPeriod;
        pratyantar?: AstroDashaPeriod;
      };
    } | null;
  };
  metadata?: {
    version?: string;
    engine_semantic_version?: string;
    ayanamsa_used?: string;
    house_system?: string;
  };
}

export interface AstroDashaPeriod {
  lord?: string;
  start?: string;
  end?: string;
}

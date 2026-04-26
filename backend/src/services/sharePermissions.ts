import type { BioDataSnapshot, SharePermissions, ShareRecord } from "../types/share.js";

export type HoroscopeAccessLevel = "none" | "summary" | "detailed";

export function normalizeSharePermissions(input?: Partial<SharePermissions> | null): SharePermissions {
  const legacyHoroscopeAccess = input?.viewHoroscope === true;
  const detailed = input?.viewDetailedKundli ?? legacyHoroscopeAccess ?? false;
  const birthDetails = input?.viewHoroscopeBirthDetails ?? detailed;
  const dasha = input?.viewHoroscopeDasha ?? detailed;
  const summary = (input?.viewHoroscopeSummary ?? false) || birthDetails || dasha || detailed;

  return {
    viewBasic: input?.viewBasic ?? false,
    viewPhotos: input?.viewPhotos ?? false,
    viewHoroscopeSummary: summary || detailed,
    viewHoroscopeBirthDetails: birthDetails || detailed,
    viewHoroscopeDasha: dasha || detailed,
    viewDetailedKundli: detailed,
    viewContact: input?.viewContact ?? false,
    viewHoroscope: summary || detailed,
  };
}

export function getHoroscopeAccessLevel(permissions: Partial<SharePermissions> | null | undefined): HoroscopeAccessLevel {
  const normalized = normalizeSharePermissions(permissions);

  if (normalized.viewDetailedKundli) {
    return "detailed";
  }

  if (normalized.viewHoroscopeSummary) {
    return "summary";
  }

  return "none";
}

export function normalizeShareRecord(record: ShareRecord): ShareRecord {
  return {
    ...record,
    permissions: normalizeSharePermissions(record.permissions),
  };
}

function createHiddenHoroscope(): BioDataSnapshot["horoscope"] {
  return {
    dob: "",
    birthTime: "",
    birthPlace: "",
    selectedBirthPlaceLabel: "",
    birthLatitude: "",
    birthLongitude: "",
    birthTimezone: "",
    birthLocation: null,
    gotra: "",
    marsDosha: "",
    computedKundli: {
      status: "idle",
      error: null,
      result: null,
    },
  };
}

function createHiddenPersonalDetails(
  personalDetails: BioDataSnapshot["personalDetails"]
): BioDataSnapshot["personalDetails"] {
  return Object.keys(personalDetails).reduce<BioDataSnapshot["personalDetails"]>((accumulator, key) => {
    accumulator[key] = "";
    return accumulator;
  }, { ...personalDetails });
}

function createHiddenFamily(source: BioDataSnapshot["family"]): BioDataSnapshot["family"] {
  return {
    ...source,
    fatherName: "",
    motherName: "",
    fatherOccupation: "",
    motherOccupation: "",
    siblings: [],
    familyType: "",
    location: "",
  };
}

function withBirthDetails(
  target: BioDataSnapshot["horoscope"],
  source: BioDataSnapshot["horoscope"],
  enabled: boolean
) {
  if (!enabled) {
    return;
  }

  target.dob = source.dob;
  target.birthTime = source.birthTime;
  target.birthPlace = source.birthPlace;
  target.selectedBirthPlaceLabel = source.selectedBirthPlaceLabel;
  target.birthLatitude = source.birthLatitude;
  target.birthLongitude = source.birthLongitude;
  target.birthTimezone = source.birthTimezone;
  target.birthLocation = source.birthLocation;
}

function sanitizeHoroscopeForAccess(
  horoscope: BioDataSnapshot["horoscope"],
  permissions: SharePermissions
): BioDataSnapshot["horoscope"] {
  const accessLevel = getHoroscopeAccessLevel(permissions);

  if (accessLevel === "none") {
    return createHiddenHoroscope();
  }

  const sanitized = createHiddenHoroscope();
  sanitized.gotra = horoscope.gotra;
  sanitized.marsDosha = horoscope.marsDosha;
  withBirthDetails(sanitized, horoscope, permissions.viewHoroscopeBirthDetails);

  if (accessLevel === "summary") {
    return {
      ...sanitized,
      computedKundli: horoscope.computedKundli.result
        ? {
            status: horoscope.computedKundli.status,
            error: horoscope.computedKundli.error,
            result: {
              rashi: horoscope.computedKundli.result.rashi,
              nakshatra: horoscope.computedKundli.result.nakshatra,
              pada: null,
              lagna: "",
              dashaSummary: permissions.viewHoroscopeDasha ? horoscope.computedKundli.result.dashaSummary : null,
              generatedAt: horoscope.computedKundli.result.generatedAt,
              source: horoscope.computedKundli.result.source,
              engine: {
                apiVersion: horoscope.computedKundli.result.engine.apiVersion,
                engineSemanticVersion: horoscope.computedKundli.result.engine.engineSemanticVersion,
                schemaVersion: horoscope.computedKundli.result.engine.schemaVersion,
                ayanamsa: horoscope.computedKundli.result.engine.ayanamsa,
                houseSystem: horoscope.computedKundli.result.engine.houseSystem,
              },
              rawEngineResponse: null,
            },
          }
        : {
            status: horoscope.computedKundli.status,
            error: horoscope.computedKundli.error,
            result: null,
          },
    };
  }

  return {
    ...(JSON.parse(JSON.stringify(horoscope)) as BioDataSnapshot["horoscope"]),
    ...(!permissions.viewHoroscopeBirthDetails
      ? {
          dob: "",
          birthTime: "",
          birthPlace: "",
          selectedBirthPlaceLabel: "",
          birthLatitude: "",
          birthLongitude: "",
          birthTimezone: "",
          birthLocation: null,
        }
      : {}),
  };
}

export function sanitizeBioDataForPublicView(
  source: BioDataSnapshot,
  permissions: Partial<SharePermissions> | null | undefined
): BioDataSnapshot {
  const normalizedPermissions = normalizeSharePermissions(permissions);
  const sanitized: BioDataSnapshot = JSON.parse(JSON.stringify(source));

  if (!normalizedPermissions.viewBasic) {
    sanitized.personalDetails = createHiddenPersonalDetails(sanitized.personalDetails);
    sanitized.family = createHiddenFamily(sanitized.family);
  }

  if (!normalizedPermissions.viewPhotos) {
    sanitized.photos = {
      items: [],
      primaryPhotoId: null,
    };
  }

  sanitized.horoscope = sanitizeHoroscopeForAccess(
    sanitized.horoscope,
    normalizedPermissions
  );

  if (!normalizedPermissions.viewContact) {
    sanitized.personalDetails.phone = "";
    sanitized.personalDetails.email = "";
  }

  return sanitized;
}

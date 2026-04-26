import type { HoroscopeDetails, SharePermissions, ShareRecord } from "../store/bioDataSlice";
import { getBirthPlaceLabel, getHoroscopeField } from "./horoscope";

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

export function normalizeShareRecord(record: ShareRecord): ShareRecord {
  return {
    ...record,
    permissions: normalizeSharePermissions(record.permissions),
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

export function setHoroscopeAccessLevel(
  permissions: SharePermissions,
  accessLevel: HoroscopeAccessLevel
): SharePermissions {
  return normalizeSharePermissions({
    ...permissions,
    viewHoroscopeSummary: accessLevel !== "none",
    viewDetailedKundli: accessLevel === "detailed",
  });
}

export function getHoroscopeAccessLabel(accessLevel: HoroscopeAccessLevel) {
  if (accessLevel === "detailed") {
    return "Full kundli";
  }

  if (accessLevel === "summary") {
    return "Summary only";
  }

  return "Hidden";
}

export function describeHoroscopeSharing(permissions: Partial<SharePermissions> | null | undefined) {
  const normalized = normalizeSharePermissions(permissions);
  const extras = [
    normalized.viewHoroscopeBirthDetails ? "birth details" : null,
    normalized.viewHoroscopeDasha ? "dasha" : null,
  ].filter(Boolean);

  if (normalized.viewDetailedKundli) {
    return "Full kundli";
  }

  if (!normalized.viewHoroscopeSummary) {
    return "Hidden";
  }

  return extras.length ? `Summary + ${extras.join(" + ")}` : "Summary only";
}

export function getHoroscopeFieldsForAccess(
  horoscope: HoroscopeDetails,
  accessLevel: HoroscopeAccessLevel
): Array<{ label: string; value: string }> {
  if (accessLevel === "none") {
    return [];
  }

  if (accessLevel === "summary") {
    return [
      { label: "Rashi", value: getHoroscopeField(horoscope, "rashi") },
      { label: "Nakshatra", value: getHoroscopeField(horoscope, "nakshatra") },
      { label: "Gotra", value: horoscope.gotra },
      { label: "Mars Dosha", value: horoscope.marsDosha },
      { label: "Dasha", value: getHoroscopeField(horoscope, "dashaSummary") },
      { label: "Birth Time", value: horoscope.birthTime },
      { label: "Birth Place", value: getBirthPlaceLabel(horoscope) },
    ].filter((field) => field.value);
  }

  return [
    { label: "Rashi", value: getHoroscopeField(horoscope, "rashi") },
    { label: "Nakshatra", value: getHoroscopeField(horoscope, "nakshatra") },
    { label: "Lagna", value: getHoroscopeField(horoscope, "lagna") },
    { label: "Pada", value: getHoroscopeField(horoscope, "pada") },
    { label: "Gotra", value: horoscope.gotra },
    { label: "Mars Dosha", value: horoscope.marsDosha },
    { label: "Birth Time", value: horoscope.birthTime },
    { label: "Birth Place", value: getBirthPlaceLabel(horoscope) },
    { label: "Dasha", value: getHoroscopeField(horoscope, "dashaSummary") },
  ].filter((field) => field.value);
}

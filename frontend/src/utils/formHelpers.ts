import { differenceInYears, format, parseISO } from "date-fns";
import type { BioDataState, BioPhoto } from "../store/bioDataSlice";

export const stepRoutes = [
  "/biodata/personal",
  "/biodata/photos",
  "/biodata/family",
  "/biodata/horoscope",
  "/biodata/template",
  "/biodata/review"
];

export function formatDisplayDate(value: string) {
  if (!value) {
    return "Not provided";
  }

  try {
    return format(parseISO(value), "dd MMM yyyy");
  } catch {
    return value;
  }
}

export function getAgeFromDob(value: string) {
  if (!value) {
    return null;
  }

  try {
    return differenceInYears(new Date(), parseISO(value));
  } catch {
    return null;
  }
}

export function getPrimaryPhoto(state: BioDataState): BioPhoto | undefined {
  return (
    state.photos.items.find((photo) => photo.id === state.photos.primaryPhotoId) ??
    state.photos.items[0]
  );
}

export function getPublicShareUrl(token: string) {
  if (typeof window === "undefined") {
    return `/share/${token}`;
  }

  return `${window.location.origin}/share/${token}`;
}

export function hasStartedBioData(state: BioDataState) {
  return Boolean(
    state.submittedAt ||
      state.personalDetails.fullName ||
      state.personalDetails.phone ||
      state.family.fatherName ||
      state.photos.items.length
  );
}

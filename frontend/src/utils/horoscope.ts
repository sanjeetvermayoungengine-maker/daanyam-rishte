import type { HoroscopeDetails } from "../store/bioDataSlice";

export function getComputedKundli(horoscope: HoroscopeDetails) {
  return horoscope.computedKundli.result;
}

export function getBirthPlaceLabel(horoscope: HoroscopeDetails) {
  return horoscope.selectedBirthPlaceLabel || horoscope.birthPlace;
}

export function hasResolvedBirthPlace(horoscope: HoroscopeDetails) {
  if (horoscope.birthLocation) {
    return Number.isFinite(horoscope.birthLocation.latitude) && Number.isFinite(horoscope.birthLocation.longitude);
  }

  if (!horoscope.birthLatitude.trim() || !horoscope.birthLongitude.trim()) {
    return false;
  }

  return !Number.isNaN(Number(horoscope.birthLatitude)) && !Number.isNaN(Number(horoscope.birthLongitude));
}

export function getHoroscopeField(
  horoscope: HoroscopeDetails,
  field: "rashi" | "nakshatra" | "lagna" | "pada" | "dashaSummary"
) {
  const computed = getComputedKundli(horoscope);

  if (!computed) {
    return "";
  }

  if (field === "pada") {
    return computed.pada ? String(computed.pada) : "";
  }

  return computed[field] ?? "";
}

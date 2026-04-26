import { api } from "./api";
import type { ComputedKundliResult, HoroscopeDetails } from "../store/bioDataSlice";

export async function generateKundliApi(
  horoscope: Pick<
    HoroscopeDetails,
    | "dob"
    | "birthTime"
    | "birthPlace"
    | "selectedBirthPlaceLabel"
    | "birthLatitude"
    | "birthLongitude"
    | "birthTimezone"
    | "birthLocation"
  >
) {
  const response = await api.post<{ kundli: ComputedKundliResult }>("/api/kundli/generate", {
    birthDetails: horoscope
  });

  return response.data.kundli;
}

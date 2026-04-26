import { api } from "./api";
import type { ResolvedBirthPlace } from "../store/bioDataSlice";

export async function searchBirthPlacesApi(query: string) {
  const response = await api.get<{ matches: ResolvedBirthPlace[] }>("/api/geocoding/places", {
    params: { q: query }
  });

  return response.data.matches;
}

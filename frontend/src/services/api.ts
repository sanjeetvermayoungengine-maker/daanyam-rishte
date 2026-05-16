import axios from "axios";
import { supabase } from "./supabase";

const defaultApiUrl = "http://localhost:3000";
const parsedTimeout = Number(import.meta.env.VITE_API_TIMEOUT);
const apiTimeoutMs = Number.isFinite(parsedTimeout) && parsedTimeout > 0 ? parsedTimeout : 30_000;

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? defaultApiUrl,
  timeout: apiTimeoutMs,
});

function isAuthRoute(url: string | undefined): boolean {
  return typeof url === "string" && url.includes("/api/auth/");
}

api.interceptors.request.use(async (config) => {
  if (!supabase || isAuthRoute(config.url)) {
    return config;
  }

  const { data } = await supabase.auth.getSession();
  const accessToken = data.session?.access_token;
  if (accessToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

import axios from "axios";
import { supabase } from "./supabase";

const defaultApiUrl = "http://localhost:3000";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? defaultApiUrl,
  timeout: 8000
});

api.interceptors.request.use(async (config) => {
  if (!supabase) {
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

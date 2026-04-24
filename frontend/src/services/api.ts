import axios from "axios";

const defaultApiUrl = "http://localhost:3000";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? defaultApiUrl,
  timeout: 8000
});

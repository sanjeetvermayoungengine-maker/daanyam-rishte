import { Pool } from "pg";

let pool: Pool | null = null;

export function getShareStorageMode() {
  return process.env.DATABASE_URL ? "postgres" : "memory";
}

export function getDbPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return null;
  }

  if (!pool) {
    pool = new Pool({ connectionString });
  }

  return pool;
}

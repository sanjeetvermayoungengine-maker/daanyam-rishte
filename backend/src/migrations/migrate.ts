import fs from "node:fs";
import path from "node:path";
import { Pool } from "pg";

const migrationsDir = path.resolve(process.cwd(), "src/migrations");
const migrationFiles = fs
  .readdirSync(migrationsDir)
  .filter((file) => file.endsWith(".sql"))
  .sort();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.log("DATABASE_URL is not set; skipping SQL execution.");
  process.exit(0);
}

const pool = new Pool({ connectionString });

try {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  for (const migrationFile of migrationFiles) {
    const existing = await pool.query<{ version: string }>(
      "SELECT version FROM schema_migrations WHERE version = $1",
      [migrationFile]
    );
    if (existing.rowCount) {
      console.log(`Skipping already applied migration: ${migrationFile}`);
      continue;
    }

    const sql = fs.readFileSync(path.join(migrationsDir, migrationFile), "utf8");
    await pool.query("BEGIN");
    await pool.query(sql);
    await pool.query("INSERT INTO schema_migrations (version) VALUES ($1)", [migrationFile]);
    await pool.query("COMMIT");
    console.log(`Applied migration: ${migrationFile}`);
  }
} catch (error) {
  await pool.query("ROLLBACK");
  console.error("Migration failed:", error);
  process.exitCode = 1;
} finally {
  await pool.end();
}

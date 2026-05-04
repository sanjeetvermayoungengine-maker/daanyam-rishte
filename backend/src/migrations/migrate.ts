import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Pool } from "pg";

const migrationsDirCandidates = [
  path.resolve(process.cwd(), "dist/migrations"),
  path.resolve(process.cwd(), "src/migrations"),
];

function resolveMigrationsDir(): string {
  for (const candidate of migrationsDirCandidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return migrationsDirCandidates[0];
}

/**
 * Apply any pending SQL migrations from src/migrations/*.sql in lexical order.
 * Tracks applied filenames in a `schema_migrations` table; idempotent.
 *
 * No-op (returns silently) if DATABASE_URL is unset — useful for local dev
 * against the in-memory share storage.
 *
 * Throws on any migration failure so the caller can decide whether to crash
 * the process. When called from index.ts at boot, a throw will prevent the
 * server from starting, which is the desired behavior on a bad deploy.
 */
export async function runMigrations(): Promise<void> {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.log("[migrate] DATABASE_URL not set; skipping migrations.");
    return;
  }

  const migrationsDir = resolveMigrationsDir();
  const migrationFiles = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

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
        console.log(`[migrate] skip (already applied): ${migrationFile}`);
        continue;
      }

      const sql = fs.readFileSync(path.join(migrationsDir, migrationFile), "utf8");
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        await client.query(sql);
        await client.query(
          "INSERT INTO schema_migrations (version) VALUES ($1)",
          [migrationFile]
        );
        await client.query("COMMIT");
        console.log(`[migrate] applied: ${migrationFile}`);
      } catch (err) {
        await client.query("ROLLBACK");
        throw err;
      } finally {
        client.release();
      }
    }
  } finally {
    await pool.end();
  }
}

// Allow `npm run migrate` (or `node dist/migrations/migrate.js`) to still work.
const isCli = process.argv[1] === fileURLToPath(import.meta.url);
if (isCli) {
  runMigrations()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("[migrate] FAILED:", err);
      process.exit(1);
    });
}

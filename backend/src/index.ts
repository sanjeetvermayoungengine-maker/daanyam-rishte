import { createApp } from "./app.js";
import { getShareStorageMode } from "./db/pool.js";
import { runMigrations } from "./migrations/migrate.js";

const port = Number(process.env.PORT ?? 3000);

async function main() {
  // Run pending migrations before accepting traffic. If a migration fails the
  // throw bubbles up and prevents the server from starting — Cloud Run will
  // mark the revision unhealthy and refuse to send traffic to it.
  await runMigrations();

  const app = createApp();
  app.listen(port, () => {
    console.log(`Biodata backend listening on port ${port}`);
    console.log(`Share storage mode: ${getShareStorageMode()}`);
  });
}

main().catch((err) => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});

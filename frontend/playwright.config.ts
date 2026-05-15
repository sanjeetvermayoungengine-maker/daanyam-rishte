import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright config for the Rishte smoke suite.
 *
 * - BASE_URL  defaults to the local Vite dev server. Override per-environment:
 *     BASE_URL=https://rishte-preview.daanyam.in npm run test:e2e
 * - API_URL   the backend used by the BASE_URL frontend. Tests call /api/auth/*
 *   directly to verify the test-phone bypass works.
 * - TEST_PHONE and TEST_OTP must match what's deployed to that backend
 *   (see TESTERARMY.md and the rishte-api-preview Cloud Run env vars).
 *
 * The suite is intentionally minimal — TesterArmy extends it with their own
 * scenarios from the `e2e/` folder.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: process.env.BASE_URL ?? "http://localhost:5173",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});

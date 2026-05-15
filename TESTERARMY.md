# Rishte — TesterArmy handoff

Everything TesterArmy needs to log into Rishte without real SMS, plus the
existing test scaffolding to extend.

## Where to test

| Environment | Frontend | Backend (`VITE_API_URL`) | Bypass active? |
| --- | --- | --- | --- |
| Production | `https://rishte.daanyam.in` | `rishte-api` Cloud Run | No (do not test here) |
| Preview / staging | `https://rishte-preview.daanyam.in` (or any `daanyam-rishte-*.vercel.app` preview pointed at the preview API) | `rishte-api-preview` Cloud Run | Yes |
| Local dev | `http://localhost:5173` | `http://localhost:3000` | Yes if `TEST_PHONES` is set in `backend/.env` |

Use **preview only**. Production has BulkSMSPlans wired live and a real
Supabase project — bug reports filed there can't be distinguished from real
user traffic.

## Logging in (no real SMS needed)

The preview backend has an env-gated bypass: phones in the `TEST_PHONES`
allowlist skip BulkSMSPlans and accept a fixed OTP (`TEST_OTP`).

Default preview allowlist (set by `deploy-rishte-preview.sh`):

```
9000000001
9000000002
9000000003
9000000004
9000000005
```

Default OTP: `000000`

**One phone per tester.** Each phone maps to one Supabase user, so two
testers sharing a number will collide on shared state (saved biodata,
photos, share tokens). If the team grows past five, ask Sanjeet to widen
the allowlist via `deploy-rishte-preview.sh`.

Login flow on the site:

1. Open the preview URL → "Get Started" → walk through Language → Role → Dharm.
2. On the Sign-in screen, type your assigned 10-digit number (no `+91`).
3. Click **Send OTP** — no SMS is sent; the screen advances to the 6-digit input.
4. Type `000000`, click **Verify & Continue**.
5. You land on the lite onboarding form (full name + DOB). Fill it; then you're in.

## The two biodata UIs — by design

Rishte has two biodata-related UIs and they are intentionally different.
Please don't file these as duplicate-flow bugs:

- **Onboarding lite-form** — at the end of `/onboarding`, captures only
  full name + DOB. Goal: lowest possible friction to get the user through
  the door before they pick a template.
- **Full BioDataForm** — routed under `/biodata/personal`, `/biodata/photos`,
  `/biodata/family`, `/biodata/horoscope`, `/biodata/template`, `/biodata/review`.
  Six-step builder with all fields, photos, family, kundli, and template
  preview. This is the real editing surface post-onboarding.

Both share the same Redux store slice (`bioDataSlice`), so anything entered
in onboarding is prefilled in Step 1 of the full form. Bug-worthy issues to
look for:

- Visual divergence: typography, button styles, or field components that
  look inconsistent between the two surfaces.
- Data sync: edit a field in the full form, go back to the lite form, and
  confirm the lite form shows the latest value.

## Reporting bugs

Include in every report:

- The test phone you used (so we can reproduce against the same Supabase user).
- Preview URL + commit SHA (visible in the deploy log; ask if you can't find it).
- Browser + OS, and a screenshot or short screen recording.
- Console / network errors if any (DevTools → Console + Network tab).

## Test scaffolding (for engineers extending the suite)

A minimal Playwright suite lives in `frontend/e2e/`:

- `auth.api.spec.ts` — API smoke. Hits `/api/auth/send-otp` and `/api/auth/verify-otp`
  directly with a test phone, verifies the bypass returns a `token_hash`.
  Fast and selector-free; runs in CI without spinning up a browser stack.
- `onboarding.spec.ts` — UI happy path through the onboarding wizard.
  Logs in with the test phone and lands on the form screen.

Run locally:

```bash
cd frontend
npm run test:e2e:install            # one-time Playwright browser download
TEST_PHONE=9000000001 \
TEST_OTP=000000 \
API_URL=http://localhost:3000 \
BASE_URL=http://localhost:5173 \
npm run test:e2e
```

Run against preview (assuming `rishte-api-preview` is live):

```bash
TEST_PHONE=9000000001 \
TEST_OTP=000000 \
API_URL=https://rishte-api-preview-...run.app \
BASE_URL=https://rishte-preview.daanyam.in \
npm run test:e2e
```

The API-only subset (good for CI smoke):

```bash
npm run test:e2e:api
```

## Deploying / rotating the test-phone list

`deploy-rishte-preview.sh` builds and deploys to the `rishte-api-preview`
Cloud Run service with `TEST_PHONES` set. It refuses to run against the
production `rishte-api` service as a guardrail.

To rotate the allowlist without redeploying code:

```bash
gcloud run services update rishte-api-preview \
  --region=asia-south1 \
  --update-env-vars TEST_PHONES=9000000010,9000000011,9000000012,TEST_OTP=000000
```

To kill the bypass entirely (rolling preview back to real SMS):

```bash
gcloud run services update rishte-api-preview \
  --region=asia-south1 \
  --remove-env-vars TEST_PHONES,TEST_OTP
```

## Implementation pointers (for code review)

- Bypass helper: `backend/src/routes/testAuth.ts`
- Bypass call sites: `backend/src/routes/authRoutes.ts` — early-returns in
  `/send-otp` (skips BulkSMSPlans) and skips the verify call in `/verify-otp`.
  Supabase upsert + `generateLink` still run end-to-end so the session is real.
- Unit tests: `backend/src/routes/testAuth.test.ts`
- Bypass is dead code unless `TEST_PHONES` is set — leave it unset on prod.

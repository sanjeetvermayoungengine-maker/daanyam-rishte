# Rishte Launch Runbook

Step-by-step ops checklist to take Rishte live now that phone-OTP auth is wired
to a Supabase project. Run in order. Each step has a "done when" check.

## Status as of 2026-05-04

| Step | Status |
| --- | --- |
| 0. Commit launch-prep branch | 🟡 Script ready (`commit-launch-prep.sh`); commit + push not yet run |
| 1. Pick Supabase project | ✅ `daanyam-rishte` chosen, unpaused |
| 2. Run migrations | ⏳ Will auto-run on first backend deploy (Step 8.2 done) |
| 3. BulkSMS creds | ⏳ Reuse from Daanyam — copy into env |
| 4. Deploy backend | ⏳ Pending — run `setup-secrets.sh` then `deploy-rishte.sh` |
| 5. Deploy frontend | 🟡 VITE_API_URL updated; awaiting branch merge to trigger Vercel build |
| 6. Smoke test | ⏳ Pending |
| 7. Google sign-in | ✅ Fully configured end-to-end (Supabase + Google Cloud) |
| 8.1 Photos to R2 | 🔴 Post-launch |
| 8.2 Auto-migrations | ✅ Done — `runMigrations()` runs at boot in `src/index.ts` |
| 8.3 Sentry | 🔴 Post-launch |

## What just changed in code (context)

- `backend/src/routes/authRoutes.ts` — new. POST `/api/auth/send-otp` and
  `/api/auth/verify-otp` mirror the Daanyam webapp's flow exactly.
- `backend/src/app.ts` — mounts `/api/auth` and adds per-IP rate limits on the
  OTP endpoints.
- `backend/package.json` — adds `@supabase/supabase-js` and `zod`.
- `frontend/src/auth/AuthContext.tsx` — exposes real `sendOtp` and `verifyOtp`
  that call the new backend routes and exchange the magic-link `token_hash`
  for a Supabase session.
- `frontend/src/pages/Onboarding/AuthScreen.tsx` — fake `onGoogle` and
  one-line `verify` are gone. The "Send OTP" and "Verify & Continue"
  buttons now hit the real backend, surface real errors, and only advance
  the user once a Supabase session exists.
- `frontend/src/App.tsx` — wraps the app in `AuthProvider`.
- `frontend/src/components/Header.tsx` — the header sign-in button is now
  labeled just "Sign in" and routes to `/onboarding` (phone OTP) instead of
  triggering Google OAuth directly.

The backend `requireAuth` middleware was **not** touched. It already validates
Supabase JWTs via JWKS, so as long as Rishte and Daanyam point to the same
Supabase project, the same session works on both backends.

---

## Step 0 — Commit the in-progress branch first

The rollback plan at the bottom assumes you can revert to a known-good code
state. That only works if the launch deploy comes from a clean commit. Right
now `feature/template-redesign` has 14 modified files and ~10 untracked files
(including `backend/src/routes/authRoutes.ts`, `frontend/src/pages/Onboarding/`,
and the new auth context).

```bash
cd /Users/sanjeet/Desktop/daanyam-rishte
git status                       # eyeball the dirty files
git add -A                       # or stage selectively
git commit -m "feat: phone-OTP auth wired to Supabase (Rishte launch)"
git push origin feature/template-redesign
```

Done when: `git status` shows "nothing to commit, working tree clean" and the
commit SHA is on origin. Note the SHA — you'll need it for rollback.

---

## Step 1 — Pick the Supabase project

**Decided:** using the separate `daanyam-rishte` project (project ref
`umpxmvtuchlkkdttcvfl`, region ap-northeast-1, Tokyo). Trade-off vs. reusing
Daanyam: cleaner data isolation, but Daanyam's existing users will need to
re-authenticate to use Rishte. Acceptable for a soft launch.

Project URL: `https://umpxmvtuchlkkdttcvfl.supabase.co`

Get from Supabase dashboard → Project Settings → API (and Database for the
DB URL):

```bash
SUPABASE_URL=https://umpxmvtuchlkkdttcvfl.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service role key — keep secret>
SUPABASE_ANON_KEY=<anon/publishable key — safe to ship to frontend>
SUPABASE_DATABASE_URL=postgresql://postgres:<pw>@<host>:5432/postgres
```

Note: Free-tier projects auto-pause after ~1 week of inactivity. If
`daanyam-rishte` is paused when you check it, click **Resume** on the project
dashboard (takes a few minutes). The current state was unpaused on
2026-05-04 as part of this launch prep.

Done when: you've copied all four into your password manager.

---

## Step 2 — Run Rishte's migrations against Supabase

The repo has four migrations that create `biodata_profiles`, `share_links`,
and `share_access_events`. They're not auto-run on deploy yet.

```bash
cd /Users/sanjeet/Desktop/daanyam-rishte/backend
psql "$SUPABASE_DATABASE_URL" -f src/migrations/001_create_share_links.sql
psql "$SUPABASE_DATABASE_URL" -f src/migrations/002_add_owner_user_id.sql
psql "$SUPABASE_DATABASE_URL" -f src/migrations/003_add_share_metadata.sql
psql "$SUPABASE_DATABASE_URL" -f src/migrations/004_create_share_access_events.sql
```

Done when:

```bash
psql "$SUPABASE_DATABASE_URL" -c "\dt" | grep -E "biodata_profiles|share_links|share_access_events"
```

…shows all three tables.

**No psql installed?** Open the Supabase dashboard → SQL Editor → paste each
migration file's contents in order (001 → 004) and run. Same effect.

If reusing the Daanyam Supabase project, the `user_profiles` table already
exists. If using a fresh project, the OTP route will warn `user_profiles
upsert skipped` — that's intentional fallback. Only the auth user matters
for Rishte; you can safely add a `user_profiles` table later.

---

## Step 3 — BulkSMSPlans credentials

The phone OTP delivery uses BulkSMSPlans, same as Daanyam. Reuse the same
credentials:

```bash
BULKSMS_API_ID=<same as Daanyam>
BULKSMS_API_PASSWORD=<same as Daanyam>
BULKSMS_SENDER_ID=BLKSMS  # or whatever Daanyam uses
```

Done when: you've copied them into your password manager.

---

## Step 4 — Deploy backend to Cloud Run

Two scripts at the repo root do this end-to-end with Google Secret Manager.
Run them in order:

```bash
# 1) Create the secrets in GSM. Prompts silently for each value.
#    Sources: Supabase dashboard (Settings -> API & Database) for SUPABASE_*;
#    Vercel daanyam-webapp -> Env Variables for BULKSMS_* (reveal each).
bash /Users/sanjeet/Desktop/daanyam-rishte/setup-secrets.sh

# 2) Wire the secret refs onto rishte-api, then build & deploy via Cloud Build.
cd /Users/sanjeet/Desktop/daanyam-rishte
bash deploy-rishte.sh
```

**Service:** `rishte-api` in `asia-south1` (matches `cloudbuild.yaml`).
There are two stale services (`rishte-backend`, `daanyam-rishte`) from
earlier iterations — leave them for now, delete post-launch.

**Env vars set inline (non-secret):** `NODE_ENV`, `PORT`, `CORS_ORIGIN`.
**Env vars from GSM:** `DATABASE_URL`, `SUPABASE_URL`,
`SUPABASE_SERVICE_ROLE_KEY`, `BULKSMS_API_ID`, `BULKSMS_API_PASSWORD`,
`BULKSMS_SENDER_ID`.

**Not handled yet (post-launch):** R2 (photos still base64) and ASTRO_ENGINE
(if the kundli step needs it for the smoke test, manually set the keys with
`gcloud run services update rishte-api --update-env-vars=ASTRO_ENGINE_URL=...,ASTRO_ENGINE_KEY=...`
or add them to GSM and rerun `deploy-rishte.sh`).

Two new vars vs. last deploy: `SUPABASE_SERVICE_ROLE_KEY`, `BULKSMS_*`.

**Quick reference on what each Supabase var is for:**

- `SUPABASE_URL` — the project URL (`https://<ref>.supabase.co`), NOT the
  database URL. Used by both backend and frontend.
- `SUPABASE_SERVICE_ROLE_KEY` — backend ONLY. Never ship this to the frontend.
  Used by `authRoutes.ts` for admin operations (creating users, generating
  magic-link tokens).
- `SUPABASE_ANON_KEY` — frontend ONLY (set in Vercel, see Step 5). Backend
  doesn't need it.
- `SUPABASE_DATABASE_URL` (= `DATABASE_URL` for Cloud Run) — the Postgres
  connection string. Backend only.

**Rate limits (already enforced in `app.ts`):** `/api/auth/send-otp` is capped
at 6 requests / 10 minutes per IP, `/api/auth/verify-otp` at 20 / 10 min.
If you're hammering a phone number from one IP during testing, you'll hit
these. Restart the Cloud Run revision to flush the in-memory counters.

Done when:

```bash
# Cloud Run service URL (no custom domain — see "Custom domain" note below)
curl https://rishte-api-592048110971.asia-south1.run.app/api/health
# → {"status":"ok","service":"biodata-backend"}

curl -X POST https://rishte-api-592048110971.asia-south1.run.app/api/auth/send-otp \
     -H "Content-Type: application/json" \
     -d '{"phone":"<your real 10-digit number>"}'
# → {"success":true,"message_id":<number>}
```

The second curl actually sends an SMS. Use your own number. If you get back
`SMS service is temporarily unavailable`, the BULKSMS secrets aren't readable
by the Cloud Run runtime SA — re-run `setup-secrets.sh` to re-grant.

**Custom domain (deferred):** `rishte-api.daanyam.in` mapping was attempted
but Cloud Run's legacy domain mappings are not available in `asia-south1`
(Google is moving everyone to Global External ALB). For the soft launch the
frontend points directly at the Cloud Run URL above. Post-launch options:
1. Set up a Global External ALB → rishte-api Cloud Run (recurring ~$18/mo).
2. Cloudflare CNAME proxy with a host-rewrite rule (free, slightly trickier).
3. Move rishte-api to a region where legacy mappings still work (adds latency).

---

## Step 5 — Deploy frontend to Vercel

Vercel env vars on the `daanyam-rishte` project are already set:

```
VITE_API_URL=https://rishte-api-592048110971.asia-south1.run.app  (updated 2026-05-04)
VITE_SUPABASE_URL=<umpxmvtuchlkkdttcvfl supabase project URL>
VITE_SUPABASE_ANON_KEY=<the anon key, NOT the service role>
```

The launch code is on `feature/template-redesign`; Vercel auto-deploys on
push to `main`. To ship:

```bash
# After Step 0 (commit script) is done and the feature branch is pushed:
gh pr create --base main --head feature/template-redesign \
  --title "Rishte launch: phone OTP + Google OAuth + migrate-on-boot" \
  --body "See LAUNCH_RUNBOOK.md"
gh pr merge --merge   # or --squash; whatever your team uses
```

Vercel will detect the merge and start a production build automatically. The
`VITE_*` env vars are baked into the Vite bundle at build time, so the new
build will use the new VITE_API_URL.

Done when: `https://rishte.daanyam.in` loads, the browser network tab shows
`OPTIONS` and `POST` calls to `rishte-api-...run.app/api/auth/...` returning
2xx, and there are no console errors.

---

## Step 6 — Smoke test the share flow

> **Decide Step 7 (Google button) first.** If you're going phone-only, remove
> the Google button before this smoke test so you're testing what real users
> will see.

Run this in incognito so there's no cached session:

1. Open `https://rishte.daanyam.in/onboarding` → pick language, role, dharm.
2. Enter your phone number, click Send OTP. Wait for SMS. Enter the 6-digit
   code. Click Verify & Continue. You should land on the biodata form.
3. Fill the biodata form (skip the optional fields). Reach the preview.
4. Open the share modal. Pick a preset. Add a recipient label. Create
   the share. The link should appear with a copy button.
5. Open the share link in another incognito window. The biodata renders
   without requiring login.
6. Back in the first window, revoke the share. Reload the share link in the
   incognito window — should now show "Share link has been revoked".

If step 4 fails with a 401 in the network tab, the Supabase JWT isn't being
attached. Check that `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
on Vercel and that you re-deployed after setting them.

If step 4 fails with a 500, check Cloud Run logs:

```bash
gcloud run logs read rishte-api --region asia-south1 --limit 50
```

The two most common 500s are (a) `SUPABASE_URL` missing on Cloud Run,
(b) the migrations from Step 2 weren't run.

---

## Step 7 — Google sign-in ✅ DONE

Decided to keep Google as a fallback. The configuration is already in place
end-to-end:

- **Supabase (daanyam-rishte) → Auth → Providers → Google:** enabled, with
  Client ID `592048110971-1vlee855rrlk9s1o1s57huoelg6so29s.apps.googleusercontent.com`
  and the matching Client Secret.
- **Supabase → Auth → URL Configuration:**
  - Site URL: `https://rishte.daanyam.in`
  - Redirect URLs: `https://rishte.daanyam.in/**` ← added on 2026-05-04
- **Google Cloud → daanyam-astroengine project → OAuth client "Daanyam Rishte":**
  - Authorized JavaScript origins: `https://rishte.daanyam.in`
  - Authorized redirect URIs: `https://umpxmvtuchlkkdttcvfl.supabase.co/auth/v1/callback`
  - Status: Enabled

Nothing to do here for launch. Verify in the smoke test (Step 6) that
clicking "Continue with Google" on the auth screen actually signs you in.

If you ever rotate the Google Client Secret, the new value goes into the
Supabase project's Google provider config (paste, Save). The Client ID
itself doesn't change.

---

## Step 8 — Known gaps to fix before public launch (not blockers for soft launch)

These are things you can ship without, but should plan for:

1. **Photos are still base64.** Move to R2 before opening to general traffic.
   Confirmed in `frontend/src/components/PhotoUploader.tsx` (uses
   `reader.readAsDataURL`) and `frontend/src/services/uploadService.ts`
   (stores as local `dataUrl`). Backend already accepts the R2 env vars but
   has no upload endpoint. To-do: add `POST /api/uploads/photo` in the
   backend (presigned-PUT or proxy upload), swap `uploadService.ts` to call
   it, store only the R2 object key on the profile. ~1 day of work.

2. **Migrations don't run automatically on deploy.** ✅ **DONE.**
   `backend/src/migrations/migrate.ts` now exports a `runMigrations()` function
   (kept its CLI entrypoint, so `npm run migrate` still works), and
   `backend/src/index.ts` calls it before `app.listen()`. On deploy, Cloud Run
   will run pending migrations at boot; if any fail, the server won't start
   and the revision will be marked unhealthy. Tracking table:
   `schema_migrations`. Pending migrations are detected by lexical-sort of
   `src/migrations/*.sql` minus what's already in `schema_migrations`.

   This means you can **skip Step 2** on subsequent deploys — just deploy and
   the migrations apply themselves. Step 2 is still useful for the *first*
   deploy to confirm Postgres connectivity before bringing the API up.

3. **No error tracking.** Confirmed: zero "sentry" references in either
   `backend/src` or `frontend/src`. Add Sentry in both for the first
   real-traffic week. (Step 0 covered the branch-cleanliness gap that used
   to live here.)

---

## Rollback plan

If something breaks badly mid-launch:

```bash
# 1. Find the previous Cloud Run revision name.
gcloud run revisions list --service rishte-api --region asia-south1 --limit 5

# 2. Send 100% of traffic back to it. Replace PREVIOUS_REVISION with the
#    actual name from step 1 (e.g. rishte-api-00042-xyz).
gcloud run services update-traffic rishte-api \
  --region asia-south1 \
  --to-revisions=PREVIOUS_REVISION=100

# 3. Revert Vercel: in the dashboard, find the last known-good deployment
#    and click "Promote to Production".
```

The database migrations are forward-only and don't touch Daanyam-side data,
so a rollback is just code, not data. The Step 0 commit SHA is your "last
known good" reference if you need to `git revert` to it locally.

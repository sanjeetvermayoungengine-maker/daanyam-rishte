# Rishte — Deploy Frontend & Backend

Use this prompt with Claude Code (or any capable agent) from the `daanyam-rishte/` project root.

---

## Prompt

You are deploying the **Rishte by Daanyam** full-stack web app. The project lives at `daanyam-rishte/` and has two deployable units:

### Stack overview

| Layer | Tech | Current host |
|-------|------|--------------|
| Frontend | React 18 + Vite 5 + TypeScript | Vercel |
| Backend | Node 20 + Express + TypeScript | Google Cloud Run |
| Database / Auth | Supabase (hosted) | Supabase cloud |

---

### 1. Pre-deploy checklist

Before touching deployment, verify:

```bash
# Frontend — must build cleanly
cd frontend && npm run build && cd ..

# Backend — must compile cleanly
cd backend && npx tsc --noEmit && cd ..

# TypeScript — zero errors in both
```

If either fails, stop and fix the errors first.

---

### 2. Run pending database migrations

The following migrations have not yet been applied to the production Supabase instance:

- `backend/src/migrations/003_add_share_metadata.sql`
- `backend/src/migrations/004_create_share_access_events.sql`

Apply them via the Supabase dashboard SQL editor (Settings → SQL Editor) or using the Supabase CLI:

```bash
supabase db push
```

**Run migrations before deploying the backend** — the new backend code depends on these schema changes.

---

### 3. Deploy the backend (Google Cloud Run)

The backend is containerised. Check the existing `Dockerfile` in `backend/` and the Cloud Run service name in previous deployment configs.

Steps:

```bash
cd backend

# Set your project
export GCP_PROJECT=<your-gcp-project-id>
export REGION=asia-south1          # or whichever region is already in use
export SERVICE_NAME=rishte-backend  # match the existing Cloud Run service name
export IMAGE=gcr.io/$GCP_PROJECT/$SERVICE_NAME

# Build and push
docker build -t $IMAGE .
docker push $IMAGE

# Deploy to Cloud Run
gcloud run deploy $SERVICE_NAME \
  --image $IMAGE \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars "$(cat .env.production | xargs | tr ' ' ',')"
```

**Required environment variables** (set in Cloud Run or via Secret Manager):

```
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_ANON_KEY=
ASTRO_ENGINE_URL=          # new — required for kundli/horoscope
ASTRO_ENGINE_API_KEY=      # new — if AstroEngine requires auth
FRONTEND_URL=https://rishte.daanyam.in   # for CORS
PORT=8080
```

After deploy, verify the health endpoint:
```bash
curl https://<cloud-run-url>/api/health
```

---

### 4. Deploy the frontend (Vercel)

The frontend deploys via Vercel connected to the GitHub repo. Two options:

**Option A — Automatic (recommended):** Push `feature/template-redesign` to `main` (or merge via PR). Vercel auto-deploys on push.

**Option B — Manual CLI deploy:**

```bash
cd frontend
npm run build
vercel deploy --prod
```

**Required environment variables** (set in Vercel dashboard → Project Settings → Environment Variables):

```
VITE_API_URL=https://<cloud-run-url>           # backend Cloud Run URL
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

After deploy, verify:
- Landing page loads at `https://rishte.daanyam.in`
- `/dashboard` route works (React Router SPA routing via `vercel.json`)
- Sign in with Google works (Supabase OAuth)
- Biodata form → horoscope step → geocoding search works
- Share link generation works end-to-end

---

### 5. Post-deploy smoke test

```
[ ] GET /api/health → { status: "ok" }
[ ] GET /api/geocoding?q=Mumbai → returns location candidates
[ ] POST /api/kundli → returns kundli calculation
[ ] Landing page (/) → loads with audience toggle
[ ] /dashboard → loads behind auth check
[ ] Biodata form → all 6 steps reachable
[ ] Preview → renders biodata with chosen template
[ ] Share → create link, open in incognito
```

---

### 6. Known things to watch

- **CORS**: `FRONTEND_URL` env var on the backend must exactly match the Vercel production URL (no trailing slash).
- **SPA routing**: `vercel.json` must have a rewrite rule sending all routes to `index.html`. Confirm it exists.
- **Supabase OAuth redirect**: Update allowed redirect URLs in Supabase Auth settings to include the new Vercel production domain if it changed.
- **Artifact Registry**: GCP requires the Artifact Registry repository to exist before a push. If it doesn't exist yet: `gcloud artifacts repositories create rishte --repository-format=docker --location=$REGION`

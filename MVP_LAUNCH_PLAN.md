# MVP Launch Plan: rishte.daanyam.in

This document is the operator runbook for launching the MVP. For the system architecture and service responsibilities, use [ARCHITECTURE.md](ARCHITECTURE.md).

## Launch Goal

Launch:

- Frontend: `https://rishte.daanyam.in`
- Backend API: `https://rishte-api.daanyam.in`
- Database: Supabase PostgreSQL
- Photo storage: Cloudflare R2 bucket `rishte-photos`

Assumption: the app will be deployed from a Git-backed repository. This local folder is not currently a Git repository, so initialize or connect Git before relying on the Git/Vercel auto-deploy steps.

## Preflight

Run these checks before creating production resources.

```bash
cd /Users/sanjeet/Desktop/daanyam-rishte

docker-compose down -v
docker-compose up --build
```

In another terminal:

```bash
cd /Users/sanjeet/Desktop/daanyam-rishte/backend
npm run build
npm run test

cd /Users/sanjeet/Desktop/daanyam-rishte/frontend
npm run build
npm run test
```

Done means:

- Backend tests pass.
- Frontend tests pass.
- `http://localhost:3000/api/health` returns JSON with `status: "ok"`.
- The frontend can load locally.
- Any known product gaps are accepted for MVP launch.

## Production Values Worksheet

Fill these in as resources are created. Do not commit secrets.

```bash
export SUPABASE_PROJECT_REF=""
export SUPABASE_URL="https://${SUPABASE_PROJECT_REF}.supabase.co"
export SUPABASE_DATABASE_URL=""
export SUPABASE_SERVICE_ROLE_KEY=""

export GCP_PROJECT_ID=""
export CLOUD_RUN_REGION="asia-south1"
export CLOUD_RUN_SERVICE="rishte-api"
export CLOUD_RUN_URL=""

export R2_ACCOUNT_ID=""
export R2_ACCESS_KEY_ID=""
export R2_SECRET_ACCESS_KEY=""
export R2_BUCKET_NAME="rishte-photos"

export FRONTEND_DOMAIN="https://rishte.daanyam.in"
export API_DOMAIN="https://rishte-api.daanyam.in"
export JWT_SECRET=""
```

Generate `JWT_SECRET` once and store it in your password manager:

```bash
openssl rand -base64 32
```

## Step 1: Prepare Git and Release Branch

If the workspace is not yet Git-backed:

```bash
cd /Users/sanjeet/Desktop/daanyam-rishte
git init
git add .
git commit -m "Prepare MVP launch"
git branch -M main
git remote add origin <github-repo-url>
git push -u origin main
```

If Git is already configured:

```bash
cd /Users/sanjeet/Desktop/daanyam-rishte
git status
git add .
git commit -m "Prepare MVP launch"
git push origin main
```

Done means the exact code you intend to deploy is available in GitHub.

## Step 2: Create Supabase Project

In the Supabase dashboard:

1. Create project `daanyam-rishte`.
2. Save the project ref.
3. Copy the PostgreSQL connection string into `SUPABASE_DATABASE_URL`.
4. Copy the service-role key into `SUPABASE_SERVICE_ROLE_KEY`.

Migration status:

- This repo currently does not include SQL migration files.
- Before production launch, create and run migrations for the tables listed in `ARCHITECTURE.md`.
- Avoid using hand-written partial table snippets as the production schema.

Verification:

```bash
psql "$SUPABASE_DATABASE_URL" -c "select now();"
```

Done means the database accepts connections and the final schema is present.

## Step 3: Create R2 Bucket

In Cloudflare:

1. Create R2 bucket `rishte-photos`.
2. Create an R2 API token for the app.
3. Save account ID, access key ID, and secret access key.
4. Decide whether photos are private via signed URLs or public via explicit object/bucket rules.

Done means the backend has the credentials needed to write to R2 and the photo access model is documented.

## Step 4: Deploy Backend to Cloud Run

Install and authenticate the Google Cloud CLI if needed:

```bash
brew install google-cloud-sdk
gcloud init
gcloud config set project "$GCP_PROJECT_ID"
```

Deploy from the backend directory:

```bash
cd /Users/sanjeet/Desktop/daanyam-rishte/backend

gcloud run deploy "$CLOUD_RUN_SERVICE" \
  --source . \
  --platform managed \
  --region "$CLOUD_RUN_REGION" \
  --allow-unauthenticated \
  --memory 512Mi \
  --timeout 300 \
  --set-env-vars "NODE_ENV=production,PORT=3000,DATABASE_URL=$SUPABASE_DATABASE_URL,JWT_SECRET=$JWT_SECRET,SUPABASE_URL=$SUPABASE_URL,SUPABASE_KEY=$SUPABASE_SERVICE_ROLE_KEY,CORS_ORIGIN=$FRONTEND_DOMAIN,R2_ACCOUNT_ID=$R2_ACCOUNT_ID,R2_ACCESS_KEY_ID=$R2_ACCESS_KEY_ID,R2_SECRET_ACCESS_KEY=$R2_SECRET_ACCESS_KEY,R2_BUCKET_NAME=$R2_BUCKET_NAME"
```

Save the generated service URL:

```bash
export CLOUD_RUN_URL="https://<generated-cloud-run-url>"
```

Verify:

```bash
curl "$CLOUD_RUN_URL/api/health"
```

Expected response:

```json
{"status":"ok","service":"biodata-backend"}
```

Done means the backend health endpoint responds from Cloud Run.

## Step 5: Deploy Frontend to Vercel

Set the temporary API URL to the Cloud Run URL first:

```bash
cd /Users/sanjeet/Desktop/daanyam-rishte/frontend

cat > .env.production.example <<'EOF'
VITE_API_URL=https://<generated-cloud-run-url>
EOF
```

In Vercel:

1. Import the GitHub repository.
2. Set root directory to `frontend`.
3. Set environment variable `VITE_API_URL` to `$CLOUD_RUN_URL`.
4. Deploy production.

Verification:

```bash
curl -I https://<vercel-generated-domain>
```

Done means the Vercel deployment serves the frontend.

## Step 6: Configure Custom Domains

In Cloudflare DNS for `daanyam.in`:

Frontend:

```text
Type: CNAME
Name: rishte
Target: cname.vercel-dns.com
Proxy: DNS only
```

Backend:

```text
Type: CNAME
Name: rishte-api
Target: <generated-cloud-run-hostname>
Proxy: DNS only
```

Provider setup:

- In Vercel, add `rishte.daanyam.in` to the frontend project.
- In Google Cloud Run, map `rishte-api.daanyam.in` to the backend service or follow the current Google-managed custom-domain flow for Cloud Run.

DNS verification:

```bash
nslookup rishte.daanyam.in
nslookup rishte-api.daanyam.in
```

Done means both hostnames resolve and provider dashboards show the custom domains as valid.

## Step 7: Switch Apps to Final Domains

Update Vercel:

```text
VITE_API_URL=https://rishte-api.daanyam.in
```

Redeploy frontend from Vercel.

Update Cloud Run CORS:

```bash
gcloud run services update "$CLOUD_RUN_SERVICE" \
  --region "$CLOUD_RUN_REGION" \
  --update-env-vars "CORS_ORIGIN=https://rishte.daanyam.in"
```

Verify:

```bash
curl https://rishte-api.daanyam.in/api/health
curl -I https://rishte.daanyam.in
```

Done means the public frontend and API domains both respond.

## Step 8: Product Verification

Run this checklist in the browser:

- [ ] Visit `https://rishte.daanyam.in`.
- [ ] No CORS errors appear in the browser console.
- [ ] A user can register.
- [ ] A user can log in.
- [ ] A user can create biodata.
- [ ] Photos upload successfully.
- [ ] Uploaded photo objects appear in R2.
- [ ] A share link can be created.
- [ ] A share link can be viewed without login.
- [ ] Shared biodata only exposes permitted fields.

Backend checks:

```bash
gcloud run logs read "$CLOUD_RUN_SERVICE" \
  --region "$CLOUD_RUN_REGION" \
  --limit 50
```

Done means there are no launch-blocking errors in the product flow or backend logs.

## Step 9: Minimum Monitoring

Before announcing launch:

- Confirm Cloud Run logs are readable.
- Confirm Vercel deployment status is healthy.
- Confirm Supabase storage and connection metrics are visible.
- Confirm Cloudflare DNS status is healthy.

Recommended immediately after launch:

- Add uptime checks for `https://rishte.daanyam.in`.
- Add uptime checks for `https://rishte-api.daanyam.in/api/health`.
- Add Sentry or equivalent error tracking.

## Troubleshooting

### CORS error

Check that the backend has:

```text
CORS_ORIGIN=https://rishte.daanyam.in
```

Then redeploy or update Cloud Run environment variables.

### API health fails

```bash
gcloud run services describe "$CLOUD_RUN_SERVICE" \
  --region "$CLOUD_RUN_REGION"

gcloud run logs read "$CLOUD_RUN_SERVICE" \
  --region "$CLOUD_RUN_REGION" \
  --limit 100
```

Check `PORT`, startup logs, and environment variables.

### Database connection fails

```bash
psql "$SUPABASE_DATABASE_URL" -c "select 1;"
```

Check Supabase connection string, password, SSL requirements, and whether the schema has been created.

### Photo upload fails

Check:

- R2 bucket exists.
- R2 credentials are present in Cloud Run.
- The backend upload implementation is deployed.
- The chosen public/signed URL access model matches the frontend.

### Domain does not resolve

```bash
nslookup rishte.daanyam.in
nslookup rishte-api.daanyam.in
```

Check Cloudflare records and provider-side custom-domain validation.

## Launch Decision Gate

Launch only when:

- [ ] Production frontend is reachable.
- [ ] Production backend health endpoint is reachable.
- [ ] Database schema is final for MVP.
- [ ] R2 upload path is verified.
- [ ] CORS is restricted to the production frontend.
- [ ] Secrets are stored outside Git.
- [ ] Manual product verification passes.
- [ ] Monitoring is available for the first launch window.

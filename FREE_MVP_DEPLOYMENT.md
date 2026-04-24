# 🎉 FREE MVP Deployment Guide - rishte.daanyam.in

Complete guide to deploy Rishta MVP with **$0-5/month cost** using your existing daanyam.in infrastructure.

**Stack:**
- Frontend: Vercel (FREE)
- Backend: GCP Cloud Run (pay-per-use, ~$0 for MVP)
- Database: Supabase (FREE tier)
- Storage: Cloudflare R2 (FREE 100GB/month)
- DNS: Cloudflare (FREE)

---

## Phase 1: Setup Supabase (Database) - 5 minutes

### Step 1: Create Supabase Project

```bash
# Go to https://supabase.com
# Sign in with GitHub
# Click "New Project"
# Name: daanyam-rishte
# Region: Closest to you (India: Singapore or Mumbai)
# Click "Create new project"
```

Wait ~2 minutes for project to initialize.

### Step 2: Get Connection URL

1. Go to project → Settings → Database
2. Copy **Connection String** (starts with `postgresql://`)
3. Replace `[YOUR-PASSWORD]` with actual password shown
4. Save as `DATABASE_URL` (you'll use this later)

### Step 3: Run Migrations

1. Go to SQL Editor → New Query
2. Copy-paste all SQL from `backend/migrations/` folder:

```sql
-- Paste migration files here and run each one
-- Start with 001_init_users.sql, etc.
```

Or easier: Use Supabase CLI from your local machine:

```bash
# Install Supabase CLI
brew install supabase/tap/supabase

# Link project
supabase link --project-ref <your-project-ref>

# Run migrations
supabase db push

# Get new DATABASE_URL
supabase status
```

### Step 4: Create Supabase API Key

Go to Settings → API → Service Role Key → Copy it (you'll use this for backend environment)

---

## Phase 2: Setup Backend - GCP Cloud Run - 10 minutes

### Step 1: Deploy to Cloud Run

```bash
# Install Google Cloud CLI
# macOS:
brew install google-cloud-sdk

# Initialize
gcloud init
# Select your GCP project

# Set project
gcloud config set project YOUR-PROJECT-ID
```

### Step 2: Create .dockerignore for Backend

```bash
cd /Users/sanjeet/Desktop/daanyam-rishte/backend

cat > .dockerignore <<EOF
node_modules
npm-debug.log
dist
.env
.env.local
.git
EOF
```

### Step 3: Build and Deploy

```bash
# Deploy to Cloud Run
gcloud run deploy rishte-api \
  --source . \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars="NODE_ENV=production,DATABASE_URL=$DATABASE_URL,REDIS_URL=null,JWT_SECRET=$(openssl rand -base64 32),AWS_S3_BUCKET=null,SUPABASE_URL=<your-supabase-url>,SUPABASE_KEY=<your-supabase-key>"
```

This command:
- Builds Docker image from your Dockerfile
- Deploys to Cloud Run
- Returns public URL like `https://rishte-api-xxx.run.app`

**Save this URL** - it's your backend API endpoint

### Step 4: Test Backend

```bash
# Test health endpoint
curl https://rishte-api-xxx.run.app/api/health

# Should return: {"status": "ok"}
```

### ⏰ Cost Breakdown for Backend

Google Cloud Run free tier:
- **2M requests/month free** ✅
- **15GB outbound data/month free** ✅
- **For MVP**: You'll be WAY under these limits
- **Expected cost for MVP**: $0-2/month

---

## Phase 3: Setup Photo Storage - Cloudflare R2 - 5 minutes

R2 is **99% cheaper than AWS S3** and has free tier.

### Step 1: Enable Cloudflare R2

1. Go to https://dash.cloudflare.com
2. Left sidebar → R2
3. Create bucket → Name: `rishte-photos`
4. Region: Automatic
5. Create bucket

### Step 2: Create R2 API Token

1. R2 → Settings → API Tokens
2. Create API Token:
   - Name: `rishte-app`
   - Permissions: All permissions
   - TTL: 1 year
3. Save:
   - Account ID
   - Access Key ID
   - Secret Access Key

### Step 3: Update Backend Environment

Add to Cloud Run environment variables:
```
R2_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-key
R2_SECRET_ACCESS_KEY=your-secret
R2_BUCKET_NAME=rishte-photos
```

### Step 4: Update Photo Upload Code

In `backend/src/services/s3.ts`, add R2 support:

```typescript
// Add R2 endpoint support
const s3Client = new S3Client({
  region: 'auto',
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
});
```

### ⏰ Cost Breakdown for R2

Cloudflare R2:
- **100GB storage/month free** ✅
- **1M request/month free** ✅
- No egress charges (unlike S3)
- **Expected cost for MVP**: $0

---

## Phase 4: Setup Frontend - Vercel - 5 minutes

### Step 1: Connect GitHub to Vercel

```bash
# Make sure code is pushed to GitHub
cd /Users/sanjeet/Desktop/daanyam-rishte
git push origin main
```

1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "Import Project"
4. Select `daanyam-rishte` repo
5. Vercel auto-detects monorepo

### Step 2: Configure Frontend Deployment

1. Framework: **Vite**
2. Root Directory: `frontend`
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Environment Variables:
   ```
   VITE_API_URL=https://rishte-api-xxx.run.app
   ```
6. Click "Deploy"

Vercel builds and deploys. Wait ~3 minutes.

### Step 3: Get Frontend URL

After deployment, Vercel shows public URL:
`https://daanyam-rishte.vercel.app`

### ⏰ Cost Breakdown for Vercel

Vercel free tier:
- **Unlimited deployments** ✅
- **Fast edge network** ✅
- **Built-in HTTPS** ✅
- **Expected cost**: $0

---

## Phase 5: Connect Custom Domain - rishte.daanyam.in - 5 minutes

### Step 1: Update DNS Records

Go to your Cloudflare dashboard (where daanyam.in is registered):

1. Domain: daanyam.in → DNS
2. Create new records:

```
Type: CNAME
Name: rishte
Content: cname.vercel-dns.com
TTL: Auto
Proxy status: DNS only (gray cloud)

---

Type: CNAME  
Name: rishte-api
Content: rishte-api-xxx.run.app  (your Cloud Run URL)
TTL: Auto
Proxy status: DNS only (gray cloud)
```

### Step 2: Update Vercel with Custom Domain

1. Vercel → Project Settings → Domains
2. Add domain: `rishte.daanyam.in`
3. Vercel verifies DNS (takes ~1 minute)

### Step 3: Update Backend with Frontend URL

Go to Cloud Run → rishte-api → Edit & Deploy:

Update environment variable:
```
CORS_ORIGIN=https://rishte.daanyam.in
VITE_API_URL=https://rishte.daanyam.in/api
```

### Step 4: Update Frontend Environment

Vercel → Environment Variables:
```
VITE_API_URL=https://rishte.daanyam.in/api
```

Redeploy frontend.

### ✅ Done!

Your app is now live at:
- **Frontend**: https://rishte.daanyam.in ✅
- **Backend API**: https://rishte-api.daanyam.in/api ✅
- **Database**: Supabase (managed) ✅
- **Storage**: Cloudflare R2 ✅

---

## Phase 6: Run Database Migrations

### Option 1: Via Supabase UI (Easiest)

1. Go to Supabase → Project → SQL Editor
2. New Query
3. Copy each migration file from `backend/migrations/`
4. Run each one in order:
   - `001_init_users.sql`
   - `002_init_biodatas.sql`
   - etc.

### Option 2: Via Backend (Post-Deployment)

After backend is deployed:

```bash
# Call migration endpoint
curl -X POST https://rishte-api.daanyam.in/api/migrate \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

Or add to backend startup:

```typescript
// In src/index.ts, before server start:
async function runMigrations() {
  const migrationClient = new pg.Client(process.env.DATABASE_URL);
  await migrationClient.connect();
  
  const migrations = fs.readdirSync('./src/migrations').filter(f => f.endsWith('.sql'));
  for (const file of migrations) {
    const sql = fs.readFileSync(`./src/migrations/${file}`, 'utf-8');
    await migrationClient.query(sql);
  }
  
  await migrationClient.end();
}

await runMigrations();
```

---

## Phase 7: Setup Monitoring (Free)

### Option 1: Google Cloud Monitoring (Free)

Cloud Run automatically logs to Google Cloud Logging.

```bash
# View logs
gcloud run logs read rishte-api --region asia-south1 --limit 50
```

### Option 2: Use Sentry (Free for small projects)

```bash
# 1. Sign up at https://sentry.io
# 2. Create project (Node.js)
# 3. Get DSN
# 4. Add to backend env:

SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
```

In backend code:

```typescript
import * as Sentry from '@sentry/node';

Sentry.init({ dsn: process.env.SENTRY_DSN });
```

**Cost**: Free for up to 5,000 errors/month

### Option 3: Simple Cloud Logging

View logs directly in Google Cloud Console:

```bash
# Stream logs in real-time
gcloud run logs read rishte-api --region asia-south1 --follow

# Or search Google Cloud Console → Logging → Logs Explorer
```

---

## Complete Cost Breakdown

| Component | Free Tier | Cost |
|-----------|-----------|------|
| **Frontend (Vercel)** | Unlimited deploys, edge network | $0 |
| **Backend (Cloud Run)** | 2M requests/month free | $0 (for MVP) |
| **Database (Supabase)** | 500MB storage, unlimited query | $0 |
| **Storage (Cloudflare R2)** | 100GB/month, 1M requests free | $0 |
| **DNS (Cloudflare)** | Unlimited | $0 |
| **Monitoring (Google Cloud Logs)** | Built-in | $0 |
| **CI/CD (GitHub Actions)** | 2000 minutes/month | $0 |
| **Domain (daanyam.in)** | Already owned | $0 |
| **TOTAL** | | **$0/month** ✅ |

*Note: If you exceed free tiers, Cloud Run is pay-per-use (~$0.20-1/month for typical MVP usage)*

---

## Quick Start Commands

### Deploy Everything in 15 Minutes

```bash
# 1. Supabase - Just sign up at supabase.com (2 min)

# 2. Cloud Run - Deploy backend
cd /Users/sanjeet/Desktop/daanyam-rishte/backend
gcloud run deploy rishte-api \
  --source . \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars="NODE_ENV=production,DATABASE_URL=<SUPABASE_URL>,JWT_SECRET=$(openssl rand -base64 32),SUPABASE_KEY=<SUPABASE_KEY>"
# Wait for deployment (3 min)

# 3. Vercel - Deploy frontend
cd /Users/sanjeet/Desktop/daanyam-rishte
git push origin main
# Go to https://vercel.com → Import → Select repo → Deploy (3 min)

# 4. Cloudflare R2 - Create bucket (2 min)
# Go to https://dash.cloudflare.com → R2 → Create bucket

# 5. DNS - Add CNAME records (2 min)
# Cloudflare → DNS → Add records

# 6. Test
curl https://rishte-api.daanyam.in/api/health
# Visit https://rishte.daanyam.in
```

---

## Environment Variables Checklist

**Supabase (Database)**
```
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=your-service-role-key
DATABASE_URL=postgresql://postgres:password@host/database
```

**Cloudflare R2 (Storage)**
```
R2_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-key-id
R2_SECRET_ACCESS_KEY=your-secret-key
R2_BUCKET_NAME=rishte-photos
```

**Cloud Run Backend**
```
NODE_ENV=production
PORT=3000
JWT_SECRET=<strong-secret>
CORS_ORIGIN=https://rishte.daanyam.in
DATABASE_URL=<from-supabase>
SUPABASE_KEY=<from-supabase>
R2_ACCOUNT_ID=<from-cloudflare>
R2_ACCESS_KEY_ID=<from-cloudflare>
R2_SECRET_ACCESS_KEY=<from-cloudflare>
```

**Vercel Frontend**
```
VITE_API_URL=https://rishte-api.daanyam.in
```

---

## Scaling Later

If MVP gets traction and you need to pay:

| Milestone | Component | New Cost |
|-----------|-----------|----------|
| 10k MAU | Cloud Run | ~$10/month |
| 50k MAU | Supabase upgrade | ~$25/month |
| 100k MAU | Cloud Run + Scale | ~$50-100/month |
| 1M MAU | Full infrastructure | ~$500-1000/month |

But you start at **$0** and pay only as you grow! 🚀

---

## Troubleshooting

### "Cloud Run deployment failed"

```bash
# Check logs
gcloud run logs read rishte-api --region asia-south1 --limit 10

# Common issues:
# 1. Missing environment variables
# 2. Dockerfile doesn't exist
# 3. Port not exposed (should be 3000)

# Redeploy with verbose logging
gcloud run deploy rishte-api --source . --region asia-south1 --verbose
```

### "Database connection error"

```bash
# Verify DATABASE_URL
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1"

# Check if migrations ran
# Go to Supabase → SQL Editor → Check tables exist
```

### "CORS error in frontend"

```bash
# Verify CORS_ORIGIN matches frontend domain
# Backend env var should be: https://rishte.daanyam.in

# Update Cloud Run:
gcloud run deploy rishte-api \
  --update-env-vars "CORS_ORIGIN=https://rishte.daanyam.in" \
  --region asia-south1
```

### "Photos not uploading"

```bash
# Check R2 credentials
# Go to Cloudflare → R2 → Settings → API Tokens
# Verify access key is active

# Test upload directly
# Add test endpoint to backend and check CloudFront logs
```

### "Domain not resolving"

```bash
# Check DNS propagation
nslookup rishte.daanyam.in
# Should resolve to Vercel IP

# Check Cloudflare DNS
# Dashboard → daanyam.in → DNS
# Records should show CNAME to vercel-dns.com

# May take 5-15 minutes to propagate
```

---

## Next Steps After Launch

1. **Monitor**: Set up Google Cloud Alerts for errors
2. **Logging**: Enable Sentry for better error tracking
3. **Analytics**: Add Google Analytics to frontend
4. **Backups**: Enable Supabase automated backups
5. **Scaling**: When you hit 1M requests/month, consider upgrading

---

## Cost Optimization Tips

**To stay free longer:**

1. **Image optimization**: Compress photos before upload
   ```bash
   npm install sharp
   # Use in photo upload endpoint
   ```

2. **Caching**: Use Cloudflare edge caching
   ```
   Cache everything for static assets
   Set long TTL for API responses
   ```

3. **Database queries**: Optimize to avoid N+1 queries
   ```typescript
   // Use JOIN instead of multiple queries
   SELECT users.*, biodatas.* FROM users 
   LEFT JOIN biodatas ON users.id = biodatas.user_id
   ```

4. **Monitor usage**: 
   ```bash
   # Check Cloud Run usage
   gcloud billing accounts list
   gcloud billing projects describe YOUR-PROJECT-ID
   
   # Check Supabase storage
   # Supabase → Dashboard → Storage stats
   ```

5. **Set spending alerts**:
   ```bash
   gcloud billing budgets create \
     --billing-account=<ACCOUNT_ID> \
     --display-name="MVP Budget" \
     --budget-amount=10 \
     --threshold-rule=percent=100 \
     --threshold-rule=percent=50
   ```

---

## Summary

✅ **Frontend**: Vercel (FREE)  
✅ **Backend**: Google Cloud Run (FREE for MVP)  
✅ **Database**: Supabase (FREE)  
✅ **Storage**: Cloudflare R2 (FREE 100GB/mo)  
✅ **DNS**: Cloudflare (FREE)  
✅ **Domain**: rishte.daanyam.in (existing)  

**Total cost: $0/month for MVP** 🎉

You're ready to go live with zero infrastructure costs!

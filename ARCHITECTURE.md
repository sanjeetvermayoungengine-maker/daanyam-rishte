# Architecture: Rishte MVP on daanyam.in

This document is the source of truth for the intended system architecture. For step-by-step deployment commands, use [MVP_LAUNCH_PLAN.md](MVP_LAUNCH_PLAN.md).

## Status

The repository currently contains a React/Vite frontend and a Node.js/Express backend. The backend exposes `GET /api/health`; the database, storage, authentication, sharing, and production hardening described below are the launch target and should be verified before being marked complete.

## Launch Target

```
End user browser
    |
    | HTTPS
    v
Cloudflare DNS
    |
    +-- rishte.daanyam.in      -> Vercel frontend
    |
    +-- rishte-api.daanyam.in  -> Google Cloud Run backend

Vercel frontend
    |
    | VITE_API_URL
    v
Cloud Run backend
    |
    +-- Supabase PostgreSQL for application data
    |
    +-- Cloudflare R2 for uploaded photos
    |
    +-- Google Cloud Logging for backend logs
```

## Component Ownership

| Area | Source of truth | Notes |
| --- | --- | --- |
| System shape and service responsibilities | `ARCHITECTURE.md` | Keep this descriptive and stable. |
| Deployment order, commands, and verification | `MVP_LAUNCH_PLAN.md` | Keep this executable and specific. |
| Local development | `LOCAL_SETUP.md` | Use for Docker/local environment details. |
| Broader implementation backlog | `TASK_BREAKDOWN.md` | Use for unbuilt product and engineering tasks. |

## Components

### Frontend

- Runtime: React 18, TypeScript, Vite, Redux, React Router.
- Deployment target: Vercel.
- Production domain: `https://rishte.daanyam.in`.
- Backend connection: `VITE_API_URL`, expected to point to `https://rishte-api.daanyam.in` after the custom API domain is live.

The frontend should be treated as a static SPA. It should not hold service-role credentials or direct database credentials.

### Backend

- Runtime: Node.js 18+, Express, TypeScript.
- Deployment target: Google Cloud Run.
- Production domain: `https://rishte-api.daanyam.in`.
- Current verified endpoint: `GET /api/health`.
- Expected production responsibilities:
  - Authentication and password hashing.
  - API authorization.
  - Biodata CRUD.
  - Photo upload validation and storage.
  - Share-token creation and public share reads.
  - Centralized server-side access to database and storage credentials.

Cloud Run should receive configuration through environment variables. Secrets should not be committed to the repository.

### Database

- Service: Supabase PostgreSQL.
- Production credential used by backend: `DATABASE_URL`.
- Expected application tables:
  - `users`
  - `biodatas`
  - `family_info`
  - `horoscope`
  - `photos`
  - `shares`
  - `audit_logs`

Row-level security, audit logging, and full migration coverage are launch hardening items until migrations and policies exist in the repo or Supabase project.

### Storage

- Service: Cloudflare R2.
- Production credentials used by backend:
  - `R2_ACCOUNT_ID`
  - `R2_ACCESS_KEY_ID`
  - `R2_SECRET_ACCESS_KEY`
  - `R2_BUCKET_NAME`
- Expected bucket: `rishte-photos`.

The backend should validate file type and size before upload. Public photo access should be intentionally designed: either signed URLs for private access or explicit public bucket/object rules for public assets.

### DNS and Routing

- DNS provider: Cloudflare for `daanyam.in`.
- Frontend record: `rishte.daanyam.in` points to Vercel.
- Backend record: `rishte-api.daanyam.in` points to Cloud Run.

Do not add extra CDN or proxy layers to the architecture unless they are also present in the launch plan.

## Data Flows

### Health Check

```
Browser or CLI
    -> https://rishte-api.daanyam.in/api/health
    -> Cloud Run backend
    -> JSON health response
```

Current expected response shape:

```json
{
  "status": "ok",
  "service": "biodata-backend"
}
```

### Registration

```
Frontend registration form
    -> POST /api/auth/register
    -> Backend validates input
    -> Backend hashes password
    -> Backend writes user to Supabase
    -> Backend returns session token or cookie
```

Session storage should be decided and implemented consistently. If cookies are used, they should be `HttpOnly`, `Secure`, and `SameSite`-appropriate. If bearer tokens are used, CSRF requirements change and should be documented.

### Biodata Creation

```
Frontend multi-step form
    -> local form state while editing
    -> POST /api/biodata on final submit
    -> Backend writes biodata and related records to Supabase
    -> Frontend renders preview from saved data
```

### Photo Upload

```
Frontend file picker
    -> POST /api/biodata/:id/photos
    -> Backend validates file
    -> Backend uploads object to R2
    -> Backend stores photo metadata in Supabase
    -> Frontend displays the returned URL or signed URL
```

### Sharing

```
Authenticated user creates share
    -> Backend creates share token and permissions
    -> Public link: https://rishte.daanyam.in/share/:token
    -> Recipient opens link
    -> Public API reads token and returns only permitted fields
```

Share-token reads should be audited once `audit_logs` is implemented.

## Security Baseline

Required for MVP launch:

- HTTPS on frontend and backend domains.
- Strong `JWT_SECRET`.
- Password hashing on the backend.
- Backend-only database and storage credentials.
- CORS restricted to `https://rishte.daanyam.in`.
- File upload validation before R2 writes.
- Share-token expiry and permission filtering.

Planned hardening:

- Rate limiting on auth and public share endpoints.
- CSRF protection if cookie-based auth is used.
- Token refresh flow.
- Supabase row-level security policies.
- Audit logging for share views and sensitive writes.
- Sentry or equivalent error tracking.
- Scheduled database exports outside Supabase.
- R2 lifecycle, versioning, or backup policy.

## Environment Variables

Backend production:

```bash
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://...
JWT_SECRET=...
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_KEY=<service-role-key>
CORS_ORIGIN=https://rishte.daanyam.in
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=rishte-photos
```

Frontend production:

```bash
VITE_API_URL=https://rishte-api.daanyam.in
```

## Cost Assumptions

The target stack is chosen to fit free or low-cost tiers during MVP usage. Actual bills depend on provider pricing, region, request volume, CPU time, storage, bandwidth, and feature usage. Treat cost numbers in the launch plan as estimates and verify them in each provider dashboard before launch.

## Monitoring

Minimum launch monitoring:

- Cloud Run logs for backend errors.
- Vercel deployment and runtime status.
- Supabase dashboard for database storage and connection usage.
- Cloudflare dashboard for DNS and traffic status.

Recommended next step after launch:

- Add Sentry or another error tracker to the backend and frontend.
- Add uptime checks for `https://rishte.daanyam.in` and `https://rishte-api.daanyam.in/api/health`.

## Scaling Path

Stage 1, MVP:

- Vercel frontend.
- Cloud Run backend.
- Supabase database.
- R2 photo storage.

Stage 2, growth:

- Upgrade Supabase when storage, connection count, or backup needs exceed the free tier.
- Increase Cloud Run memory/CPU or configure minimum instances if cold starts hurt UX.
- Add production error tracking and uptime monitoring.

Stage 3, scale:

- Revisit database architecture, object access patterns, caching, and multi-region needs based on actual traffic and bottlenecks.

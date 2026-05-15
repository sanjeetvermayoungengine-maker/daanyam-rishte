# SEO Implementation — What Was Built

This is a deployment companion to `SEO_STRATEGY.md`. It documents what the SEO strategy implementation actually shipped: file locations, how the build flow works, and what to do next.

## Summary

All five phases of the strategy are implemented. Twenty public content pages are written, prerendered to static HTML at build time, listed in a sitemap, and linked from the landing page footer and the biodata builder. Crawler traffic on `/share/:token` is forwarded to a backend endpoint that returns OG-tagged HTML built from the share's privacy settings.

## What's New (file inventory)

### Frontend

```
frontend/
├── index.html                                 # ⟵ updated: full meta, OG, JSON-LD
├── public/robots.txt                          # ⟵ new
├── vercel.json                                # ⟵ updated: crawler rewrite, cleanUrls
├── package.json                               # ⟵ updated: build pipeline + verify
├── src/
│   ├── App.tsx                                # ⟵ updated: registers content routes
│   ├── pages/
│   │   ├── LandingPage.tsx                    # ⟵ updated: SEO link grid in footer
│   │   ├── LandingPage.css                    # ⟵ updated: footer link grid styles
│   │   ├── BioDataForm/Step4_Horoscope.tsx    # ⟵ updated: Daanyam cross-link
│   │   └── content/                           # ⟵ new: 20 SEO content pages
│   │       ├── BiodataFormatMaster.tsx
│   │       ├── BiodataFormat{Boy,Girl,Hindi,Marathi,Gujarati,Muslim,Sikh}.tsx
│   │       ├── VivahMuhurat{2026,2027}.tsx
│   │       ├── WeddingChecklist{,Biodata}.tsx
│   │       ├── KundliMilan{,Ashtakoot,Manglik,NadiDosha}.tsx
│   │       ├── PrivacyFirstMatchmaking.tsx
│   │       ├── Blog{WhyNotMatrimonialSites,BiodataSharingEtiquette,HoroscopePrivacy}.tsx
│   │       └── _stub.tsx                      #   helper for future stubs
│   └── seo/                                   # ⟵ new: SEO infrastructure
│       ├── routes.ts                          # central manifest (source of truth)
│       ├── SEOHead.tsx                        # runtime meta-tag injector
│       ├── ContentLayout.tsx                  # standalone (no auth/redux) layout
│       ├── ContentRoutes.tsx                  # route registry shared by SPA+prerender
│       ├── content.css                        # content page styles
│       └── prerenderEntry.tsx                 # build-time render entrypoint
└── scripts/
    ├── prerender.mjs                          # ⟵ new
    ├── generate-sitemap.mjs                   # ⟵ new
    └── verify-seo.mjs                         # ⟵ new (sanity-check the build)
```

### Backend

```
backend/src/
├── routes/shareRoutes.ts                      # ⟵ updated: GET /:token/og added
└── services/
    ├── shareOgRenderer.ts                     # ⟵ new
    └── shareOgRenderer.test.ts                # ⟵ new
```

## Build Pipeline

`npm run build` (in `frontend/`) now does three steps:

1. **`vite build`** (or esbuild fallback) — bundles the SPA
2. **`node scripts/prerender.mjs`** — for each path in `src/seo/routes.ts`:
   - Server-renders the React tree using `react-dom/server` + `StaticRouter`
   - Injects the route's title/description/OG/canonical tags into `index.html`
   - Writes the result to `dist/<path>/index.html`
3. **`node scripts/generate-sitemap.mjs`** — emits `dist/sitemap.xml`

Verify the output with `npm run verify:seo` after building.

## The `/share/:token` Crawler Flow

1. WhatsApp/Twitter/Facebook bots hit `https://rishte.daanyam.in/share/<token>`.
2. **Vercel rewrite** (`vercel.json`) inspects the `User-Agent` header. If it matches a crawler, the request is rewritten to `https://rishte-api.daanyam.in/api/shares/<token>/og`.
3. **Backend endpoint** (`shareRoutes.ts → GET /:token/og`):
   - Looks up the share and biodata
   - Calls `buildOgPayload()` which respects the share's privacy settings (name shown only if `viewBasic`, photo shown only if `viewPhotos`, etc.)
   - Renders HTML with proper `<title>`, `og:title`, `og:description`, `og:image` tags
   - Returns 200 HTML, cached 5 minutes
4. **Real users** (Chrome, Safari, etc.) fall through to the SPA fallback rewrite and get the normal React app.

## Cross-Link Architecture

Implemented from `SEO_STRATEGY.md` § 3:

**On Rishte → Daanyam:**
- Horoscope step (`/biodata/horoscope`) — "Get the full kundli on Daanyam" link after kundli generation
- All `/kundli-milan/*` pages — `DaanyamCrossLink` card to `daanyam.in/kundli-milan`
- `/vivah-muhurat/*` pages — `DaanyamCrossLink` to `daanyam.in/muhurat`
- Landing page footer — "Powered by Daanyam's Vedic astrology engine"
- Content page footers — links to `daanyam.in`

All Daanyam outbound links include UTM tags: `utm_source=rishte&utm_medium=crosslink&utm_campaign=<page>`.

**On Daanyam → Rishte:**
- *To be added on the Daanyam side.* The strategy doc § 3 lists the placements (kundli milan results, vivah muhurat pages, navigation, footer).

## What's NOT Yet Implemented

These are explicitly deferred to later phases per the strategy doc:

- **Full Hindi mirrors** (`/hi/biodata-format/*`). The strategy says: "do NOT build full Hindi mirrors of everything — focus English-first." We did build `/biodata-format/hindi` (Hindi-language version of the biodata format guide).
- **Christian community biodata page** — strategy doc § 6 Phase 4 mentions adding it later.
- **`/success-stories` section** — strategy doc § 6 Phase 5.
- **Daanyam-side links** — these go in the Daanyam codebase, not this one.
- **Google Search Console submission** — operational step, not code.

## Pre-Launch Checklist

Before deploying:

1. Add a `frontend/public/og-image.png` (1200×630, marigold/maroon brand). Used as the default OG image.
2. Add a `frontend/public/favicon.png` and `frontend/public/logo.png`.
3. Verify the backend URL in `vercel.json` (`rishte-api.daanyam.in`) matches your actual deployment.
4. Run `npm run build && npm run verify:seo` and check all checks pass.
5. Set up Google Search Console for `rishte.daanyam.in` and submit `https://rishte.daanyam.in/sitemap.xml`.
6. Verify the OG endpoint manually with curl + a crawler UA:
   ```
   curl -A "WhatsApp/2.21.11.17 A" https://rishte.daanyam.in/share/<token>
   ```
7. Test a real WhatsApp / Twitter share link to confirm the preview renders.

## Adding New Content Pages

1. Add an entry to `src/seo/routes.ts` (title, description, priority, changefreq).
2. Add the path + `Allow:` directive to `public/robots.txt` if needed.
3. Create a new file in `src/pages/content/` following the pattern in `BiodataFormatMaster.tsx`.
4. Register it in `src/seo/ContentRoutes.tsx` (`contentRouteEntries` array).
5. Run `npm run build && npm run verify:seo` to confirm.

## Measurement

Per strategy doc § 7, after launch:

- Google Search Console — track indexed pages, impressions, top queries
- Google Analytics or Plausible — track sessions on `/biodata-format/*`, `/kundli-milan/*`, `/vivah-muhurat/*` paths
- Daanyam side — track inbound clicks via `utm_source=rishte` UTM

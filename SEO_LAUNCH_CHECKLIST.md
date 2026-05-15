# SEO Launch Checklist — From Code to Indexed

Companion to `SEO_STRATEGY.md` and `SEO_IMPLEMENTATION.md`. This is the actual sequence to run from "code merged" to "first organic visitors landing on content pages."

## Status Snapshot (verified 15 May 2026 via Chrome)

| Surface | Status | Notes |
|---|---|---|
| rishte.daanyam.in (homepage) | ✓ Live (pre-SEO) | Title, meta, JSON-LD not yet shipped |
| /biodata-format/* content pages | ✗ Not deployed | Built locally; need `npm run build` + redeploy |
| /sitemap.xml | ✗ Returns SPA HTML | Will return XML after deploy |
| /robots.txt | ✗ Cloudflare default | Will return our rules after deploy |
| /share/:token crawler rewrite | ✗ Not deployed | Vercel rewrite + backend `/og` endpoint not live |
| Brand assets (og-image, favicon, logo) | ✓ Generated, in `frontend/public/` | Ship with next deploy |
| Daanyam → Rishte cross-links (4 surfaces) | ✓ Patched | Need Daanyam redeploy |
| Search Console — Daanyam Domain property | ✓ Active | Covers all subdomains incl. rishte.daanyam.in |
| Search Console — Rishte sitemap | ✗ Not submitted | Blocked on Rishte deploy |

## Step 1 — Verify Build Locally (10 min)

```bash
cd ~/Desktop/daanyam-rishte/frontend
npm install   # picks up no new deps, but make sure native binaries match
npm run build
npm run verify:seo
```

`verify:seo` checks every prerendered HTML page for title/description/canonical/og:*. If it reports failures, **fix them before deploying** — easier to debug locally than in production.

Open `dist/biodata-format/index.html` in a text editor; confirm the `<title>`, `<meta name="description">`, and JSON-LD blocks are baked in (not generated client-side).

## Step 2 — Generate Verified Muhurat Data (5 min)

The current placeholder shows "Awaiting verified data". Generate real dates from the astro engine:

```bash
cd ~/Desktop/daanyam-webapp
npx tsx scripts/generate-rishte-muhurat-data.ts \
  --year 2026 \
  --out ../daanyam-rishte/frontend/src/seo/vivahMuhurat2026.data.ts
```

This runs Swiss Ephemeris-backed `findMuhurats("vivah", ...)` for every day of 2026 and writes the verified dataset. Then rebuild Rishte (`npm run build` again).

Also regenerate for 2027 (`--year 2027`) and create `vivahMuhurat2027.data.ts`. Update `VivahMuhurat2027.tsx` to import it (currently the page has placeholder text).

## Step 3 — Deploy Rishte (Vercel)

```bash
cd ~/Desktop/daanyam-rishte
git add .
git commit -m "SEO: prerendered content pages, sitemap, robots, OG, brand assets"
git push
```

Vercel auto-deploys. Watch the build log for any prerender errors.

After deploy completes, smoke test:

```bash
# Sitemap is now real XML
curl -sI https://rishte.daanyam.in/sitemap.xml | grep -i content-type
# Should be: content-type: application/xml; charset=utf-8

# robots.txt is now ours
curl -s https://rishte.daanyam.in/robots.txt | head -5
# Should start with "# Rishte by Daanyam — robots.txt"

# Content page returns prerendered HTML with meta
curl -s https://rishte.daanyam.in/biodata-format | grep -E '<title>|<meta name="description"' | head -2

# Crawler rewrite — replace TOKEN with a real active share token
curl -A "WhatsApp/2.21" -s https://rishte.daanyam.in/share/TOKEN | grep og:title
# Should see og:title content="<name>'s Marriage Biodata..."
```

## Step 4 — Deploy Daanyam (cross-links)

```bash
cd ~/Desktop/daanyam-webapp
git add .
git commit -m "Cross-links to Rishte from kundli-matching, muhurat, footer"
git push
```

After deploy, verify the four placements:

1. Visit `https://daanyam.in/kundli-matching`, run a match, scroll past the result — Rishte CTA card should appear under "What Next"
2. Visit `https://daanyam.in/muhurat/calendar/vivah/2026-05` — Rishte CTA at bottom
3. Visit `https://daanyam.in/muhurat/vivah` — Rishte CTA before "← All Muhurat"
4. Scroll to footer on any Daanyam page — "Our Products → रिश्ते Rishte" appears in the brand column

## Step 5 — Submit Sitemap to Search Console (2 min)

Once `https://rishte.daanyam.in/sitemap.xml` is serving real XML:

1. Go to https://search.google.com/search-console/sitemaps?resource_id=sc-domain:daanyam.in
2. In the "Add a new sitemap" input, paste: `https://rishte.daanyam.in/sitemap.xml`
3. Click Submit
4. Status should show "Success" within a few minutes; "Discovered pages" updates over 24h

Because the Daanyam.in property is a **Domain property** (covers all subdomains), there's no separate Rishte property to manage. All Rishte impressions/clicks will appear under the existing daanyam.in property — filter by `URL contains rishte.daanyam.in` in Performance reports.

## Step 6 — Request Indexing for Top Pages (3 min)

In Search Console, top right "Inspect any URL in 'daanyam.in'" search box. For each of these, paste the URL, wait for the inspection, click "Request Indexing":

- `https://rishte.daanyam.in/`
- `https://rishte.daanyam.in/biodata-format`
- `https://rishte.daanyam.in/biodata-format/boy`
- `https://rishte.daanyam.in/biodata-format/girl`
- `https://rishte.daanyam.in/kundli-milan`
- `https://rishte.daanyam.in/vivah-muhurat/2026`

Google rate-limits indexing requests to ~10/day. Spread out if needed. The rest get discovered via the sitemap.

## Step 7 — Test WhatsApp / Twitter Previews

After deploy, open a chat (any active share token in your dashboard):

1. **WhatsApp:** paste `https://rishte.daanyam.in/share/<token>` into a chat. Wait 2-3 seconds. Should see a preview card with the biodata name, summary, and image (respecting privacy settings).
2. **Twitter Card Validator:** https://cards-dev.twitter.com/validator → paste the share URL → should render summary_large_image.
3. **Facebook Sharing Debugger:** https://developers.facebook.com/tools/debug/ → paste URL → click "Scrape Again" to force a fresh fetch.

If a preview is broken: the bug is almost certainly in the Vercel rewrite or the backend `/og` endpoint. Check the backend logs for the request.

## Step 8 — First-Week Monitoring

Daily (5 min):

- **GSC → Performance:** filter by URL contains `rishte` — watch impressions trend. Expect 0 → tens by day 3-5 → low hundreds by day 7-10.
- **GSC → Pages:** confirm content pages move from "Discovered, not indexed" → "Indexed". A handful per day is normal.
- **PostHog (or whatever you use):** filter events by `utm_source=daanyam` to see how Daanyam → Rishte traffic is converting. Funnel: cross-link click → /onboarding → biodata created.

Week 2 onward:

- **GSC → Performance → Queries:** which keywords are surfacing? Refine pages that are getting impressions but no clicks (= weak title/description) and pages getting clicks but low time-on-page (= content didn't deliver).
- **Pages losing impressions:** quarter-month review. Refresh content or accept and move on.

## Step 9 — If Something's Off

| Symptom | Likely cause | Fix |
|---|---|---|
| Content page returns SPA (no meta in source) | Prerender step didn't run during build | Re-check `package.json` build script; ensure `node scripts/prerender.mjs` ran |
| Sitemap returns HTML | Vercel rewrite catching `/sitemap.xml` | Confirm `vercel.json` has `cleanUrls: true` and the `/(.*)` rewrite is LAST |
| WhatsApp preview shows generic OG | Vercel UA-based rewrite not matching | Test rewrite directly: `curl -A "WhatsApp/2.21" -I https://rishte.daanyam.in/share/TOKEN` should show 200 from backend, not Vercel HTML |
| `verify:seo` fails on some routes | Route in `routes.ts` but missing in `ContentRoutes.tsx` (or vice-versa) | Confirm both files list the same paths |
| Search Console: "Submitted URL not found (404)" | Page in sitemap but Vercel returns 404 | Confirm `vercel.json` `cleanUrls: true` is in place; check that `dist/<path>/index.html` exists |

## Step 10 — Quarterly

- **January 2027:** regenerate muhurat data for 2027. Update `VivahMuhurat2027.tsx` to use real data. Update `/vivah-muhurat/2026` to a "see archive" link.
- **Every quarter:** review which content pages are getting impressions and which aren't. Double down on traction; archive or rewrite no-traction pages.
- **Annually:** review `SEO_STRATEGY.md` and add new content pillars based on the year's keyword data.

---

*If anything in this checklist is unclear or wrong, fix the doc — it'll be your year-from-now self thanking you.*

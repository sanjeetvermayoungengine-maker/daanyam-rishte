# Commit Instructions

Run these from the `daanyam-rishte/` root in your terminal.

---

## Step 0 — move design mockups

```bash
mkdir -p design
mv rishte-homepage.html rishte-homepage-v2.html rishte-homepage-v3.html design/ 2>/dev/null; true
```

---

## Commit 1 — Backend: kundli, geocoding, share permissions

```bash
git add \
  backend/.env.example \
  backend/package-lock.json \
  backend/src/app.ts \
  backend/src/app.test.ts \
  backend/src/db/shareRepository.ts \
  backend/src/routes/shareRoutes.ts \
  backend/src/routes/geocodingRoutes.ts \
  backend/src/routes/kundliRoutes.ts \
  backend/src/services/shareService.ts \
  backend/src/services/shareService.test.ts \
  backend/src/services/sharePermissions.ts \
  backend/src/services/sharePresets.ts \
  backend/src/services/astroEngineAdapter.ts \
  backend/src/services/astroEngineClient.ts \
  backend/src/services/astroEngineClient.test.ts \
  backend/src/services/geocodingService.ts \
  backend/src/services/geocodingService.test.ts \
  backend/src/services/kundliService.ts \
  backend/src/services/kundliService.test.ts \
  backend/src/types/share.ts \
  backend/src/types/geocoding.ts \
  backend/src/types/horoscope.ts \
  backend/src/migrations/003_add_share_metadata.sql \
  backend/src/migrations/004_create_share_access_events.sql

git commit -m "feat(backend): add kundli, geocoding, share permissions & presets

- Add AstroEngine client + adapter for horoscope calculation
- Add geocoding service (birth place lookup for kundli)
- Add kundli service with Supabase persistence
- Wire up /api/geocoding and /api/kundli routes
- Add share permission presets (conservative, standard, open)
- Add field-level share permissions model + service
- Expand share repository with metadata and access event queries
- Add migrations: 003 share metadata, 004 share_access_events table
- Extend .env.example with ASTRO_ENGINE_URL and related vars
- Extend types: Share, Geocoding, Horoscope"
```

---

## Commit 2 — Frontend: design system, landing page, horoscope UI

```bash
git add \
  frontend/index.html \
  frontend/package.json \
  frontend/package-lock.json \
  frontend/src/App.tsx \
  frontend/src/styles.css \
  frontend/src/components/FormField.tsx \
  frontend/src/components/Header.tsx \
  frontend/src/components/HoroscopeAccessControl.tsx \
  frontend/src/components/PublicHoroscopeCard.tsx \
  frontend/src/components/ShareModal.tsx \
  frontend/src/components/SharePermissionToggle.tsx \
  frontend/src/components/TemplateCard.tsx \
  frontend/src/components/TemplateView_Modern.tsx \
  frontend/src/components/TemplateView_Premium.tsx \
  frontend/src/components/TemplateView_Split.tsx \
  frontend/src/components/TemplateView_Traditional.tsx \
  frontend/src/pages/BioDataForm/Step4_Horoscope.tsx \
  frontend/src/pages/BioDataPreview.tsx \
  frontend/src/pages/LandingPage.tsx \
  frontend/src/pages/LandingPage.css \
  frontend/src/pages/PublicBioDataView.tsx \
  frontend/src/pages/SharePrivacySettings.tsx \
  frontend/src/services/geocodingApi.ts \
  frontend/src/services/kundliApi.ts \
  frontend/src/services/shareApi.ts \
  frontend/src/services/shareService.ts \
  frontend/src/services/shareService.test.ts \
  frontend/src/store/bioDataSlice.ts \
  frontend/src/store/bioDataSlice.test.ts \
  frontend/src/store/index.ts \
  frontend/src/utils/horoscope.ts \
  frontend/src/utils/sharePermissions.ts \
  frontend/src/utils/sharePermissions.test.ts \
  frontend/src/utils/validation.ts

git commit -m "feat(frontend): design system overhaul + landing page + horoscope UI

Design system:
- Replace cold navy palette with warm ink (#1C1916) + gold (#B8860B) + maroon (#7A1418)
- Add Cormorant Garamond (display), DM Sans (UI), Noto Serif Devanagari (brand) fonts
- h1/h2 globally set to Cormorant Garamond; brand mark shows Devanagari 'र'
- Gold-tinted borders, focus rings, and active states throughout
- Replace all hardcoded navy/teal/cold-blue values with semantic tokens

Landing page:
- New three-audience landing page (Families / You / Matchmakers)
- Animated toggle with sliding gold underline, 180ms fade body swap
- Full-height split hero, parchment right panel with arch + rotating biodata card
- Matchmaker section with dark editorial layout and client workspace mockup
- Scroll-reveal animations via IntersectionObserver
- CSS fully scoped under .landing + --lp-* variable prefix

Routing & Header:
- Extract AppContent so useLocation works inside BrowserRouter
- HEADERLESS_ROUTES array hides global Header on landing page
- Header Home link updated to /dashboard

Horoscope step:
- Birth place geocoding search panel with candidate list
- Kundli result card (rashi, nakshatra, lagna, etc.)
- Horoscope access control with field-level share permissions

Share & permissions:
- Expanded ShareModal with preset chips (conservative / standard / open)
- SharePermissionToggle with per-field granularity
- Share insights grid and analytics row"
```

---

## Commit 3 — Design mockups (optional, keep for reference)

```bash
git add design/
git commit -m "chore: move homepage design mockups to design/ folder

Three iterations of the Rishte landing page design (HTML prototypes)
used as visual reference during implementation."
```

---

## Push

```bash
git push origin feature/template-redesign
```

# Rishte — Bug Report (Production audit, pre-auth)

Compiled from a Chrome-driven walkthrough of `https://rishte.daanyam.in` on
2026-05-15. Post-auth coverage is pending the `rishte-api-preview` deploy
(see TESTERARMY.md). Severities:

- **P0** — blocks core flow, data loss, security, or breaks a launch goal.
- **P1** — visible bug or broken feature that needs to ship-block.
- **P2** — polish, copy, visual inconsistency.

---

## P0 issues

### P0-1: All SEO/content pages serve an empty React shell (prerender broken in prod)

**Where:** Every route in `frontend/src/seo/ContentRoutes.tsx` — 20 URLs:
`/biodata-format`, `/biodata-format/{boy,girl,marathi,gujarati,hindi,muslim,sikh}`,
`/vivah-muhurat/{2026,2027}`, `/wedding-checklist`, `/wedding-checklist/biodata`,
`/kundli-milan`, `/kundli-milan/{ashtakoot,manglik,nadi-dosha}`,
`/privacy-first-matchmaking`, `/blog/{why-not-matrimonial-sites,biodata-sharing-etiquette,horoscope-privacy}`.

**Observed:** `fetch('/biodata-format/hindi')` returns 825 bytes of:

```
<title>Rishte by Daanyam</title>
...
<body><div id="root"></div></body>
```

— no `<h1>`, no meta description, no OG tags, no canonical, no content
markers. Same response body for all 20 content URLs. Google sees nothing
beyond the generic title. The entire content/SEO strategy is broken in prod.

**Expected:** Each URL should serve route-specific prerendered HTML with
unique `<title>`, `<meta description>`, `<h1>`, and the page body, per
`scripts/prerender.mjs`. After JS hydration the SPA takes over.

**Likely cause:** `frontend/dist/` only contains `index.html` and `assets/`
— no `dist/biodata-format/hindi/index.html` etc. Either:

1. The Vercel build command isn't `npm run build` (it might be just
   `vite build`), so `node scripts/prerender.mjs` never runs.
2. The prerender script throws silently (the local dist was checked and
   has the same flat shape).
3. Vercel's SPA fallback rewrites every path to `/index.html` *before* the
   per-route prerendered files are tried — `vercel.json` has:

   ```json
   { "source": "/(.*)", "destination": "/index.html" }
   ```

   This rewrite catches everything that doesn't have a more specific match.
   Even if prerendered files exist, this would skip them. The rewrite needs
   `has` conditions or to be reordered so static files win.

**Repro:**
```bash
curl -s https://rishte.daanyam.in/biodata-format/hindi | head -20
```

**Fix sketch:**
1. Confirm Vercel build command in project settings is exactly `npm run build` (with the prerender step), not `vite build`.
2. In `vercel.json`, narrow the SPA rewrite so it only fires when no static file matches — e.g. exclude `*.html` paths or list app routes explicitly.
3. Run `npm run build` locally and verify `dist/biodata-format/hindi/index.html` exists with real content before redeploying.

---

### P0-2: Client-side routing redirects all content URLs to `/` after hydration

**Where:** Same 20 content routes as P0-1.

**Observed:** Navigating to `/biodata-format/hindi` in the browser: after
JS executes, `location.pathname` becomes `/` and the landing-page H1
("Every रिश्ता begins with trust.") renders. Confirmed by
`history.pushState('','','/biodata-format/hindi')` followed by a 500ms
wait — still ends at `/`.

**Expected:** React Router's `contentRouteEntries.map(...)` block in
`App.tsx` should match and render the `<ContentLayout>` for that path. The
catch-all `<Route path="*" element={<Navigate to="/" replace />} />` should
not fire.

**Likely cause:** `contentRouteEntries` from `frontend/src/seo/ContentRoutes.tsx`
is empty or not populated at the time `<Routes>` renders. Possible reasons:
a circular import, the lazy-loaded content components failing to import (any
runtime error inside a `<ContentLayout>` would still render the catch-all
on mismatch), or the import side of `contentRouteEntries` evaluating after
the Routes render.

**Fix sketch:** add a console.log of `contentRouteEntries.length` near the
top of `App.tsx` and load the prod site to confirm. If empty at render
time, fix the import chain. Likely a small file but it kills 20 pages.

---

## P1 issues

### P1-1: Footer links to `/about`, `/privacy`, `/contact` are silently redirected to `/`

**Where:** `frontend/src/pages/LandingPage.tsx` footer (and global footer wherever).

**Observed:**
- Footer renders three text links: About, Privacy, Contact, each with `href="/about"` etc.
- Visiting `/about` lands at `/` (pathname check confirms). Same for `/privacy` and `/contact`.
- React Router's catch-all `<Route path="*" />` handles them via `<Navigate to="/" />`.

**Expected:** A privacy policy page is effectively a legal requirement for
a product collecting biodata (name, DOB, religion, caste, parents' names,
horoscope). About and Contact are trust signals.

**Fix:** Create three minimal pages (`/about`, `/privacy`, `/contact`) and
register them as routes. Privacy is highest priority — without it the
landing page's "Your privacy, always" / "Built on trust" copy is hollow.

---

### P1-2: All landing CTAs jump to the full BioDataForm, bypassing the onboarding wizard entirely

**Where:** Landing page CTAs — every "Create My Biodata" button, "Get
Started — Free", and "Start with Family — ₹99/mo" links to
`/biodata/personal` (Step 1 of `BioDataForm`). The carefully-designed
`/onboarding` wizard (Language → Role → Dharm → Auth → lite form) is
**not linked from anywhere on the landing page**.

**Observed:** Crawled every `<a href>` on the landing page:

```
/biodata/personal × 5  (every CTA)
/preview               (See a Sample)
/                      (logo and footer)
/about, /privacy, /contact  (footer — broken, see P1-1)
```

— no link to `/onboarding`.

**Expected:** Either:
- The onboarding wizard is the front door — most CTAs should go to
  `/onboarding`, with `/biodata/personal` reserved for returning users
  who already authed; or
- The wizard is dead code, in which case it should be deleted to reduce
  cognitive overhead on you and TesterArmy.

This is the underlying reason the user perceives "two biodata flows" —
the marketing surface points at one (full BioDataForm), but onboarding
exists at a different URL.

**Decision needed before fix:** which one is the intended front door?
See "Biodata UI divergence" section below for what differs between them.

---

### P1-3: Locally-cached Redux state leaks personal biodata via `/preview`

**Where:** `frontend/src/pages/BioDataPreview.tsx` reads from `bioDataSlice`.

**Observed:** Visiting `/preview` in the current browser (no live Supabase
session — header shows "Sign in") still renders a full biodata with real
PII: name "Sanjeet", DOB "24 Sep 2000", father "Rajpal", mother
"Kailashwati", address "New Delhi, Delhi, India", height 6'0", profession
CA. The "DRAFT" badge appears in the header.

**Expected:** When the user is logged out, `/preview` should either gate
behind auth or render an empty/sample preview — not the previous user's
draft.

**Impact:** Anyone using the same physical device after a logged-out
session can see the prior user's draft biodata. Mild privacy leak.

**Fix sketch:** Either:
1. Gate `/preview` behind auth (redirect to `/onboarding` or `/biodata/personal` if no session).
2. Clear the persisted `bioDataSlice` on sign-out / before display when no Supabase session is present.

---

### P1-4: Onboarding "Dharm" screen offers Sikh, but landing page says "Sikh, Muslim & Christian coming soon"

**Where:**
- Landing page (`LandingPage.tsx`): copy says
  *"Sikh, Muslim & Christian communities coming soon"*.
- `DharmScreen.tsx` in the onboarding wizard: shows Hindu / Jain / **Sikh**
  as selectable. No Muslim/Christian (consistent with landing's coming-soon copy).

**Observed:** Inconsistent — Sikh is presented as available in onboarding
but "coming soon" on the landing page.

**Fix:** Either flip the landing copy ("Muslim & Christian coming soon")
or remove Sikh from the dharm screen until ready.

---

## P2 issues

### P2-1: Biodata UI divergence (onboarding lite vs full BioDataForm Step 1)

| Aspect | `/onboarding` FormScreen | `/biodata/personal` Step 1 |
| --- | --- | --- |
| Header chrome | Custom OnboardingHeader (rishte logo + small step ticks) | Global `<Header>` with "Home / Biodata / Preview / Shares / Sign in" nav |
| Page title | "Begin with the essentials" (eyebrow + Cormorant heading) | "Start with the essentials" (Cormorant) |
| Fields captured | 2: full name, DOB | 10: full name, DOB, phone, email, religion, caste, height, profession, education, income |
| Layout style | Single-column, narrow max-width, lots of vertical whitespace, accent ornament | Card-style form with `StepIndicator` ("Step 1 of 6") and `FormField` components |
| Primary button | Slate-900 / amber-50, uppercase, `tracking-[0.18em]` | Dark red (`rgb(122,20,24)`), white, no uppercase, no extra letter-spacing |
| Progress indicator | None (six dots in header) | "Step 1 of 6 — Personal 17%" with numbered chips |

**Both screens are intentional** — the wizard's FormScreen is a
2-field lite capture meant to land the user after Auth; the
BioDataForm/Step1 is the real 10-field editor. They share `bioDataSlice`,
so onboarding values prefill the full form.

**The actionable issue is the button styling divergence.** Slate-900
uppercase in onboarding vs dark-red sentence case in BioDataForm. Pick
one and harmonize. The wizard's Cormorant headings feel more on-brand
than the BioDataForm's generic forms; consider porting the wizard's
header / `Heading` / `Eyebrow` components into BioDataForm too.

---

### P2-2: Landing-page social-proof numbers look like placeholders

**Where:** `LandingPage.tsx` — "2,400+ Biodatas created" / "180+
Matchmakers using Rishte".

**Observed:** Rishte hasn't launched yet — these numbers can't be real.

**Fix:** Either back them with real telemetry (and link a methodology
page) or replace with non-numeric trust signals ("Trusted by Hindu & Jain
families across India" etc.). Inflated stats are a credibility risk for a
product whose value prop is *"we don't lie to you like matrimonial sites"*.

---

### P2-3: Landing page hero shows expired share date

**Where:** Landing page hero card — preview of "Priya Sharma" biodata
includes `"🔒 Private · Expires May 5"`.

**Observed:** Today is May 15, 2026. The hero preview shows an expiration
date in the past, suggesting a stale demo asset.

**Fix:** Hard-code a relative date or render `"Expires in 7 days"` so it
ages gracefully.

---

### P2-4: Onboarding wizard not crawlable

**Where:** No internal link points to `/onboarding` from the landing
page, nav, or sitemap. Only an inbound visitor with the URL gets there.

**Observed:** This compounds P1-2. If the wizard is the intended front
door, it should be reachable from the landing CTA *and* listed in
`scripts/generate-sitemap.mjs` so it's indexable.

---

### P2-5: Couldn't verify mobile viewport (Chrome restricted window resize)

**Where:** Audit gap — `resize_window` to 390×844 reported success but
`window.innerWidth` stayed at 1200. Mobile responsiveness was not
inspected. TesterArmy or you should walk the flow at real mobile widths
(iPhone 13 / Pixel 7) — this is the dominant viewport for the target
user (Hindi/Jain parents).

---

## Post-auth coverage (pending preview deploy)

The following must be tested once `rishte-api-preview` is live with the
test-phone bypass:

1. **Auth happy path** — phone bypass returns token_hash, Supabase
   session lands, header switches to authed nav.
2. **Auth edge cases** — wrong OTP (`/verify-otp` should 400), expired
   session (`requireAuth` middleware should 401), re-login same phone
   (Supabase upsert path).
3. **Both biodata flows end-to-end** — `/onboarding` lite form save
   ↔ `/biodata/*` full form read; verify the shared `bioDataSlice`.
4. **Each BioDataForm step** —
   - Step 1 Personal: validation on all 10 fields, especially phone/email/income.
   - Step 2 Photos: upload, delete, set primary, file-size limits, image-format limits.
   - Step 3 Family: siblings array, optional fields.
   - Step 4 Horoscope: geocoding lookup, kundli generation (calls AstroEngine), Manglik/Nadi outputs.
   - Step 5 Template: switching templates re-renders preview.
   - Step 6 Review: edit links jump back to right step.
5. **Share creation + public view** — `/shares` page, create token,
   open `/share/:token` in a private window, revoke, confirm 404.
6. **SEO OG rendering for shares** — vercel.json rewrites bot UAs to
   `/api/shares/:token/og`; spot-check with a Facebook UA.
7. **Mobile viewport** — entire flow at 390×844 and 360×800.

---

## Notes for TesterArmy

- Always reproduce against the preview URL once it's live, never prod.
- Each tester uses their own test phone (see `TESTERARMY.md`).
- Attach screenshot + console excerpt + network status to every report.
- For P0-1 / P0-2 — they're code/build fixes, not testable scenarios. They
  need an engineer pass before TesterArmy starts on content.

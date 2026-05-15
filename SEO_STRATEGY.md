# Rishte by Daanyam — SEO Strategy

**Version:** 1.0  
**Date:** May 2026  
**Scope:** Organic growth plan covering content, technical SEO, and Daanyam cross-linking

---

## 1. Situation Analysis

### What Rishte Is
A privacy-first matrimonial biodata platform. Users create biodatas, upload photos, and share them privately via tokens or email — no public profiles, no invasive matching algorithms.

### The SEO Challenge
Almost all valuable content (biodatas, photos, family details) lives behind authentication. The only public routes today are `/` (landing page) and `/share/:token` (individual biodata view, access-controlled). There's no indexable content beyond the homepage.

### The Opportunity
The Indian matrimonial search space is massive — ~60 million people actively searching for partners at any given time, ~12 million marriages per year. The "marriage biodata" keyword cluster alone has dozens of niche players ranking (biodatamaker.app, matrimonialbiodata.in, englishbiodata.com, etc.) — none of them have Daanyam's astrology engine or brand authority behind them.

### Competitive Landscape
**Big players (Shaadi.com, BharatMatrimony, Jeevansathi):** Own "matrimonial site" keywords. Rishte should NOT compete here — different product category entirely.

**Biodata makers (weddingbiodata.in, freebiodatamaker.com, simplebiodatamaker.in):** These are Rishte's direct competitors. They rank for "marriage biodata format", "biodata for marriage", etc. Most are simple template tools with no astrology, no privacy controls, no sharing features. Rishte can differentiate.

**Astrology sites (AstroSage, mPanchang, Astroyogi, Prokerala):** Own "kundli milan" and "gun milan" keywords. Daanyam already competes here. The cross-link strategy leverages this existing authority.

---

## 2. Content Pillar Strategy

### Pillar 1: Marriage Biodata Formats & Guides

**Why:** "Marriage biodata format" is the highest-intent keyword cluster for Rishte's exact use case. People searching this are literally about to create a biodata — they're one step away from becoming users.

**Pages to Build:**

| URL | Target Keyword | Content |
|-----|---------------|---------|
| `/biodata-format` | marriage biodata format | Master guide — what to include, dos/don'ts, examples |
| `/biodata-format/boy` | biodata format for marriage for boy | Tailored guide + sample for boys/grooms |
| `/biodata-format/girl` | biodata format for marriage for girl | Tailored guide + sample for girls/brides |
| `/biodata-format/marathi` | marathi marriage biodata format | Community-specific guide, Marathi sample text |
| `/biodata-format/gujarati` | gujarati biodata for marriage | Community-specific guide, Gujarati sample text |
| `/biodata-format/hindi` | hindi biodata format for marriage | Community-specific guide, Hindi sample text |
| `/biodata-format/muslim` | muslim marriage biodata format | Community-specific guide, nikah biodata |
| `/biodata-format/sikh` | sikh marriage biodata format | Community-specific guide, anand karaj context |

**CTA on every page:** "Create your biodata free on Rishte" → links to `/onboarding`

**Content depth:** Each page should be 800-1200 words. Include a visual sample biodata (rendered from Rishte's own templates — this doubles as product marketing). Community-specific pages should include cultural context (what that community expects, common fields, language considerations).

**Language strategy:** Primary content in English. Hindi secondary versions for the top 3-4 pages (`/hi/biodata-format`, `/hi/biodata-format/boy`, etc.). Do NOT build full Hindi mirrors of everything — focus English-first, add Hindi where search volume justifies it.

---

### Pillar 2: Vivah Muhurat & Wedding Planning

**Why:** Seasonal, high-volume queries that Daanyam already has authority in. Rishte can capture the "what's next after we pick the date" intent.

**Pages to Build:**

| URL | Target Keyword | Content |
|-----|---------------|---------|
| `/vivah-muhurat/2026` | vivah muhurat 2026 | Auspicious wedding dates for 2026, month-by-month |
| `/vivah-muhurat/2027` | shubh vivah muhurat 2027 | Same for 2027 (publish 3-4 months ahead) |
| `/wedding-checklist` | indian wedding checklist | Step-by-step shaadi planning guide |
| `/wedding-checklist/biodata` | how to make marriage biodata | From checklist item to biodata creation |

**Cross-link with Daanyam:** These pages should link to Daanyam's muhurat calculator for personalized date calculation. Daanyam's existing muhurat pages should link back to Rishte's biodata creation as the natural next step ("Found your date? Now share your biodata with prospective families").

**Refresh cadence:** Muhurat pages need annual updates. Build a template system — swap dates/nakshatras each year, keep the surrounding content stable.

---

### Pillar 3: Kundli Matching for Marriage (Cross-Link Hub)

**Why:** This is the bridge between Daanyam's astrology engine and Rishte's matrimonial flow. Rather than rebuilding matching tools on Rishte, we create content pages that educate and link out.

**Pages to Build:**

| URL | Target Keyword | Content |
|-----|---------------|---------|
| `/kundli-milan` | kundli milan for marriage | Explainer: what is kundli matching, how 36 gunas work, what scores mean |
| `/kundli-milan/ashtakoot` | ashtakoot matching | Deep-dive into the 8 koots, scoring breakdown |
| `/kundli-milan/manglik` | manglik dosha in marriage | What it is, remedies, how it affects matching |
| `/kundli-milan/nadi-dosha` | nadi dosha | Specific dosha explainer |

**Cross-link pattern:** Every page includes a prominent "Check your compatibility" button → links to `daanyam.in/kundli-milan` (Daanyam's interactive tool). Daanyam's tool results page includes a "Now create and share your biodata" CTA → links to `rishte.daanyam.in/onboarding`.

**Why not build the tool on Rishte?** Daanyam already has (or is building) the astrology engine. Duplicating it splits authority. Better to concentrate matching-tool SEO on Daanyam and use Rishte for the educational content that funnels users between the two.

---

### Pillar 4: Privacy & Modern Matchmaking

**Why:** Differentiator content. No other biodata platform talks about privacy — they're all "free template download" sites. This positions Rishte as the thoughtful, modern choice.

**Pages to Build:**

| URL | Target Keyword | Content |
|-----|---------------|---------|
| `/privacy-first-matchmaking` | safe matrimonial platform India | Why privacy matters in the biodata-sharing process |
| `/blog/why-not-matrimonial-sites` | alternative to shaadi.com | How Rishte differs from profile-listing matrimonial sites |
| `/blog/biodata-sharing-etiquette` | how to share marriage biodata | Dos and don'ts of sharing biodatas with families |
| `/blog/horoscope-privacy` | kundli privacy marriage | Why your birth details deserve protection |

**Tone:** Informational, not salesy. These are trust-building pages that also happen to rank for long-tail queries.

---

## 3. Daanyam <-> Rishte Cross-Link Architecture

### The Funnel

```
Daanyam (astrology, muhurat, festivals)
        |
        | "Found your match? Create your biodata"
        | "Wedding date set? Share your biodata"
        v
Rishte (biodata creation, sharing)
        |
        | "Check compatibility with Kundli Milan"  
        | "Find your vivah muhurat"
        v
Daanyam (kundli matching tool, muhurat calculator)
```

### Specific Link Placements

**On Daanyam (linking TO Rishte):**

1. **Kundli Milan results page** → "Ready to share your biodata? Create one on Rishte" (contextual CTA after showing compatibility score)
2. **Vivah Muhurat pages** → "Planning your wedding? Start with a beautiful biodata" (sidebar or bottom CTA)
3. **Festival pages with marriage context** (Akshaya Tritiya, Vasant Panchami, etc.) → "This is an auspicious time for marriage — create your biodata"
4. **Homepage footer** → "Rishte by Daanyam — Private Biodata Sharing" (permanent footer link)
5. **Navigation** → Add "Rishte" to Daanyam's main nav as a product link

**On Rishte (linking TO Daanyam):**

1. **Horoscope step** (`/biodata/horoscope`) → "Get your full Kundli on Daanyam" (contextual link while user is entering birth details)
2. **Kundli Milan content pages** → "Check compatibility now on Daanyam" (primary CTA)
3. **Vivah Muhurat pages** → "Calculate your personalized muhurat" → Daanyam's muhurat tool
4. **Landing page** → "Powered by Daanyam's Vedic Astrology Engine" (footer attribution + link)
5. **Template preview** → If horoscope data exists, show a "Kundli Milan compatibility" teaser linking to Daanyam

### Domain Strategy

**Recommended:** `rishte.daanyam.in` (subdomain)

This gives Rishte its own identity while inheriting some domain authority from `daanyam.in`. Search engines treat subdomains as semi-independent, so Rishte's content won't dilute Daanyam's astrology authority, but the brand association and cross-links will build topical relevance for both.

If already deployed as a separate domain, add a prominent "by Daanyam" footer link and ensure cross-links are in place.

---

## 4. Technical SEO Roadmap

### Priority 1: Fix the SPA Indexing Problem (Critical)

**Current state:** Rishte is a Vite + React SPA. Googlebot sees only the bare `index.html` shell with generic meta tags. None of the content pages will be indexed.

**Options (pick one):**

| Approach | Effort | Recommendation |
|----------|--------|----------------|
| **Vite SSR plugin** | Medium | Add `vite-plugin-ssr` or migrate to Vite 6 SSR. Renders public routes server-side. Keeps existing stack. |
| **Prerender at build time** | Low | Use `vite-plugin-prerender` to generate static HTML for the ~20 public content pages. Simplest option if content pages are relatively static. |
| **Migrate to Next.js** | High | Full SSR framework. Overkill if you only need 20 static pages indexed. |

**Recommendation:** Start with **prerendering** for the content pages (Pillar 1-4 URLs). These are static — they don't need real-time data. The app routes (`/dashboard`, `/biodata/*`, etc.) can stay client-rendered since they're behind auth anyway.

### Priority 2: Meta Tags & Open Graph (High)

**Landing page (`/`):**
```html
<title>Rishte by Daanyam — Private Marriage Biodata Creator</title>
<meta name="description" content="Create and share beautiful marriage biodatas with privacy controls. Free biodata maker with horoscope integration, powered by Daanyam's Vedic astrology." />
<meta property="og:title" content="Rishte by Daanyam — Private Marriage Biodata Creator" />
<meta property="og:description" content="Create and share beautiful marriage biodatas with complete privacy controls." />
<meta property="og:image" content="https://rishte.daanyam.in/og-image.png" />
<meta property="og:type" content="website" />
```

**Public share pages (`/share/:token`):**
These need dynamic meta tags based on the biodata's privacy settings. The server (or prerender) should inject:
- `og:title` → "[Name]'s Marriage Biodata" (if name is public)
- `og:description` → Brief summary (religion, age, location — based on what's not hidden)
- `og:image` → Profile photo thumbnail (if photo sharing is enabled) or a branded fallback image

This is critical for WhatsApp/social sharing — currently when someone shares a biodata link, it shows "Rishte by Daanyam" with no preview. A proper OG image with the person's name and photo will dramatically increase click-through.

**Content pages:**
Each content page needs its own unique title and description. Pattern:
- Title: `[Topic] — Rishte by Daanyam`
- Description: 150-160 char summary of the page content
- OG image: Branded template with the page title overlaid

### Priority 3: robots.txt & Sitemap (High)

**robots.txt** (create at `frontend/public/robots.txt`):
```
User-agent: *
Allow: /
Allow: /biodata-format/
Allow: /vivah-muhurat/
Allow: /kundli-milan/
Allow: /blog/
Allow: /privacy-first-matchmaking
Allow: /wedding-checklist

Disallow: /dashboard
Disallow: /biodata/
Disallow: /preview
Disallow: /shares
Disallow: /verify
Disallow: /onboarding

Sitemap: https://rishte.daanyam.in/sitemap.xml
```

**sitemap.xml:** Auto-generate at build time. Include all public content pages with `lastmod` dates. Do NOT include `/share/:token` pages (private by design).

### Priority 4: Structured Data / JSON-LD (Medium)

**Organization schema** (site-wide):
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Rishte by Daanyam",
  "url": "https://rishte.daanyam.in",
  "logo": "https://rishte.daanyam.in/logo.png",
  "parentOrganization": {
    "@type": "Organization",
    "name": "Daanyam",
    "url": "https://daanyam.in"
  },
  "sameAs": []
}
```

**Article schema** on content/blog pages. **FAQPage schema** on guide pages (biodata format guides naturally lend themselves to FAQ sections — "What should I include in a marriage biodata?", "How long should a biodata be?", etc.). FAQ schema gets rich snippets in Google results.

**SoftwareApplication schema** on the landing page:
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Rishte by Daanyam",
  "applicationCategory": "LifestyleApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "INR"
  }
}
```

### Priority 5: Performance & Core Web Vitals (Medium)

Current stack (Vite + React + Tailwind) is already lightweight. Key checks:
- Ensure images are served via Cloudflare R2 with proper caching headers and WebP format
- Lazy-load below-fold content on landing page
- Preload critical fonts (currently loading Google Fonts — consider self-hosting for speed)
- Target LCP < 2.5s, CLS < 0.1, INP < 200ms

---

## 5. Keyword Target Matrix

### Tier 1: High Intent, Direct Conversion (Build First)

| Keyword Cluster | Example Queries | Monthly Volume (Est.) | Difficulty | Rishte Page |
|----------------|----------------|----------------------|------------|-------------|
| Marriage biodata format | "marriage biodata format", "biodata for marriage" | 100K-500K | Medium | `/biodata-format` |
| Biodata format for boy | "biodata format for marriage for boy", "groom biodata" | 50K-100K | Medium | `/biodata-format/boy` |
| Biodata format for girl | "biodata format for marriage for girl", "bride biodata" | 50K-100K | Medium | `/biodata-format/girl` |
| Community-specific biodata | "marathi biodata format", "gujarati biodata" | 10K-50K each | Low-Medium | `/biodata-format/[community]` |

### Tier 2: High Volume, Cross-Link Value (Build Second)

| Keyword Cluster | Example Queries | Monthly Volume (Est.) | Difficulty | Page |
|----------------|----------------|----------------------|------------|------|
| Kundli milan | "kundli milan", "kundali matching" | 100K-500K | High | `/kundli-milan` → Daanyam |
| Gun milan | "gun milan", "36 gun match" | 50K-100K | High | `/kundli-milan/ashtakoot` → Daanyam |
| Vivah muhurat | "vivah muhurat 2026", "shubh vivah dates" | 50K-100K | Medium | `/vivah-muhurat/2026` |
| Manglik dosha | "manglik dosha marriage", "mangal dosha remedies" | 10K-50K | Medium | `/kundli-milan/manglik` → Daanyam |

### Tier 3: Long-Tail, Trust Building (Build Third)

| Keyword Cluster | Example Queries | Monthly Volume (Est.) | Difficulty | Page |
|----------------|----------------|----------------------|------------|------|
| Biodata sharing | "how to share biodata", "biodata WhatsApp" | 1K-10K | Low | `/blog/biodata-sharing-etiquette` |
| Privacy matchmaking | "safe matrimonial site", "private biodata sharing" | 1K-10K | Low | `/privacy-first-matchmaking` |
| Wedding planning | "indian wedding checklist", "shaadi preparation" | 10K-50K | Medium | `/wedding-checklist` |

---

## 6. Implementation Roadmap

### Phase 1: Foundation (Weeks 1-3)

- [ ] Set up prerendering for public routes (`vite-plugin-prerender`)
- [ ] Create `robots.txt` and `sitemap.xml`
- [ ] Add proper meta tags to landing page
- [ ] Add dynamic OG tags to `/share/:token` pages (requires backend endpoint or edge function)
- [ ] Add JSON-LD Organization schema site-wide
- [ ] Set up Google Search Console and submit sitemap

### Phase 2: Core Content (Weeks 4-8)

- [ ] Build Pillar 1 content pages (biodata format guides) — start with the master guide + boy/girl variants
- [ ] Build community-specific pages (Marathi, Gujarati, Hindi first — highest volume)
- [ ] Add FAQ sections with FAQPage schema
- [ ] Set up internal linking between content pages and the biodata creation flow
- [ ] Add Daanyam cross-links on Rishte content pages

### Phase 3: Cross-Link Activation (Weeks 6-10)

- [ ] Add Rishte CTAs on Daanyam's kundli milan results page
- [ ] Add Rishte CTAs on Daanyam's vivah muhurat pages
- [ ] Add Rishte to Daanyam's navigation/footer
- [ ] Build Pillar 3 content (kundli milan educational pages) on Rishte
- [ ] Build Pillar 2 content (vivah muhurat pages) on Rishte

### Phase 4: Growth Content (Weeks 10-16)

- [ ] Build Pillar 4 (privacy/modern matchmaking blog posts)
- [ ] Add Hindi versions of top 3-4 content pages
- [ ] Build vivah muhurat 2027 page (ahead of season)
- [ ] Add Muslim, Sikh, Christian community biodata pages
- [ ] Monitor Search Console data — double down on pages gaining traction

### Phase 5: Optimize & Scale (Ongoing)

- [ ] Monthly Search Console review — identify new keyword opportunities from impressions data
- [ ] A/B test meta titles and descriptions for CTR improvement
- [ ] Update muhurat pages annually
- [ ] Expand community-specific content based on demand signals
- [ ] Consider adding a `/success-stories` section for social proof (with user consent)

---

## 7. Measurement & KPIs

| Metric | Baseline (Now) | 3-Month Target | 6-Month Target |
|--------|----------------|----------------|----------------|
| Indexed pages | 1 (homepage) | 15-20 | 30+ |
| Organic monthly sessions | ~0 | 2,000-5,000 | 15,000-30,000 |
| Top 10 rankings | 0 | 5-10 keywords | 20-30 keywords |
| Biodata signups from organic | 0 | 100-200/month | 500-1,000/month |
| Cross-link clicks (Daanyam → Rishte) | 0 | Track baseline | 2x baseline |

**Tools to set up:** Google Search Console, Google Analytics 4 (or Plausible/Fathom for privacy-friendly analytics that aligns with brand), Daanyam's own analytics for cross-link tracking (UTM parameters: `?utm_source=daanyam&utm_medium=crosslink&utm_campaign=[page]`).

---

## 8. Quick Wins (Do This Week)

1. **Create `robots.txt`** — 5 minutes, unblocks crawling
2. **Fix the `<title>` tag** — currently generic "Rishte by Daanyam", should include keywords
3. **Add OG meta tags to `index.html`** — makes social sharing look professional immediately
4. **Submit to Google Search Console** — start collecting impression/click data now, even before content pages exist
5. **Add `rel="canonical"` to the homepage** — prevents duplicate content issues if accessed via multiple URLs

---

*This is a living document. Revisit monthly as Search Console data reveals what's working.*

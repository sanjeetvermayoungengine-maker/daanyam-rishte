/**
 * Central manifest of all SEO-targeted public content routes.
 *
 * Used by:
 *   - App.tsx       to register React routes
 *   - prerender.mjs to generate static HTML at build time
 *   - sitemap.mjs   to generate sitemap.xml
 *
 * Each entry maps a URL path to its meta tags. Keep this list in sync with the
 * `Allow:` directives in public/robots.txt.
 */

export const SITE_ORIGIN = "https://rishte.daanyam.in";
export const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/og-image.png`;

export type SeoRoute = {
  /** URL path beginning with "/" — e.g. "/biodata-format/boy" */
  path: string;
  /** <title> tag */
  title: string;
  /** <meta name="description"> — keep 150-160 chars */
  description: string;
  /** Optional, defaults to DEFAULT_OG_IMAGE */
  ogImage?: string;
  /** Sitemap priority 0.0–1.0 */
  priority?: number;
  /** Sitemap changefreq */
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  /** ISO date used for <lastmod>. Defaults to build date. */
  lastmod?: string;
};

export const SEO_ROUTES: SeoRoute[] = [
  // ─── Root ────────────────────────────────────────────────────────────────
  {
    path: "/",
    title: "Rishte by Daanyam — Private Marriage Biodata Creator",
    description:
      "Create and share beautiful marriage biodatas with privacy controls. Free biodata maker with horoscope integration, powered by Daanyam's Vedic astrology engine.",
    priority: 1.0,
    changefreq: "weekly",
  },

  // ─── Pillar 1: Biodata Formats ───────────────────────────────────────────
  {
    path: "/biodata-format",
    title: "Marriage Biodata Format — Complete Guide with Samples | Rishte by Daanyam",
    description:
      "Learn how to create the perfect marriage biodata. What to include, dos and don'ts, sample formats, and free templates for boys and girls. Make yours in minutes.",
    priority: 0.9,
    changefreq: "monthly",
  },
  {
    path: "/biodata-format/boy",
    title: "Biodata Format for Marriage for Boy — Sample & Template | Rishte by Daanyam",
    description:
      "Free biodata format for boys/grooms with sample text, what to write, and a downloadable template. Build a professional marriage biodata in 5 minutes.",
    priority: 0.85,
    changefreq: "monthly",
  },
  {
    path: "/biodata-format/girl",
    title: "Biodata Format for Marriage for Girl — Sample & Template | Rishte by Daanyam",
    description:
      "Free biodata format for girls/brides with sample text, family details guidance, and a beautiful template. Build a professional marriage biodata in 5 minutes.",
    priority: 0.85,
    changefreq: "monthly",
  },
  {
    path: "/biodata-format/marathi",
    title: "Marathi Marriage Biodata Format — Sample in Marathi | Rishte by Daanyam",
    description:
      "Marathi marriage biodata format with sample text in Marathi, what to include, and a culturally appropriate template. Create yours free.",
    priority: 0.8,
    changefreq: "monthly",
  },
  {
    path: "/biodata-format/gujarati",
    title: "Gujarati Biodata for Marriage — Sample Format | Rishte by Daanyam",
    description:
      "Gujarati biodata for marriage with sample format, family details guidance, and a beautiful template. Create your biodata free in minutes.",
    priority: 0.8,
    changefreq: "monthly",
  },
  {
    path: "/biodata-format/hindi",
    title: "Hindi Biodata Format for Marriage — विवाह बायोडाटा | Rishte by Daanyam",
    description:
      "Hindi biodata format for marriage with sample text in Hindi (Devanagari), family fields, and free template. Build a professional विवाह biodata in minutes.",
    priority: 0.8,
    changefreq: "monthly",
  },
  {
    path: "/biodata-format/muslim",
    title: "Muslim Marriage Biodata Format — Nikah Biodata Sample | Rishte by Daanyam",
    description:
      "Muslim marriage biodata format with sample text, nikah-appropriate fields, and a beautiful template. Create your biodata privately in minutes.",
    priority: 0.8,
    changefreq: "monthly",
  },
  {
    path: "/biodata-format/sikh",
    title: "Sikh Marriage Biodata Format — Anand Karaj Biodata | Rishte by Daanyam",
    description:
      "Sikh marriage biodata format with sample text, Anand Karaj context, and a culturally appropriate template. Create your biodata free in minutes.",
    priority: 0.8,
    changefreq: "monthly",
  },

  // ─── Pillar 2: Vivah Muhurat & Wedding Planning ──────────────────────────
  {
    path: "/vivah-muhurat/2026",
    title: "Vivah Muhurat 2026 — Auspicious Wedding Dates Month by Month | Rishte by Daanyam",
    description:
      "Complete list of vivah muhurat dates for 2026. Auspicious shubh wedding dates by month with nakshatra, tithi, and timing details. Powered by Daanyam.",
    priority: 0.85,
    changefreq: "monthly",
  },
  {
    path: "/vivah-muhurat/2027",
    title: "Shubh Vivah Muhurat 2027 — Auspicious Wedding Dates | Rishte by Daanyam",
    description:
      "Shubh vivah muhurat 2027 — auspicious wedding dates for the year ahead, month by month, with nakshatra and tithi. Powered by Daanyam.",
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/wedding-checklist",
    title: "Indian Wedding Checklist — Complete Shaadi Planning Guide | Rishte by Daanyam",
    description:
      "Step-by-step Indian wedding checklist covering pre-engagement to post-wedding. Vivah muhurat, biodata, kundli matching, and venue planning in one guide.",
    priority: 0.75,
    changefreq: "monthly",
  },
  {
    path: "/wedding-checklist/biodata",
    title: "How to Make a Marriage Biodata — Step-by-Step | Rishte by Daanyam",
    description:
      "Step-by-step guide to making a marriage biodata. What to include, photos, family details, horoscope. Create yours free on Rishte in 5 minutes.",
    priority: 0.75,
    changefreq: "monthly",
  },

  // ─── Pillar 3: Kundli Matching (cross-link hub) ──────────────────────────
  {
    path: "/kundli-milan",
    title: "Kundli Milan for Marriage — 36 Gunas Matching Guide | Rishte by Daanyam",
    description:
      "What is kundli milan, how 36 gunas (ashtakoot) matching works, what scores mean, and how to check compatibility. Check yours free on Daanyam.",
    priority: 0.85,
    changefreq: "monthly",
  },
  {
    path: "/kundli-milan/ashtakoot",
    title: "Ashtakoot Matching — 8 Koots & 36 Gunas Explained | Rishte by Daanyam",
    description:
      "Deep dive into ashtakoot matching — the 8 koots, gun milan scoring, and what a 36 gun match really means for marriage compatibility.",
    priority: 0.8,
    changefreq: "monthly",
  },
  {
    path: "/kundli-milan/manglik",
    title: "Manglik Dosha in Marriage — Effects & Remedies | Rishte by Daanyam",
    description:
      "What is Manglik (Mangal) dosha, how it affects marriage matching, types of manglik, and traditional remedies. Check your kundli on Daanyam.",
    priority: 0.8,
    changefreq: "monthly",
  },
  {
    path: "/kundli-milan/nadi-dosha",
    title: "Nadi Dosha in Kundli Milan — Meaning & Remedies | Rishte by Daanyam",
    description:
      "What is Nadi dosha in kundli milan, why it matters in the 8 gunas, exceptions, and remedies. Check your nadi compatibility free on Daanyam.",
    priority: 0.75,
    changefreq: "monthly",
  },

  // ─── Pillar 4: Privacy & Modern Matchmaking ──────────────────────────────
  {
    path: "/privacy-first-matchmaking",
    title: "Privacy-First Matchmaking — A Safer Way to Share Biodatas | Rishte by Daanyam",
    description:
      "Why privacy matters when sharing marriage biodatas. How Rishte protects your photos, horoscope, and contact details with per-share controls.",
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/blog/why-not-matrimonial-sites",
    title: "An Alternative to Shaadi.com — Why Rishte Is Different | Rishte by Daanyam",
    description:
      "How Rishte differs from profile-listing matrimonial sites like Shaadi.com or BharatMatrimony. Private biodata sharing, no public profiles, your terms.",
    priority: 0.6,
    changefreq: "monthly",
  },
  {
    path: "/blog/biodata-sharing-etiquette",
    title: "How to Share a Marriage Biodata — Etiquette & Best Practices | Rishte by Daanyam",
    description:
      "Dos and don'ts of sharing marriage biodatas with families on WhatsApp and email. Privacy tips, what to include, and what to keep private.",
    priority: 0.6,
    changefreq: "monthly",
  },
  {
    path: "/blog/horoscope-privacy",
    title: "Kundli Privacy — Why Your Birth Details Deserve Protection | Rishte by Daanyam",
    description:
      "Your birth time and horoscope are sensitive data. Why kundli privacy matters in matrimonial sharing, and how Rishte keeps it under your control.",
    priority: 0.6,
    changefreq: "monthly",
  },
];

/** Routes that should be statically prerendered (everything in SEO_ROUTES). */
export const PRERENDER_ROUTES = SEO_ROUTES.map((r) => r.path);

/** Look up SEO metadata by path. Returns the homepage entry as fallback. */
export function getSeoForPath(path: string): SeoRoute {
  const match = SEO_ROUTES.find((r) => r.path === path);
  if (match) return match;
  return SEO_ROUTES[0];
}

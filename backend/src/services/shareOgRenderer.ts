/**
 * Server-side HTML renderer for /share/:token requests from crawlers.
 *
 * When WhatsApp, Telegram, Twitter, Facebook, or another link-preview bot hits
 * a share URL, we return a tiny HTML document with proper OG/Twitter meta tags
 * derived from the biodata (respecting the share's privacy settings).
 *
 * Real users (non-crawler user agents) get redirected back to the frontend SPA,
 * which fetches the data via API and renders the full interactive view.
 */

import type { BioDataSnapshot, SharePermissions, ShareRecord } from "../types/share.js";

/** User-agent fragments that indicate a link-preview crawler. */
const CRAWLER_UA_FRAGMENTS = [
  "facebookexternalhit",
  "Facebot",
  "Twitterbot",
  "WhatsApp",
  "TelegramBot",
  "LinkedInBot",
  "Slackbot",
  "Discordbot",
  "Pinterest",
  "Googlebot",
  "Bingbot",
  "DuckDuckBot",
  "Applebot",
  "YandexBot",
  "Baiduspider",
];

export function isCrawlerUserAgent(userAgent: string | undefined | null): boolean {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return CRAWLER_UA_FRAGMENTS.some((fragment) => ua.includes(fragment.toLowerCase()));
}

/** HTML-escape a string for safe inlining in attributes / text. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Truncate to a sensible OG description length. */
function clampDescription(value: string, max = 200): string {
  if (value.length <= max) return value;
  return value.slice(0, max - 1).trimEnd() + "…";
}

const SITE_ORIGIN = process.env.PUBLIC_SITE_ORIGIN ?? "https://rishte.daanyam.in";
const FALLBACK_OG_IMAGE = `${SITE_ORIGIN}/og-image.png`;

type OgPayload = {
  title: string;
  description: string;
  image: string;
  url: string;
};

export function buildOgPayload(opts: {
  token: string;
  share: ShareRecord;
  bioData: BioDataSnapshot;
}): OgPayload {
  const { token, share, bioData } = opts;
  const permissions: SharePermissions = share.permissions;

  // Name: shown only if basic details are permitted
  const fullName =
    permissions.viewBasic && bioData.personalDetails?.fullName?.trim()
      ? bioData.personalDetails.fullName.trim()
      : null;

  // Photo: only if photo sharing is enabled and there's a primary photo
  let image = FALLBACK_OG_IMAGE;
  if (permissions.viewPhotos && bioData.photos?.items?.length > 0) {
    const primary =
      bioData.photos.items.find((p) => p.id === bioData.photos.primaryPhotoId) ?? bioData.photos.items[0];
    if (primary?.url) {
      // For data: URLs (base64 photos still in DB), use fallback to avoid huge OG images
      image = primary.url.startsWith("data:") ? FALLBACK_OG_IMAGE : primary.url;
    }
  }

  // Title
  const title = fullName ? `${fullName}'s Marriage Biodata — Rishte by Daanyam` : "A Marriage Biodata — Rishte by Daanyam";

  // Description — show what's visible without revealing private fields
  const summaryParts: string[] = [];
  if (permissions.viewBasic) {
    if (bioData.personalDetails?.age) summaryParts.push(`Age ${bioData.personalDetails.age}`);
    if (bioData.personalDetails?.religion) summaryParts.push(bioData.personalDetails.religion);
    if (bioData.personalDetails?.education) summaryParts.push(bioData.personalDetails.education);
    if (bioData.personalDetails?.currentCity) summaryParts.push(bioData.personalDetails.currentCity);
  }
  const summary = summaryParts.length > 0
    ? summaryParts.join(" · ")
    : "View this private marriage biodata, shared privately via Rishte by Daanyam.";

  const description = clampDescription(summary);

  return {
    title,
    description,
    image,
    url: `${SITE_ORIGIN}/share/${token}`,
  };
}

/**
 * Build the HTML document returned to crawlers. The body contains a minimal
 * fallback (in case a real user lands here without JS) plus a meta-refresh to
 * the actual app URL for non-crawler followups.
 */
export function renderShareOgHtml(payload: OgPayload): string {
  const t = escapeHtml(payload.title);
  const d = escapeHtml(payload.description);
  const i = escapeHtml(payload.image);
  const u = escapeHtml(payload.url);

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${t}</title>
    <meta name="description" content="${d}" />
    <meta name="robots" content="noindex, nofollow" />
    <link rel="canonical" href="${u}" />

    <meta property="og:type" content="profile" />
    <meta property="og:site_name" content="Rishte by Daanyam" />
    <meta property="og:title" content="${t}" />
    <meta property="og:description" content="${d}" />
    <meta property="og:url" content="${u}" />
    <meta property="og:image" content="${i}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:locale" content="en_IN" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${t}" />
    <meta name="twitter:description" content="${d}" />
    <meta name="twitter:image" content="${i}" />
  </head>
  <body>
    <p>This is a private biodata shared via <a href="${escapeHtml(SITE_ORIGIN)}">Rishte by Daanyam</a>.</p>
    <p>Open the full biodata: <a href="${u}">${u}</a></p>
  </body>
</html>`;
}

/** Tiny HTML returned when the share is missing / expired / revoked. */
export function renderShareErrorOgHtml(opts: { token: string; reason: "not_found" | "expired" | "revoked" }): string {
  const url = `${SITE_ORIGIN}/share/${opts.token}`;
  const headline =
    opts.reason === "not_found"
      ? "Biodata not found"
      : opts.reason === "expired"
        ? "This biodata link has expired"
        : "This biodata link is no longer active";
  return renderShareOgHtml({
    title: `${headline} — Rishte by Daanyam`,
    description: "Please ask the sender for a fresh link, or create your own biodata on Rishte.",
    image: FALLBACK_OG_IMAGE,
    url,
  });
}

import { Route, Routes } from "react-router-dom";
import type { ReactElement } from "react";

/**
 * All public content routes, registered in one place.
 *
 * Mounted by:
 *   - App.tsx (client SPA)              — spreads `contentRouteEntries` into its top-level <Routes>
 *   - prerenderEntry.tsx (build-time)   — uses <ContentRoutes /> directly under <StaticRouter>
 *
 * Each page is a standalone React tree that uses <ContentLayout> and renders
 * synchronously from props — no API calls, no auth, no Redux. This keeps the
 * prerender safe to run in plain Node.
 */

import { BiodataFormatMaster } from "../pages/content/BiodataFormatMaster";
import { BiodataFormatBoy } from "../pages/content/BiodataFormatBoy";
import { BiodataFormatGirl } from "../pages/content/BiodataFormatGirl";
import { BiodataFormatMarathi } from "../pages/content/BiodataFormatMarathi";
import { BiodataFormatGujarati } from "../pages/content/BiodataFormatGujarati";
import { BiodataFormatHindi } from "../pages/content/BiodataFormatHindi";
import { BiodataFormatMuslim } from "../pages/content/BiodataFormatMuslim";
import { BiodataFormatSikh } from "../pages/content/BiodataFormatSikh";
import { VivahMuhurat2026 } from "../pages/content/VivahMuhurat2026";
import { VivahMuhurat2027 } from "../pages/content/VivahMuhurat2027";
import { WeddingChecklist } from "../pages/content/WeddingChecklist";
import { WeddingChecklistBiodata } from "../pages/content/WeddingChecklistBiodata";
import { KundliMilan } from "../pages/content/KundliMilan";
import { KundliMilanAshtakoot } from "../pages/content/KundliMilanAshtakoot";
import { KundliMilanManglik } from "../pages/content/KundliMilanManglik";
import { KundliMilanNadiDosha } from "../pages/content/KundliMilanNadiDosha";
import { PrivacyFirstMatchmaking } from "../pages/content/PrivacyFirstMatchmaking";
import { BlogWhyNotMatrimonialSites } from "../pages/content/BlogWhyNotMatrimonialSites";
import { BlogBiodataSharingEtiquette } from "../pages/content/BlogBiodataSharingEtiquette";
import { BlogHoroscopePrivacy } from "../pages/content/BlogHoroscopePrivacy";

export type ContentRouteEntry = { path: string; element: ReactElement };

export const contentRouteEntries: ContentRouteEntry[] = [
  { path: "/biodata-format", element: <BiodataFormatMaster /> },
  { path: "/biodata-format/boy", element: <BiodataFormatBoy /> },
  { path: "/biodata-format/girl", element: <BiodataFormatGirl /> },
  { path: "/biodata-format/marathi", element: <BiodataFormatMarathi /> },
  { path: "/biodata-format/gujarati", element: <BiodataFormatGujarati /> },
  { path: "/biodata-format/hindi", element: <BiodataFormatHindi /> },
  { path: "/biodata-format/muslim", element: <BiodataFormatMuslim /> },
  { path: "/biodata-format/sikh", element: <BiodataFormatSikh /> },

  { path: "/vivah-muhurat/2026", element: <VivahMuhurat2026 /> },
  { path: "/vivah-muhurat/2027", element: <VivahMuhurat2027 /> },
  { path: "/wedding-checklist", element: <WeddingChecklist /> },
  { path: "/wedding-checklist/biodata", element: <WeddingChecklistBiodata /> },

  { path: "/kundli-milan", element: <KundliMilan /> },
  { path: "/kundli-milan/ashtakoot", element: <KundliMilanAshtakoot /> },
  { path: "/kundli-milan/manglik", element: <KundliMilanManglik /> },
  { path: "/kundli-milan/nadi-dosha", element: <KundliMilanNadiDosha /> },

  { path: "/privacy-first-matchmaking", element: <PrivacyFirstMatchmaking /> },
  { path: "/blog/why-not-matrimonial-sites", element: <BlogWhyNotMatrimonialSites /> },
  { path: "/blog/biodata-sharing-etiquette", element: <BlogBiodataSharingEtiquette /> },
  { path: "/blog/horoscope-privacy", element: <BlogHoroscopePrivacy /> },
];

/** The set of path prefixes that should NOT show the SPA's global <Header>. */
export const CONTENT_PATH_PREFIXES = [
  "/biodata-format",
  "/vivah-muhurat",
  "/wedding-checklist",
  "/kundli-milan",
  "/privacy-first-matchmaking",
  "/blog/",
];

export function isContentPath(pathname: string): boolean {
  return CONTENT_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/") || pathname.startsWith(prefix)
  );
}

/** Self-contained <Routes> used by the prerenderer (it has its own StaticRouter). */
export function ContentRoutes() {
  return (
    <Routes>
      {contentRouteEntries.map((r) => (
        <Route key={r.path} path={r.path} element={r.element} />
      ))}
    </Routes>
  );
}

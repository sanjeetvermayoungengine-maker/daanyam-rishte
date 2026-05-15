/**
 * Verifies the SEO build output. Run after `npm run build`.
 *
 *   node scripts/verify-seo.mjs
 *
 * Checks:
 *   ✓ dist/robots.txt exists and has Sitemap directive
 *   ✓ dist/sitemap.xml exists and contains every SEO_ROUTES entry
 *   ✓ Every SEO_ROUTES path has a generated index.html
 *   ✓ Each generated index.html has <title>, description, canonical, og:title
 *   ✓ Generated tags match the manifest (sanity check)
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import * as esbuild from "esbuild";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const distDir = path.join(root, "dist");

const tmpFile = path.join("/tmp", `rishte-verify-routes-${Date.now()}.mjs`);
await esbuild.build({
  entryPoints: [path.join(root, "src/seo/routes.ts")],
  outfile: tmpFile,
  bundle: true,
  format: "esm",
  platform: "node",
  target: "node18",
  logLevel: "silent",
});
const { SEO_ROUTES, SITE_ORIGIN } = await import(pathToFileURL(tmpFile).href);

let failures = 0;
const log = {
  ok: (m) => console.log(`  ✓ ${m}`),
  fail: (m) => {
    failures++;
    console.error(`  ✗ ${m}`);
  },
};

console.log("\n[verify-seo] dist/ checks");

// 1. robots.txt
const robotsPath = path.join(distDir, "robots.txt");
if (!fs.existsSync(robotsPath)) {
  log.fail("dist/robots.txt missing — copy from public/robots.txt");
} else {
  const robots = fs.readFileSync(robotsPath, "utf8");
  if (robots.includes("Sitemap:")) log.ok("robots.txt has Sitemap directive");
  else log.fail("robots.txt missing Sitemap directive");
  if (robots.includes("Disallow: /share/")) log.ok("robots.txt disallows /share/");
  else log.fail("robots.txt missing /share/ disallow");
}

// 2. sitemap.xml
const sitemapPath = path.join(distDir, "sitemap.xml");
if (!fs.existsSync(sitemapPath)) {
  log.fail("dist/sitemap.xml missing — run scripts/generate-sitemap.mjs");
} else {
  const xml = fs.readFileSync(sitemapPath, "utf8");
  for (const r of SEO_ROUTES) {
    const url = `${SITE_ORIGIN}${r.path === "/" ? "/" : r.path}`;
    if (xml.includes(`<loc>${url}</loc>`)) log.ok(`sitemap has ${url}`);
    else log.fail(`sitemap missing ${url}`);
  }
}

// 3. Per-route HTML
console.log("\n[verify-seo] prerendered HTML checks");
for (const r of SEO_ROUTES) {
  const htmlPath =
    r.path === "/"
      ? path.join(distDir, "index.html")
      : path.join(distDir, r.path.replace(/^\/+/, ""), "index.html");
  if (!fs.existsSync(htmlPath)) {
    log.fail(`${r.path}  →  missing ${path.relative(root, htmlPath)}`);
    continue;
  }
  const html = fs.readFileSync(htmlPath, "utf8");
  const htmlIncludesDesc = (snippet) =>
    html.includes(snippet) ||
    html.includes(snippet.replace(/'/g, "&#39;").replace(/"/g, "&quot;"));
  const expectedCanonical = `${SITE_ORIGIN}${r.path === "/" ? "/" : r.path}`;
  const checks = [
    { label: "title", ok: html.includes(`<title>${r.title.replace(/&/g, "&amp;")}`) || html.includes(`<title>${r.title}`) },
    { label: "description", ok: html.includes(`name="description"`) && htmlIncludesDesc(r.description.slice(0, 50)) },
    { label: "canonical", ok: html.includes(`rel="canonical"`) && html.includes(`href="${expectedCanonical}"`) },
    { label: "og:title", ok: html.includes(`property="og:title"`) },
    { label: "og:image", ok: html.includes(`property="og:image"`) },
    { label: "twitter:card", ok: html.includes(`name="twitter:card"`) },
  ];
  const allOk = checks.every((c) => c.ok);
  if (allOk) {
    log.ok(`${r.path}`);
  } else {
    const missing = checks.filter((c) => !c.ok).map((c) => c.label).join(", ");
    log.fail(`${r.path}  →  missing: ${missing}`);
  }
}

console.log("");
if (failures > 0) {
  console.error(`[verify-seo] ${failures} check(s) failed`);
  process.exit(1);
} else {
  console.log("[verify-seo] all checks passed ✓");
}

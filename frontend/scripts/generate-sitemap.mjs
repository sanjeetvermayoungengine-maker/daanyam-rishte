/**
 * Generates dist/sitemap.xml from src/seo/routes.ts.
 *
 * Run after build:  node scripts/generate-sitemap.mjs
 * Wired into npm run build via the package.json `build` script.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import * as esbuild from "esbuild";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const distDir = path.join(root, "dist");

// Transpile routes.ts and import it
const tmpRoutesFile = path.join("/tmp", `rishte-sitemap-routes-${Date.now()}.mjs`);
await esbuild.build({
  entryPoints: [path.join(root, "src/seo/routes.ts")],
  outfile: tmpRoutesFile,
  bundle: true,
  format: "esm",
  platform: "node",
  target: "node18",
  logLevel: "silent",
});
const { SEO_ROUTES, SITE_ORIGIN } = await import(pathToFileURL(tmpRoutesFile).href);

const today = new Date().toISOString().slice(0, 10);

const urls = SEO_ROUTES.map((route) => {
  const loc = `${SITE_ORIGIN}${route.path === "/" ? "/" : route.path}`;
  const lastmod = route.lastmod ?? today;
  const changefreq = route.changefreq ?? "monthly";
  const priority = (route.priority ?? 0.5).toFixed(2);
  return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}).join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}
const outPath = path.join(distDir, "sitemap.xml");
fs.writeFileSync(outPath, xml, "utf8");
console.log(`[sitemap] wrote ${SEO_ROUTES.length} URLs → ${path.relative(root, outPath)}`);

function escapeXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

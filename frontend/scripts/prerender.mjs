/**
 * Static prerender for Rishte's public SEO content routes.
 *
 * Runs AFTER `vite build` (or the esbuild fallback) has populated `dist/`.
 * For each route in src/seo/routes.ts it:
 *   1. Server-renders the page content (a standalone React tree, no Auth/Redux)
 *   2. Builds a full HTML document with proper title/meta/OG/canonical tags
 *   3. Writes the result to `dist/<route>/index.html`
 *
 * The static HTML hydrates client-side as the SPA boots — the existing
 * <div id="root"> mount point picks up where SSR left off.
 *
 * Run with: node scripts/prerender.mjs
 * Wired into `npm run build` via the package.json `build` script.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const distDir = path.join(root, "dist");
const templatePath = path.join(distDir, "index.html");

if (!fs.existsSync(templatePath)) {
  console.error("[prerender] dist/index.html not found — run `vite build` first.");
  process.exit(1);
}

const template = fs.readFileSync(templatePath, "utf8");

// ─── Load routes manifest via TS → JS transpile ───────────────────────────
// We can't `import` TypeScript directly from a Node script without a loader.
// Instead, we use esbuild (already a dev-dep) to transpile routes.ts on the
// fly into a temp file and import that.
import * as esbuild from "esbuild";

const cacheDir = path.join(root, ".cache");
fs.mkdirSync(cacheDir, { recursive: true });
const tmpRoutesFile = path.join(cacheDir, `rishte-seo-routes-${Date.now()}.mjs`);
await esbuild.build({
  entryPoints: [path.join(root, "src/seo/routes.ts")],
  outfile: tmpRoutesFile,
  bundle: true,
  format: "esm",
  platform: "node",
  target: "node18",
  logLevel: "silent",
});
const { SEO_ROUTES, SITE_ORIGIN, DEFAULT_OG_IMAGE } = await import(pathToFileURL(tmpRoutesFile).href);

// ─── Helpers ──────────────────────────────────────────────────────────────
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderMetaBlock(route) {
  const canonical = `${SITE_ORIGIN}${route.path === "/" ? "/" : route.path}`;
  const ogImage = route.ogImage ?? DEFAULT_OG_IMAGE;
  const title = escapeHtml(route.title);
  const desc = escapeHtml(route.description);
  const url = escapeHtml(canonical);
  const img = escapeHtml(ogImage);

  return `
    <title>${title}</title>
    <meta name="description" content="${desc}" />
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Rishte by Daanyam" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${desc}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${img}" />
    <meta property="og:locale" content="en_IN" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${desc}" />
    <meta name="twitter:image" content="${img}" />`;
}

/**
 * Replace the meta block in the index.html template with route-specific tags.
 *
 * The template (frontend/index.html) has its own defaults. We swap them out
 * by removing the default <title>, description, canonical, og:*, twitter:*
 * tags and injecting fresh ones before </head>.
 */
function applyMeta(html, route) {
  let out = html;
  // Remove existing managed tags from the template
  out = out.replace(/<title>[\s\S]*?<\/title>/i, "");
  out = out.replace(/<meta\s+name="description"[^>]*>/gi, "");
  out = out.replace(/<meta\s+name="keywords"[^>]*>/gi, "");
  out = out.replace(/<link\s+rel="canonical"[^>]*>/gi, "");
  out = out.replace(/<meta\s+property="og:[^"]+"[^>]*>/gi, "");
  out = out.replace(/<meta\s+name="twitter:[^"]+"[^>]*>/gi, "");

  // Inject the fresh meta block just before </head>
  out = out.replace("</head>", `${renderMetaBlock(route)}\n  </head>`);
  return out;
}

/**
 * Render the page's static HTML body into the <div id="root">.
 * Uses dynamic import of React + ReactDOMServer from node_modules.
 */
async function renderRouteHTML(route) {
  // Skip prerendering the homepage body — it's the existing SPA landing page
  // with interactive bits (audience switcher, scroll triggers). Leave it to
  // client render; we still get the meta tags injected from the meta block.
  if (route.path === "/") return "";

  // Import compiled content pages registry
  const { renderContentRoute } = await loadContentRenderer();
  try {
    return renderContentRoute(route.path);
  } catch (err) {
    console.warn(`[prerender] could not render ${route.path}: ${err.message}`);
    return "";
  }
}

let _contentRenderer = null;
async function loadContentRenderer() {
  if (_contentRenderer) return _contentRenderer;

  const cacheDir = path.join(root, ".cache");
  fs.mkdirSync(cacheDir, { recursive: true });
  const tmpRendererFile = path.join(cacheDir, `rishte-content-renderer-${Date.now()}.mjs`);

  // Bundle the renderer entrypoint, externalizing React so we use the
  // installed copy from node_modules.
  await esbuild.build({
    entryPoints: [path.join(root, "src/seo/prerenderEntry.tsx")],
    outfile: tmpRendererFile,
    bundle: true,
    format: "esm",
    platform: "node",
    target: "node18",
    jsx: "automatic",
    loader: { ".ts": "ts", ".tsx": "tsx", ".css": "empty", ".png": "empty", ".jpg": "empty", ".svg": "empty" },
    external: ["react", "react-dom", "react-dom/server", "react-router", "react-router-dom"],
    logLevel: "warning",
  });

  _contentRenderer = await import(pathToFileURL(tmpRendererFile).href);
  return _contentRenderer;
}

// ─── Main loop ────────────────────────────────────────────────────────────
let prerenderedCount = 0;
for (const route of SEO_ROUTES) {
  const bodyHTML = await renderRouteHTML(route);
  let html = applyMeta(template, route);

  if (bodyHTML) {
    // Inject server-rendered content into <div id="root"> for SEO/initial paint
    html = html.replace(
      /<div id="root">\s*<\/div>/,
      `<div id="root">${bodyHTML}</div>`
    );
  }

  // Compute output path: "/foo/bar" → dist/foo/bar/index.html
  // "/" stays as dist/index.html
  const outPath = route.path === "/"
    ? path.join(distDir, "index.html")
    : path.join(distDir, route.path.replace(/^\/+/, ""), "index.html");

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html, "utf8");
  prerenderedCount++;
  console.log(`[prerender] ✓ ${route.path}  →  ${path.relative(root, outPath)}`);
}

console.log(`[prerender] generated ${prerenderedCount} static page(s)`);

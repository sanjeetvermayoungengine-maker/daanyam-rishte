/**
 * Standalone esbuild bundler for the frontend.
 * Used when the Vite/rollup production build is unavailable (e.g. sandbox with
 * macOS-installed node_modules running on Linux arm64 where the rollup native
 * binary is absent).
 *
 * Produces the same output structure as `vite build`:
 *   dist/index.html
 *   dist/assets/index-<hash>.js
 *   dist/assets/index-<hash>.css
 */

import * as esbuild from 'esbuild';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

// Write to a temp dir then copy — avoids EPERM on read-only macOS-installed dist/
const tmpOut = path.join('/tmp', 'biodata-frontend-build');
const tmpAssets = path.join(tmpOut, 'assets');
fs.rmSync(tmpOut, { recursive: true, force: true });
fs.mkdirSync(tmpAssets, { recursive: true });

// VITE_* env var defines
const envDefines = {
  'import.meta.env.MODE': JSON.stringify('production'),
  'import.meta.env.PROD': 'true',
  'import.meta.env.DEV': 'false',
  'import.meta.env.SSR': 'false',
  'process.env.NODE_ENV': JSON.stringify('production'),
};
for (const [k, v] of Object.entries(process.env)) {
  if (k.startsWith('VITE_')) {
    envDefines[`import.meta.env.${k}`] = JSON.stringify(v);
  }
}
const envFile = path.join(root, '.env');
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, 'utf8').split('\n')) {
    const m = line.match(/^(VITE_\w+)=(.*)$/);
    if (m && !((`import.meta.env.${m[1]}`) in envDefines)) {
      envDefines[`import.meta.env.${m[1]}`] = JSON.stringify(m[2].trim());
    }
  }
}

console.log('Building frontend with esbuild…');

// Build with write: true into the temp outdir so CSS is handled as a file
const result = await esbuild.build({
  entryPoints: [{ in: path.join(root, 'src/main.tsx'), out: 'index' }],
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2020', 'chrome90', 'firefox88', 'safari14'],
  splitting: false,
  minify: true,
  sourcemap: false,
  outdir: tmpAssets,
  loader: {
    '.tsx': 'tsx',
    '.ts': 'ts',
    '.jsx': 'jsx',
    '.js': 'js',
    '.css': 'css',
    '.svg': 'dataurl',
    '.png': 'dataurl',
    '.jpg': 'dataurl',
    '.woff': 'dataurl',
    '.woff2': 'dataurl',
  },
  jsx: 'automatic',
  define: envDefines,
  metafile: true,
});

if (result.errors.length) {
  for (const e of result.errors) console.error('[esbuild error]', e.text, e.location);
  process.exit(1);
}

// Rename output files to content-hashed names
const distDir = path.join(root, 'dist');
const distAssets = path.join(distDir, 'assets');
fs.mkdirSync(distAssets, { recursive: true });

let jsFileName = '';
let cssFileName = '';
for (const file of fs.readdirSync(tmpAssets)) {
  const src = path.join(tmpAssets, file);
  const content = fs.readFileSync(src);
  const hash = crypto.createHash('sha256').update(content).digest('hex').slice(0, 8);
  const ext = path.extname(file);
  const hashed = `index-${hash}${ext}`;
  fs.writeFileSync(path.join(distAssets, hashed), content);
  if (ext === '.js')  jsFileName  = hashed;
  if (ext === '.css') cssFileName = hashed;
  console.log(`  wrote dist/assets/${hashed} (${(content.length / 1024).toFixed(1)} kB)`);
}

// Emit index.html
const htmlTemplate = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const html = htmlTemplate
  .replace('<script type="module" src="/src/main.tsx"></script>', '')
  .replace('</head>', (cssFileName ? `  <link rel="stylesheet" href="/assets/${cssFileName}">\n` : '') + '</head>')
  .replace('</body>', `  <script type="module" src="/assets/${jsFileName}"></script>\n</body>`);
fs.writeFileSync(path.join(distDir, 'index.html'), html);
console.log('  wrote dist/index.html');

fs.writeFileSync(
  path.join(distDir, 'build-meta.json'),
  JSON.stringify({
    bundler: 'esbuild',
    inputs: Object.keys(result.metafile.inputs).length,
    outputs: [jsFileName, cssFileName].filter(Boolean),
  }, null, 2)
);

console.log(`✓ esbuild build complete (${Object.keys(result.metafile.inputs).length} modules)`);

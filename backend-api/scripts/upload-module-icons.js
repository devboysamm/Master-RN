#!/usr/bin/env node
/*
 * Upload PNG icons in mobile-app/assets/module-icons/ to each module's
 * image_url as a base64 data URI.
 *
 * Usage:
 *   node scripts/upload-module-icons.js https://api.masterreactnative.dev
 *
 * Matching:
 *   File "01-javascript-essentials.png" → module ranked 1st by order_index.
 *   "02-..." → 2nd, and so on. Files are matched purely on their leading
 *   numeric prefix.
 *
 * Requirements on the backend:
 *   - image_url column must be wide enough for base64 PNG data URIs (LONGTEXT)
 *   - validator must accept data:image/png URIs
 *   Both are already in this repo; production needs the latest deploy.
 */

const fs = require('fs');
const path = require('path');

const baseUrl = process.argv[2];
if (!baseUrl) {
  console.error('Usage: node scripts/upload-module-icons.js <base-url>');
  console.error('Example: node scripts/upload-module-icons.js http://localhost:5000');
  process.exit(1);
}

const ICON_DIR = path.resolve(__dirname, '..', '..', 'mobile-app', 'assets', 'module-icons');

async function api(method, route, body) {
  const url = `${baseUrl.replace(/\/$/, '')}${route}`;
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = { raw: text }; }
  if (!res.ok || json?.success === false) {
    throw new Error(`${method} ${route} → ${res.status}: ${json?.message || text.slice(0, 200)}`);
  }
  return json?.data ?? json;
}

function dataUriFor(filePath) {
  const buf = fs.readFileSync(filePath);
  const base64 = buf.toString('base64');
  return `data:image/png;base64,${base64}`;
}

async function main() {
  if (!fs.existsSync(ICON_DIR)) {
    throw new Error(`Icon directory not found: ${ICON_DIR}`);
  }

  const files = fs.readdirSync(ICON_DIR)
    .filter((f) => /^(\d{2})-.*\.png$/i.test(f))
    .map((f) => ({
      file: f,
      n: Number(f.slice(0, 2)),
      path: path.join(ICON_DIR, f),
    }))
    .sort((a, b) => a.n - b.n);

  if (files.length === 0) {
    throw new Error(`No PNG files matching NN-*.png found in ${ICON_DIR}`);
  }

  console.log(`\nFound ${files.length} icons in ${ICON_DIR}`);
  console.log(`Target API: ${baseUrl}\n`);

  const modules = await api('GET', '/api/modules');
  // Sort modules by order_index (with id as tiebreaker) so position 1 = order 1.
  const sorted = [...modules].sort((a, b) => (a.order_index - b.order_index) || (a.id - b.id));
  console.log(`Loaded ${sorted.length} modules from API.\n`);

  let uploaded = 0;
  let skipped = 0;
  const failures = [];

  for (const f of files) {
    const idx = f.n - 1;
    const mod = sorted[idx];
    if (!mod) {
      console.warn(`⚠ ${f.file}: no module at position ${f.n}`);
      skipped++;
      continue;
    }
    const uri = dataUriFor(f.path);
    const sizeKb = (uri.length / 1024).toFixed(1);
    try {
      await api('PUT', `/api/modules/${mod.id}`, { image_url: uri });
      console.log(`✓ ${f.file}  →  #${idx + 1} ${mod.title}  (id=${mod.id}, ${sizeKb} KB data URI)`);
      uploaded++;
    } catch (e) {
      console.error(`✗ ${f.file}  →  ${mod.title}: ${e.message}`);
      failures.push({ file: f.file, module: mod.title, error: e.message });
      skipped++;
    }
  }

  console.log(`\nDone. Uploaded ${uploaded}, skipped ${skipped}.`);
  if (failures.length) {
    console.log('\nFailures:');
    for (const f of failures) console.log(`  - ${f.file}: ${f.error}`);
  }
}

main().catch((e) => {
  console.error(`\n✗ Failed: ${e.message}\n`);
  process.exit(1);
});

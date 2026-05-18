#!/usr/bin/env node
/*
 * Generate 17 unique geometric SVG icons for the curriculum modules,
 * save them as static files under public/icons/<slug>.svg, AND PUT each
 * module's image_url to its data:image/svg+xml URI.
 *
 * Usage:
 *   node scripts/upload-icons.js https://api.masterreactnative.dev
 *   node scripts/upload-icons.js http://localhost:5000
 *
 * After deploy the static files are also reachable at
 *   <baseUrl>/icons/<slug>.svg
 * so future scripts can point image_url at those URLs instead.
 *
 * Requires Node 18+ for built-in fetch.
 */

const fs = require('fs');
const path = require('path');

// Args: <baseUrl> [--mode=data|static]
const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const flags = Object.fromEntries(
  process.argv.slice(2).filter((a) => a.startsWith('--')).map((a) => {
    const [k, v = 'true'] = a.replace(/^--/, '').split('=');
    return [k, v];
  })
);

const baseUrl = args[0] || 'https://api.masterreactnative.dev';
const mode = flags.mode === 'static' ? 'static' : 'data';
const ICONS_DIR = path.join(__dirname, '..', 'public', 'icons');

async function api(method, urlPath, body) {
  const url = `${baseUrl.replace(/\/$/, '')}${urlPath}`;
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = { raw: text }; }
  if (!res.ok || json?.success === false) {
    throw new Error(`${method} ${urlPath} → ${res.status}: ${json?.message || text.slice(0, 200)}`);
  }
  return json?.data ?? json;
}

// ---------------------------------------------------------------------------
// Icon definitions
// Each entry returns the *inner* SVG markup (paths/shapes drawn on top of a
// rounded-corner rect filled with the module's background_color). Each icon
// is intentionally a single recognisable geometric symbol so it reads at the
// 64×64 size we render at on the mobile cards.
// ---------------------------------------------------------------------------

const ICONS = {
  // JS — chevron < > suggesting code
  'JavaScript Essentials':
    `<path d='M22 18l-10 14 10 14M42 18l10 14-10 14' fill='none' stroke='#fff' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'/>`,

  // React — atom (two ellipses + nucleus)
  'React Fundamentals':
    `<g fill='none' stroke='#fff' stroke-width='3'><ellipse cx='32' cy='32' rx='22' ry='9'/><ellipse cx='32' cy='32' rx='22' ry='9' transform='rotate(60 32 32)'/></g><circle cx='32' cy='32' r='3.5' fill='#fff'/>`,

  // Expo — play / triangle
  'Getting Started with Expo':
    `<path d='M22 16l24 16-24 16z' fill='#fff'/>`,

  // Core Components — 4-square grid
  'Core Components & Layout':
    `<g fill='#fff'><rect x='14' y='14' width='15' height='15' rx='3'/><rect x='35' y='14' width='15' height='15' rx='3'/><rect x='14' y='35' width='15' height='15' rx='3'/><rect x='35' y='35' width='15' height='15' rx='3'/></g>`,

  // Styling — paint droplet
  'Styling & Theming':
    `<path d='M32 12c0 0-12 16-12 26a12 12 0 0024 0c0-10-12-26-12-26z' fill='#fff'/>`,

  // Navigation — compass needle
  'Navigation':
    `<g fill='#fff'><circle cx='32' cy='32' r='20' fill='none' stroke='#fff' stroke-width='3'/><path d='M32 16l6 18-6-4-6 4z'/></g>`,

  // State Management — three nodes connected
  'State Management':
    `<g fill='#fff' stroke='#fff' stroke-width='2'><path d='M32 18L18 46M32 18L46 46' stroke-linecap='round'/><circle cx='32' cy='18' r='5'/><circle cx='18' cy='46' r='5'/><circle cx='46' cy='46' r='5'/></g>`,

  // Lists — three horizontal bars
  'Lists & Data':
    `<g stroke='#fff' stroke-width='5' stroke-linecap='round'><path d='M14 22h36M14 32h36M14 42h22'/></g>`,

  // Forms — input box with cursor
  'Forms & Input':
    `<rect x='12' y='26' width='40' height='14' rx='4' fill='none' stroke='#fff' stroke-width='3'/><path d='M20 30v6' stroke='#fff' stroke-width='2.5'/>`,

  // Networking — cloud
  'Networking & APIs':
    `<path d='M22 42h22a8 8 0 000-16 12 12 0 00-23-3 8 8 0 001 19z' fill='#fff'/>`,

  // Local Storage — stacked disks
  'Local Storage':
    `<g fill='none' stroke='#fff' stroke-width='3'><ellipse cx='32' cy='20' rx='16' ry='5'/><path d='M16 20v10c0 3 7 5 16 5s16-2 16-5V20'/><path d='M16 36v10c0 3 7 5 16 5s16-2 16-5V36'/></g>`,

  // Animations — flowing wave
  'Animations & Gestures':
    `<path d='M10 32c8-14 14-14 22 0s14 14 22 0' fill='none' stroke='#fff' stroke-width='4' stroke-linecap='round'/>`,

  // Native Device — phone outline
  'Native Device Features':
    `<rect x='20' y='10' width='24' height='44' rx='5' fill='none' stroke='#fff' stroke-width='3'/><circle cx='32' cy='48' r='2' fill='#fff'/>`,

  // Authentication — shield
  'Authentication & Security':
    `<path d='M32 12L16 18v12c0 12 16 22 16 22s16-10 16-22V18z' fill='#fff'/>`,

  // Testing — checkmark
  'Testing & Debugging':
    `<path d='M14 32l12 12 24-24' fill='none' stroke='#fff' stroke-width='6' stroke-linecap='round' stroke-linejoin='round'/>`,

  // Performance — lightning bolt
  'Performance':
    `<path d='M34 10l-16 26h12l-6 18 18-26H30z' fill='#fff'/>`,

  // Deployment — rocket
  'App Store Deployment':
    `<g fill='#fff'><path d='M32 10c8 8 10 18 10 22l-4 4h-12l-4-4c0-4 2-14 10-22z'/><path d='M22 36l-4 8 6-2v6l4-6M42 36l4 8-6-2v6l-4-6'/></g>`,
};

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function buildSvg(title, color) {
  const inner = ICONS[title];
  if (!inner) return null;
  return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' rx='14' fill='${color}'/>${inner}</svg>`;
}

function toDataUri(svg) {
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

async function main() {
  if (!fs.existsSync(ICONS_DIR)) fs.mkdirSync(ICONS_DIR, { recursive: true });

  console.log(`\nGenerating icons + uploading to ${baseUrl}  (mode=${mode})\n`);

  const modules = await api('GET', '/api/modules');
  console.log(`Loaded ${modules.length} modules.\n`);

  let updated = 0;
  let missing = [];
  let tooLong = [];
  const baseTrimmed = baseUrl.replace(/\/$/, '');

  for (const m of modules) {
    if (!ICONS[m.title]) {
      missing.push(m.title);
      console.warn(`⚠ no icon mapping for: ${m.title}`);
      continue;
    }
    const svg = buildSvg(m.title, m.background_color);
    const slug = slugify(m.title);
    const filePath = path.join(ICONS_DIR, `${slug}.svg`);
    fs.writeFileSync(filePath, svg, 'utf8');

    // Two write modes:
    //   data   — embed the SVG inline. Self-contained, but needs the controller
    //            validator to accept data:image/svg+xml (deploy first).
    //   static — use the API's /icons/<slug>.svg URL. Needs static middleware
    //            + SVG files on the server (deploy first).
    let imageUrl;
    if (mode === 'static') {
      imageUrl = `${baseTrimmed}/icons/${slug}.svg`;
    } else {
      imageUrl = toDataUri(svg);
      if (imageUrl.length > 500) {
        tooLong.push({ title: m.title, length: imageUrl.length });
        console.warn(`⚠ data URI too long for ${m.title}: ${imageUrl.length} chars (limit 500)`);
        continue;
      }
    }

    try {
      await api('PUT', `/api/modules/${m.id}`, { image_url: imageUrl });
      console.log(`✓ ${m.title} (id=${m.id}) — ${imageUrl.length} chars, file=${path.basename(filePath)}`);
      updated++;
    } catch (e) {
      console.warn(`✗ ${m.title}: ${e.message}`);
    }
  }

  console.log(`\nDone. Updated ${updated} of ${modules.length} modules.`);
  console.log(`SVG files written to: ${ICONS_DIR}`);
  if (missing.length) console.log(`No icon mapping for: ${missing.join(', ')}`);
  if (tooLong.length) console.log(`Truncation risk: ${tooLong.map((t) => `${t.title} (${t.length})`).join(', ')}`);
}

main().catch((e) => {
  console.error(`\n✗ Failed: ${e.message}\n`);
  process.exit(1);
});

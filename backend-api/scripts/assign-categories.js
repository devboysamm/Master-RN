#!/usr/bin/env node
/*
 * Assign modules to categories via the API.
 *
 * Usage:
 *   node scripts/assign-categories.js https://api.masterreactnative.dev
 *   node scripts/assign-categories.js http://localhost:5000
 *
 * Looks up module IDs by title and category IDs by name (both case-sensitive),
 * then POST /api/categories/:id/modules { module_id } for each pairing.
 * The backend uses INSERT IGNORE, so re-running is idempotent.
 */

const baseUrl = process.argv[2] || 'https://api.masterreactnative.dev';

async function api(method, path, body) {
  const url = `${baseUrl.replace(/\/$/, '')}${path}`;
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = { raw: text }; }
  if (!res.ok || json?.success === false) {
    throw new Error(`${method} ${path} → ${res.status}: ${json?.message || text.slice(0, 200)}`);
  }
  return json?.data ?? json;
}

const ASSIGNMENTS = {
  'Beginner':       ['JavaScript Essentials', 'React Fundamentals', 'Getting Started with Expo'],
  'Components':     ['Core Components & Layout', 'Styling & Theming'],
  'Hooks & State':  ['State Management', 'React Fundamentals'],
  'Navigation':     ['Navigation'],
  'Styling':        ['Styling & Theming', 'Animations & Gestures'],
  'APIs & Data':    ['Networking & APIs', 'Local Storage', 'Forms & Input'],
  'Ship to Store':  ['Testing & Debugging', 'Performance', 'App Store Deployment'],
};

async function main() {
  console.log(`\nAssigning modules to categories on ${baseUrl}\n`);

  const [modules, categories] = await Promise.all([
    api('GET', '/api/modules'),
    api('GET', '/api/categories'),
  ]);

  const modByTitle = new Map();
  for (const m of modules) modByTitle.set(m.title, m);
  const catByName = new Map();
  for (const c of categories) catByName.set(c.name, c);

  console.log(`Loaded ${modules.length} modules, ${categories.length} categories.\n`);

  let added = 0;
  let skipped = 0;
  let missing = [];

  for (const [catName, moduleTitles] of Object.entries(ASSIGNMENTS)) {
    const cat = catByName.get(catName);
    if (!cat) {
      console.warn(`⚠ Category not found: ${catName}`);
      missing.push(`category:${catName}`);
      continue;
    }
    console.log(`${cat.name} (id=${cat.id})`);
    for (const title of moduleTitles) {
      const mod = modByTitle.get(title);
      if (!mod) {
        console.warn(`  ⚠ Module not found: ${title}`);
        missing.push(`module:${title}`);
        skipped++;
        continue;
      }
      try {
        await api('POST', `/api/categories/${cat.id}/modules`, { module_id: mod.id });
        console.log(`  ✓ ${title} (id=${mod.id})`);
        added++;
      } catch (e) {
        console.warn(`  ⚠ ${title}: ${e.message}`);
        skipped++;
      }
    }
    console.log();
  }

  console.log(`Done. Added ${added}, skipped ${skipped}.`);
  if (missing.length) console.log(`Missing: ${missing.join(', ')}`);
}

main().catch((e) => {
  console.error(`\n✗ Failed: ${e.message}\n`);
  process.exit(1);
});

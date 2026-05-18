#!/usr/bin/env node
/*
 * Shorten every module's prerequisites string to 2-3 word labels so they
 * wrap nicely (2-3 per row) in the mobile-app Module Detail screen.
 *
 * Usage:
 *   node scripts/shorten-prereqs.js https://api.masterreactnative.dev
 *   node scripts/shorten-prereqs.js http://localhost:5000
 *
 * Matches modules by exact title. Re-running is safe — each PUT just
 * overwrites the prerequisites column with the same shortened value.
 */

const baseUrl = process.argv[2];
if (!baseUrl) {
  console.error('Usage: node scripts/shorten-prereqs.js <base-url>');
  process.exit(1);
}

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

// title → array of short labels (max 2-3 words each).
const SHORT_PREREQS = {
  'JavaScript Essentials':       ['Programming basics', 'HTML/CSS', 'VS Code', 'Node.js 20+', 'Terminal'],
  'React Fundamentals':          ['JavaScript', 'ES6+ syntax', 'DOM basics', 'Async/await', 'FP basics'],
  'Getting Started with Expo':   ['JS + React', 'Xcode/Android Studio', 'iOS/Android device', 'GitHub account', 'Expo Go app'],
  'Core Components & Layout':    ['Expo basics', 'Flexbox', 'TypeScript types', 'Expo project', 'Layout patience'],
  'Styling & Theming':           ['Core Components', 'Color theory', 'Design basics', 'Figma', 'Brand vision'],
  'Navigation':                  ['Styling basics', 'Composition', 'TS generics', 'React Context', 'Multi-screen app'],
  'State Management':            ['Navigation', 'React hooks', 'Immutability', 'TS generics', 'Stateful app'],
  'Lists & Data':                ['State management', 'Keys & identity', 'Profiling basics', 'Array methods', 'List-heavy app'],
  'Forms & Input':               ['Lists & data', 'Validation', 'Keyboard handling', 'TS inference', 'Mobile UX'],
  'Networking & APIs':           ['Forms & Input', 'HTTP basics', 'JSON', 'Promises', 'A backend'],
  'Local Storage':               ['Networking', 'SQL basics', 'Serialization', 'Privacy basics', 'Disk space'],
  'Animations & Gestures':       ['Local Storage', 'Native modules', 'Frame timing', 'Easing math', 'UX delight'],
  'Native Device Features':      ['Animations', 'Permissions', 'Battery/privacy', 'Dev client', 'Config plugins'],
  'Authentication & Security':   ['Native features', 'HTTP headers', 'JWT & OAuth', 'Threat modeling', 'Own backend'],
  'Testing & Debugging':         ['Auth', 'TDD/BDD', 'CI/CD basics', 'Stack traces', 'Real app'],
  'Performance':                 ['Testing basics', 'Profiling', 'Render model', 'Bundle size', 'Older devices'],
  'App Store Deployment':        ['Performance', 'Apple Dev account', 'Play Console', 'Finished app', 'Review patience'],
};

async function main() {
  console.log(`\nShortening prerequisites on ${baseUrl}\n`);

  const modules = await api('GET', '/api/modules');
  console.log(`Loaded ${modules.length} modules.\n`);

  let updated = 0;
  let skipped = 0;
  const missing = [];

  for (const m of modules) {
    const short = SHORT_PREREQS[m.title];
    if (!short) {
      console.warn(`⚠ No short prereqs for "${m.title}" (id=${m.id})`);
      missing.push(m.title);
      skipped++;
      continue;
    }
    const next = short.join(', ');
    if ((m.prerequisites || '') === next) {
      console.log(`= ${m.title} — already short, skipped`);
      skipped++;
      continue;
    }
    try {
      await api('PUT', `/api/modules/${m.id}`, {
        ...m,
        prerequisites: next,
      });
      console.log(`✓ ${m.title} → ${next}`);
      updated++;
    } catch (e) {
      console.warn(`⚠ ${m.title}: ${e.message}`);
      skipped++;
    }
  }

  console.log(`\nDone. Updated ${updated}, skipped ${skipped}.`);
  if (missing.length) console.log(`Missing entries in SHORT_PREREQS: ${missing.join(', ')}`);
}

main().catch((e) => {
  console.error(`\n✗ Failed: ${e.message}\n`);
  process.exit(1);
});

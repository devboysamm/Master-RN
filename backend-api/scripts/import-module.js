#!/usr/bin/env node
/*
 * Import one module's REAL lesson content into the live DB, replacing that
 * module's placeholder lessons. Lessons are matched by title, so it creates no
 * duplicates and is safe to run repeatedly. It only touches lessons of the one
 * module named in the content file; other modules are never affected.
 *
 * Usage:
 *   node scripts/import-module.js <base-url> <content-file> [--dry-run] [--admin]
 *
 * Examples:
 *   # Preview the plan, change nothing:
 *   node scripts/import-module.js https://api.masterreactnative.dev content/module-01-javascript-essentials.js --dry-run
 *
 *   # Actually import module 1:
 *   node scripts/import-module.js https://api.masterreactnative.dev content/module-01-javascript-essentials.js
 *
 *   # If the lesson write endpoints are ever locked behind admin auth, add
 *   # --admin to log in first (prompts for username + password, never hardcoded):
 *   node scripts/import-module.js https://api.masterreactnative.dev content/module-01-javascript-essentials.js --admin
 *
 * Requires Node 18+ for built-in fetch.
 *
 * What it does:
 *   1. Finds the module by its exact title (from the content file).
 *   2. Reads that module's existing lessons.
 *   3. For each content lesson: UPDATE the existing lesson with the same title,
 *      or CREATE it if missing.
 *   4. DELETE any leftover lessons in that module whose title is not in the
 *      content file (clears placeholders and duplicates).
 *   Re-running converges to exactly the content file's lessons.
 */

const path = require('path');
const readline = require('readline');

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith('--')));
const positional = args.filter((a) => !a.startsWith('--'));
const baseUrl = positional[0];
const contentArg = positional[1];
const DRY_RUN = flags.has('--dry-run');
const USE_ADMIN = flags.has('--admin');

if (!baseUrl || !contentArg) {
  console.error('Usage: node scripts/import-module.js <base-url> <content-file> [--dry-run] [--admin]');
  console.error('Example: node scripts/import-module.js http://localhost:5000 content/module-01-javascript-essentials.js --dry-run');
  process.exit(1);
}

// Resolve the content file relative to the current working directory.
let content;
try {
  content = require(path.resolve(process.cwd(), contentArg));
} catch (e) {
  console.error('Could not load content file:', contentArg);
  console.error(e.message);
  process.exit(1);
}

if (!content || !content.moduleTitle || !Array.isArray(content.lessons)) {
  console.error('Content file must export { moduleTitle, lessons: [...] }');
  process.exit(1);
}

const ROOT = baseUrl.replace(/\/$/, '');
let authToken = null;

async function api(method, p, body) {
  const res = await fetch(`${ROOT}${p}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = { raw: text }; }
  if (!res.ok || json?.success === false) {
    const err = new Error(`${method} ${p} -> ${res.status}: ${json?.message || json?.error || text.slice(0, 200)}`);
    err.status = res.status;
    throw err;
  }
  return json?.data ?? json;
}

const norm = (s) => String(s || '').trim().toLowerCase();

/* ----------------------------- admin login ----------------------------- */
function ask(query) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(query, (a) => { rl.close(); resolve(a); }));
}

// Hidden prompt: mute readline's echo so the typed password never shows. Uses
// no raw-mode control characters, so it is robust across terminals.
function askHidden(query) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    let muted = false;
    rl._writeToOutput = (str) => {
      if (!muted) rl.output.write(str); // show the prompt itself
    };
    process.stdout.write(query);
    muted = true;
    rl.question('', (answer) => {
      rl.close();
      process.stdout.write('\n');
      resolve(answer);
    });
  });
}

async function adminLogin() {
  const username = (await ask('Admin username: ')).trim();
  const password = await askHidden('Admin password: ');
  const result = await api('POST', '/api/admin/login', { username, password });
  if (!result || !result.token) throw new Error('Login did not return a token');
  authToken = result.token;
  console.log('Logged in as admin.\n');
}

/* ------------------------------- import -------------------------------- */
async function run() {
  console.log(`\nModule: "${content.moduleTitle}"  (${content.lessons.length} lessons)`);
  console.log(`Target: ${ROOT}${DRY_RUN ? '   [DRY RUN, no writes]' : ''}\n`);

  if (USE_ADMIN && !DRY_RUN) {
    await adminLogin();
  }

  // 1. Find the module by exact title.
  const modules = await api('GET', '/api/modules');
  const matches = (Array.isArray(modules) ? modules : []).filter(
    (m) => norm(m.title) === norm(content.moduleTitle)
  );
  if (matches.length === 0) {
    throw new Error(`No module titled "${content.moduleTitle}" exists. Create it (or seed) first.`);
  }
  if (matches.length > 1) {
    console.warn(`WARNING: ${matches.length} modules share this title. Using the lowest id; the others are left untouched.`);
  }
  const mod = matches.sort((a, b) => a.id - b.id)[0];
  console.log(`Found module id=${mod.id}\n`);

  // 2. Existing lessons of that module.
  const existing = await api('GET', `/api/modules/${mod.id}/lessons`);
  const existingList = Array.isArray(existing) ? existing : [];
  const existingByTitle = new Map();
  for (const l of existingList) existingByTitle.set(norm(l.title), l);

  const wantedTitles = new Set(content.lessons.map((l) => norm(l.title)));
  let created = 0;
  let updated = 0;
  let deleted = 0;

  // 3. Upsert each content lesson (update the title-match, else create).
  for (const lesson of content.lessons) {
    const payload = {
      module_id: mod.id,
      title: lesson.title,
      description: lesson.description || '',
      content: lesson.content,
      read_time: Number(lesson.read_time) || 5,
      lesson_order: Number(lesson.lesson_order) || 0,
    };
    const ord = String(payload.lesson_order).padStart(2, '0');
    const match = existingByTitle.get(norm(lesson.title));
    if (match) {
      if (!DRY_RUN) await api('PUT', `/api/lessons/${match.id}`, payload);
      console.log(`  ${DRY_RUN ? 'UPDATE' : 'updated'}  L${ord} (id=${match.id})  ${lesson.title}`);
      updated++;
    } else {
      let newId = '?';
      if (!DRY_RUN) {
        const row = await api('POST', '/api/lessons', payload);
        newId = row && row.id;
      }
      console.log(`  ${DRY_RUN ? 'CREATE' : 'created'}  L${ord} (id=${newId})  ${lesson.title}`);
      created++;
    }
  }

  // 4. Delete leftover lessons not in the content set (placeholders / dupes).
  for (const l of existingList) {
    if (!wantedTitles.has(norm(l.title))) {
      if (!DRY_RUN) await api('DELETE', `/api/lessons/${l.id}`);
      console.log(`  ${DRY_RUN ? 'DELETE' : 'deleted'}  (id=${l.id})  ${l.title}`);
      deleted++;
    }
  }

  console.log(`\nDone${DRY_RUN ? ' (dry run, nothing written)' : ''}.  created=${created}  updated=${updated}  deleted=${deleted}\n`);
}

run().catch((err) => {
  console.error('\nImport failed:', err.message);
  if (err.status === 401 || err.status === 403) {
    console.error('The lesson write endpoints appear to require admin auth. Re-run with --admin to log in first.');
  }
  process.exit(1);
});

#!/usr/bin/env node
/*
 * Import one module's REAL lesson content into the live DB, replacing that
 * module's placeholder lessons. Lessons are matched by title, so it creates no
 * duplicates and is safe to run repeatedly. It only touches lessons of the one
 * module named in the content file; other modules are never affected.
 *
 * Usage:
 *   node scripts/import-module.js <base-url> <content-file> [--dry-run] [auth options]
 *
 * Lesson write endpoints require admin auth. Supply credentials non-interactively
 * via flags or env, or use --admin alone to be prompted. The password is never logged.
 *
 * Examples:
 *   # Preview the plan, change nothing (no auth needed for a dry run):
 *   node scripts/import-module.js https://api.masterreactnative.dev content/module-01-javascript-essentials.js --dry-run
 *
 *   # Import with credentials passed as flags (non-interactive):
 *   node scripts/import-module.js https://api.masterreactnative.dev content/module-01-javascript-essentials.js --username admin --password secret
 *
 *   # Import using an existing admin JWT (skips login):
 *   node scripts/import-module.js https://api.masterreactnative.dev content/module-01-javascript-essentials.js --token eyJ...
 *
 *   # Import using env vars (non-interactive):
 *   MRN_ADMIN_USERNAME=admin MRN_ADMIN_PASSWORD=secret \\
 *     node scripts/import-module.js https://api.masterreactnative.dev content/module-01-javascript-essentials.js
 *
 *   # Interactive fallback (prompts for username + password):
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

// Flags that take a value (as "--key value" or "--key=value").
const VALUE_FLAGS = ['username', 'password', 'token'];

// Parse argv into positionals, boolean flags, and value flags.
const rawArgs = process.argv.slice(2);
const positional = [];
const boolFlags = new Set();
const valueFlags = {};
for (let i = 0; i < rawArgs.length; i++) {
  const a = rawArgs[i];
  if (!a.startsWith('--')) {
    positional.push(a);
    continue;
  }
  const eq = a.indexOf('=');
  if (eq !== -1) {
    valueFlags[a.slice(2, eq)] = a.slice(eq + 1); // --key=value
  } else {
    const key = a.slice(2);
    if (VALUE_FLAGS.includes(key) && i + 1 < rawArgs.length && !rawArgs[i + 1].startsWith('--')) {
      valueFlags[key] = rawArgs[++i]; // --key value
    } else {
      boolFlags.add(key); // --dry-run, --admin
    }
  }
}

const baseUrl = positional[0];
const contentArg = positional[1];
const DRY_RUN = boolFlags.has('dry-run');
const USE_ADMIN = boolFlags.has('admin');

// Admin credentials may come from flags or environment. Password is never logged.
const ADMIN_USERNAME = valueFlags.username || process.env.MRN_ADMIN_USERNAME || '';
const ADMIN_PASSWORD = valueFlags.password || process.env.MRN_ADMIN_PASSWORD || '';
const ADMIN_TOKEN = valueFlags.token || process.env.MRN_ADMIN_TOKEN || '';

if (!baseUrl || !contentArg) {
  console.error('Usage: node scripts/import-module.js <base-url> <content-file> [options]');
  console.error('Options:');
  console.error('  --dry-run                 preview the plan, write nothing');
  console.error('  --admin                   authenticate as admin before writing');
  console.error('  --username <name>         admin username (implies admin auth)');
  console.error('  --password <pass>         admin password (implies admin auth)');
  console.error('  --token <jwt>             use an existing admin JWT directly, skip login');
  console.error('  (env: MRN_ADMIN_USERNAME, MRN_ADMIN_PASSWORD, MRN_ADMIN_TOKEN)');
  console.error('Example: node scripts/import-module.js https://api.masterreactnative.dev content/module-02-react-fundamentals.js --username admin --password secret');
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

async function loginWith(username, password) {
  const result = await api('POST', '/api/admin/login', { username, password });
  if (!result || !result.token) throw new Error('Login did not return a token');
  authToken = result.token;
}

// Resolve the admin Bearer token. Order: explicit token, then
// username + password (flags or env, non-interactive), then an interactive
// prompt as a last resort. The password is never logged.
async function authenticate() {
  if (ADMIN_TOKEN) {
    authToken = ADMIN_TOKEN;
    console.log('Using provided admin token.\n');
    return;
  }
  if (ADMIN_USERNAME && ADMIN_PASSWORD) {
    await loginWith(ADMIN_USERNAME.trim(), ADMIN_PASSWORD);
    console.log(`Logged in as admin (${ADMIN_USERNAME.trim()}).\n`);
    return;
  }
  // Fallback: interactive prompt (only when nothing was supplied).
  const username = (await ask('Admin username: ')).trim();
  const password = await askHidden('Admin password: ');
  await loginWith(username, password);
  console.log('Logged in as admin.\n');
}

/* ------------------------------- import -------------------------------- */
async function run() {
  console.log(`\nModule: "${content.moduleTitle}"  (${content.lessons.length} lessons)`);
  console.log(`Target: ${ROOT}${DRY_RUN ? '   [DRY RUN, no writes]' : ''}\n`);

  // Authenticate when admin auth was requested, either explicitly (--admin)
  // or implicitly by supplying a token or username + password.
  const wantAuth = USE_ADMIN || !!ADMIN_TOKEN || (!!ADMIN_USERNAME && !!ADMIN_PASSWORD);
  if (wantAuth && !DRY_RUN) {
    await authenticate();
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

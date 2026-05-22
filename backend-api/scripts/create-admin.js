/**
 * One-time admin account setup — RUN ON THE SERVER ONLY:
 *
 *     node scripts/create-admin.js
 *
 * Prompts (via stdin) for a username and password, hashes the password with
 * bcrypt, and inserts/updates the row in the `admin_users` table. The password
 * is typed live on the server and is NEVER written to code, the repo, or logs.
 * Re-running with an existing username just resets that admin's password.
 */
require('dotenv').config();
const readline = require('readline');
const bcrypt = require('bcryptjs');

const AdminUser = require('../src/models/AdminUser');
const { initializeDatabase } = require('../src/config/initializeDatabase');

const BCRYPT_ROUNDS = 10;

// Plain (visible) prompt — used for the username.
function ask(query) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(query, (answer) => { rl.close(); resolve(answer); }));
}

// Masked prompt — used for the password so it never echoes to the terminal.
function askHidden(query) {
  return new Promise((resolve) => {
    const stdin = process.stdin;
    process.stdout.write(query);
    stdin.resume();
    if (stdin.setRawMode) stdin.setRawMode(true);
    let value = '';
    const onData = (buf) => {
      const ch = buf.toString('utf8');
      if (ch === '\n' || ch === '\r' || ch === '\u0004') {
        // Enter / Ctrl-D — finish.
        if (stdin.setRawMode) stdin.setRawMode(false);
        stdin.pause();
        stdin.removeListener('data', onData);
        process.stdout.write('\n');
        resolve(value);
      } else if (ch === '\u0003') {
        // Ctrl-C — abort.
        process.stdout.write('\n');
        process.exit(1);
      } else if (ch === '\u007f' || ch === '\b') {
        // Backspace.
        if (value.length) { value = value.slice(0, -1); process.stdout.write('\b \b'); }
      } else {
        value += ch;
        process.stdout.write('*');
      }
    };
    stdin.on('data', onData);
  });
}

(async () => {
  try {
    await initializeDatabase(); // ensures the admin_users table exists

    const username = (await ask('Admin username: ')).trim();
    if (!username) {
      console.error('Username is required.');
      process.exit(1);
    }

    const password = await askHidden('Admin password (min 8 chars): ');
    if (typeof password !== 'string' || password.length < 8) {
      console.error('Password must be at least 8 characters.');
      process.exit(1);
    }
    const confirm = await askHidden('Confirm password: ');
    if (confirm !== password) {
      console.error('Passwords do not match.');
      process.exit(1);
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const admin = await AdminUser.upsert(username, passwordHash);

    console.log(`\nAdmin "${admin.username}" is ready. You can now log in to the admin panel.`);
    process.exit(0);
  } catch (err) {
    console.error('[create-admin] failed:', err.message || err);
    process.exit(1);
  }
})();

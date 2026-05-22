const pool = require('../config/db');

// password_hash is only selected for login verification — never returned to
// clients. Other reads use the safe projection (no hash).
async function findByUsername(username) {
  const [rows] = await pool.query(
    `SELECT id, username, password_hash, created_at FROM admin_users WHERE username = ? LIMIT 1`,
    [username]
  );
  return rows[0] || null;
}

async function findById(id) {
  const [rows] = await pool.query(
    `SELECT id, username, created_at FROM admin_users WHERE id = ? LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

// Create or update an admin's password hash. Used by the create-admin script.
async function upsert(username, passwordHash) {
  await pool.query(
    `INSERT INTO admin_users (username, password_hash) VALUES (?, ?)
     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`,
    [username, passwordHash]
  );
  return findByUsername(username);
}

module.exports = { findByUsername, findById, upsert };

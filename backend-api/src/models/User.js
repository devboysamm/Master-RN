const pool = require('../config/db');

// Never include password_hash in the default projection used for responses.
const SAFE_COLS = 'id, email, name, email_verified, created_at';

async function findByEmail(email) {
  const [rows] = await pool.query(
    `SELECT id, email, name, password_hash, email_verified, created_at
     FROM users WHERE email = ? LIMIT 1`,
    [email]
  );
  return rows[0] || null;
}

async function findById(id) {
  const [rows] = await pool.query(
    `SELECT ${SAFE_COLS} FROM users WHERE id = ? LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

async function create({ email, name, passwordHash }) {
  const [result] = await pool.query(
    `INSERT INTO users (email, name, password_hash, email_verified)
     VALUES (?, ?, ?, 0)`,
    [email, name ?? null, passwordHash]
  );
  return findById(result.insertId);
}

// Used when an unverified user re-submits signup — refresh their details.
async function updateCredentials(id, { name, passwordHash }) {
  await pool.query(
    `UPDATE users SET name = ?, password_hash = ? WHERE id = ?`,
    [name ?? null, passwordHash, id]
  );
}

async function setPasswordHash(id, passwordHash) {
  await pool.query(`UPDATE users SET password_hash = ? WHERE id = ?`, [passwordHash, id]);
}

async function markVerified(id) {
  await pool.query(`UPDATE users SET email_verified = 1 WHERE id = ?`, [id]);
}

// Strip the hash before sending a user back to a client.
function publicShape(user) {
  if (!user) return null;
  return { id: user.id, email: user.email, name: user.name };
}

module.exports = {
  findByEmail,
  findById,
  create,
  updateCredentials,
  setPasswordHash,
  markVerified,
  publicShape,
};

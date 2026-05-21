const pool = require('../config/db');

// Never include password_hash in the default projection used for responses.
const SAFE_COLS = 'id, email, name, bio, email_verified, created_at';

async function findByEmail(email) {
  const [rows] = await pool.query(
    `SELECT id, email, name, bio, password_hash, email_verified, created_at
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

// Admin listing — newest first. Deliberately omits password_hash.
async function findAll() {
  const [rows] = await pool.query(
    `SELECT id, name, email, email_verified, created_at
     FROM users ORDER BY created_at DESC, id DESC`
  );
  return rows;
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

// Update only the provided profile fields; returns the fresh row.
async function updateProfile(id, fields) {
  const sets = [];
  const params = [];
  if (Object.prototype.hasOwnProperty.call(fields, 'name')) {
    sets.push('name = ?');
    params.push(fields.name);
  }
  if (Object.prototype.hasOwnProperty.call(fields, 'bio')) {
    sets.push('bio = ?');
    params.push(fields.bio);
  }
  if (sets.length === 0) return findById(id);
  params.push(id);
  await pool.query(`UPDATE users SET ${sets.join(', ')} WHERE id = ?`, params);
  return findById(id);
}

// Strip the hash before sending a user back to a client.
function publicShape(user) {
  if (!user) return null;
  return { id: user.id, email: user.email, name: user.name, bio: user.bio ?? null };
}

module.exports = {
  findByEmail,
  findById,
  findAll,
  create,
  updateCredentials,
  setPasswordHash,
  markVerified,
  updateProfile,
  publicShape,
};

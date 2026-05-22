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

async function findByGithubId(githubId) {
  const [rows] = await pool.query(
    `SELECT ${SAFE_COLS} FROM users WHERE github_id = ? LIMIT 1`,
    [String(githubId)]
  );
  return rows[0] || null;
}

// Create a GitHub-authenticated user: no password, email already verified by
// GitHub (we only ever accept a primary *verified* email).
async function createGithubUser({ email, name, githubId }) {
  const [result] = await pool.query(
    `INSERT INTO users (email, name, github_id, email_verified)
     VALUES (?, ?, ?, 1)`,
    [email, name ?? null, String(githubId)]
  );
  return findById(result.insertId);
}

// Link a GitHub id to an existing (email-matched) account. Only sets it when
// absent so we never clobber a different already-linked id.
async function linkGithubId(id, githubId) {
  await pool.query(
    `UPDATE users SET github_id = ? WHERE id = ? AND github_id IS NULL`,
    [String(githubId), id]
  );
  return findById(id);
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

// Admin: update name and/or email_verified for any user. Returns fresh row.
async function adminUpdate(id, fields) {
  const sets = [];
  const params = [];
  if (Object.prototype.hasOwnProperty.call(fields, 'name')) {
    sets.push('name = ?');
    params.push(fields.name);
  }
  if (Object.prototype.hasOwnProperty.call(fields, 'email_verified')) {
    sets.push('email_verified = ?');
    params.push(fields.email_verified ? 1 : 0);
  }
  if (sets.length === 0) return findById(id);
  params.push(id);
  await pool.query(`UPDATE users SET ${sets.join(', ')} WHERE id = ?`, params);
  return findById(id);
}

// Admin: delete a user. Returns the number of rows removed.
async function remove(id) {
  const [result] = await pool.query(`DELETE FROM users WHERE id = ?`, [id]);
  return result.affectedRows;
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
  findByGithubId,
  findAll,
  create,
  createGithubUser,
  linkGithubId,
  updateCredentials,
  setPasswordHash,
  markVerified,
  updateProfile,
  adminUpdate,
  remove,
  publicShape,
};

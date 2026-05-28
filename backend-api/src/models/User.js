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

// Self-service account deletion: permanently remove the user and ALL of their
// personal data in a single all-or-nothing transaction. Touches every table
// keyed to the account — device_tokens (by user_id), otp_codes (by the
// account email), and finally the users row itself. Idempotent: deleting an
// already-gone account simply removes 0 rows and still resolves. Returns the
// number of users rows removed (1, or 0 if it was already deleted).
async function deleteAccountAndData(id) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Grab the email up front so we can clear email-keyed rows (OTP codes)
    // before the users row is gone.
    const [rows] = await conn.query('SELECT email FROM users WHERE id = ? LIMIT 1', [id]);
    const email = rows[0]?.email || null;

    await conn.query('DELETE FROM device_tokens WHERE user_id = ?', [id]);
    if (email) {
      await conn.query('DELETE FROM otp_codes WHERE email = ?', [email]);
      // Keep the bug report text (operationally useful) but strip the email
      // so no personal identifier survives the account deletion.
      await conn.query(
        "UPDATE problem_reports SET user_email = 'deleted-user' WHERE user_email = ?",
        [email]
      );
    }
    const [result] = await conn.query('DELETE FROM users WHERE id = ?', [id]);

    await conn.commit();
    return result.affectedRows;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
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
  adminUpdate,
  remove,
  deleteAccountAndData,
  publicShape,
};

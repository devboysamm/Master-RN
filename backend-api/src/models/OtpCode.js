const pool = require('../config/db');

const TTL_MINUTES = 10;

/** Most recent unconsumed, unexpired code for an email + purpose (or null). */
async function findValid(email, purpose) {
  const [rows] = await pool.query(
    `SELECT id, email, code, purpose, expires_at, consumed
     FROM otp_codes
     WHERE email = ? AND purpose = ? AND consumed = 0 AND expires_at > NOW()
     ORDER BY id DESC LIMIT 1`,
    [email, purpose]
  );
  return rows[0] || null;
}

/** Most recent unconsumed code (regardless of expiry) — used at verify time. */
async function findNewestUnconsumed(email, purpose) {
  const [rows] = await pool.query(
    `SELECT id, email, code, purpose, expires_at, consumed
     FROM otp_codes
     WHERE email = ? AND purpose = ? AND consumed = 0
     ORDER BY id DESC LIMIT 1`,
    [email, purpose]
  );
  return rows[0] || null;
}

async function create(email, code, purpose) {
  await pool.query(
    `INSERT INTO otp_codes (email, code, purpose, expires_at)
     VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL ? MINUTE))`,
    [email, code, purpose, TTL_MINUTES]
  );
}

async function markConsumed(id) {
  await pool.query(`UPDATE otp_codes SET consumed = 1 WHERE id = ?`, [id]);
}

function isExpired(row) {
  return new Date(row.expires_at).getTime() <= Date.now();
}

module.exports = {
  TTL_MINUTES,
  findValid,
  findNewestUnconsumed,
  create,
  markConsumed,
  isExpired,
};

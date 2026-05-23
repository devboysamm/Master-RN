const pool = require('../config/db');

// Upsert an Expo push token. `token` is UNIQUE, so a device re-registering
// (or a token reassigned to another user) updates the existing row instead of
// creating a duplicate.
async function upsert({ userId, token, platform }) {
  await pool.query(
    `INSERT INTO device_tokens (user_id, token, platform)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE
       user_id = VALUES(user_id),
       platform = VALUES(platform),
       updated_at = CURRENT_TIMESTAMP`,
    [userId ?? null, token, platform ?? null]
  );
}

// Every registered push token (deduped by the unique column already).
async function allTokens() {
  const [rows] = await pool.query(`SELECT token FROM device_tokens`);
  return rows.map((r) => r.token).filter(Boolean);
}

module.exports = { upsert, allTokens };

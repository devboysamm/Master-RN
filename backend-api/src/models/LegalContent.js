const pool = require('../config/db');

// `key` is a reserved word in MySQL, so it must always be backticked.
async function get(key) {
  const [rows] = await pool.query(
    'SELECT `key`, body, updated_at FROM legal_content WHERE `key` = ? LIMIT 1',
    [key]
  );
  return rows[0] || null;
}

async function upsert(key, body) {
  await pool.query(
    'INSERT INTO legal_content (`key`, body) VALUES (?, ?) ON DUPLICATE KEY UPDATE body = VALUES(body)',
    [key, body]
  );
  return get(key);
}

module.exports = { get, upsert };

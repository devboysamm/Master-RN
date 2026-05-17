const pool = require('../config/db');

const SELECT_COLS = 'id, welcome_title, welcome_description, motivation_text, motivation_quote, updated_at';

async function get() {
  const [rows] = await pool.query(
    `SELECT ${SELECT_COLS} FROM app_content WHERE id = 1 LIMIT 1`
  );
  return rows[0] || null;
}

async function upsert(data) {
  const { welcome_title, welcome_description, motivation_text, motivation_quote } = data;
  await pool.query(
    `INSERT INTO app_content (id, welcome_title, welcome_description, motivation_text, motivation_quote)
     VALUES (1, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       welcome_title = VALUES(welcome_title),
       welcome_description = VALUES(welcome_description),
       motivation_text = VALUES(motivation_text),
       motivation_quote = VALUES(motivation_quote)`,
    [welcome_title, welcome_description, motivation_text, motivation_quote]
  );
  return get();
}

module.exports = { get, upsert };

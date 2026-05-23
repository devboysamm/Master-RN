const pool = require('../config/db');

const COLS = 'id, title, body, created_at';

async function create({ title, body }) {
  const [result] = await pool.query(
    `INSERT INTO notifications (title, body) VALUES (?, ?)`,
    [title, body ?? null]
  );
  return findById(result.insertId);
}

async function findById(id) {
  const [rows] = await pool.query(
    `SELECT ${COLS} FROM notifications WHERE id = ? LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

// Newest first — powers both the admin "past sent" list and the app's bell.
async function findRecent(limit = 50) {
  const [rows] = await pool.query(
    `SELECT ${COLS} FROM notifications ORDER BY created_at DESC, id DESC LIMIT ?`,
    [limit]
  );
  return rows;
}

module.exports = { create, findById, findRecent };

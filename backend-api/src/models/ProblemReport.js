const pool = require('../config/db');

const COLS = 'id, message, category, app_version, platform, user_email, status, created_at';

async function create({ message, category, app_version, platform, user_email }) {
  const [result] = await pool.query(
    `INSERT INTO problem_reports (message, category, app_version, platform, user_email)
     VALUES (?, ?, ?, ?, ?)`,
    [message, category ?? null, app_version ?? null, platform ?? null, user_email ?? null]
  );
  return findById(result.insertId);
}

async function findById(id) {
  const [rows] = await pool.query(
    `SELECT ${COLS} FROM problem_reports WHERE id = ? LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

// Admin listing — newest first.
async function findAll() {
  const [rows] = await pool.query(
    `SELECT ${COLS} FROM problem_reports ORDER BY created_at DESC, id DESC`
  );
  return rows;
}

async function updateStatus(id, status) {
  const [result] = await pool.query(
    `UPDATE problem_reports SET status = ? WHERE id = ?`,
    [status, id]
  );
  if (!result.affectedRows) return null;
  return findById(id);
}

module.exports = { create, findById, findAll, updateStatus };

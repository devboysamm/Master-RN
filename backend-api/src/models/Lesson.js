const pool = require('../config/db');

const SELECT_COLS =
  'id, module_id, title, description, content, read_time, lesson_order, created_at, updated_at';

async function findByModuleId(moduleId) {
  const [rows] = await pool.query(
    `SELECT ${SELECT_COLS} FROM lessons WHERE module_id = ? ORDER BY lesson_order ASC, id ASC`,
    [moduleId]
  );
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query(
    `SELECT ${SELECT_COLS} FROM lessons WHERE id = ? LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

async function create(data) {
  const {
    module_id,
    title,
    description = null,
    content = null,
    read_time = 5,
    lesson_order = 0,
  } = data;
  const [result] = await pool.query(
    `INSERT INTO lessons (module_id, title, description, content, read_time, lesson_order)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [module_id, title, description, content, read_time, lesson_order]
  );
  return findById(result.insertId);
}

async function update(id, data) {
  const fields = [];
  const values = [];
  const allowed = ['module_id', 'title', 'description', 'content', 'read_time', 'lesson_order'];
  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      fields.push(`${key} = ?`);
      values.push(data[key]);
    }
  }
  if (fields.length === 0) return findById(id);
  values.push(id);
  await pool.query(`UPDATE lessons SET ${fields.join(', ')} WHERE id = ?`, values);
  return findById(id);
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM lessons WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = { findByModuleId, findById, create, update, remove };

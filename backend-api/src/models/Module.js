const pool = require('../config/db');

const SELECT_COLS =
  'id, title, description, prerequisites, icon, image_url, background_color, order_index, created_at, updated_at';

async function findAll() {
  const [rows] = await pool.query(
    `SELECT ${SELECT_COLS} FROM modules ORDER BY order_index ASC, id ASC`
  );
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query(
    `SELECT ${SELECT_COLS} FROM modules WHERE id = ? LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

async function create(data) {
  const {
    title,
    description = null,
    prerequisites = null,
    icon = 'book',
    image_url = null,
    background_color = '#EAF2FF',
    order_index = 0,
  } = data;
  const [result] = await pool.query(
    `INSERT INTO modules (title, description, prerequisites, icon, image_url, background_color, order_index)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [title, description, prerequisites, icon, image_url, background_color, order_index]
  );
  return findById(result.insertId);
}

async function update(id, data) {
  const fields = [];
  const values = [];
  const allowed = [
    'title',
    'description',
    'prerequisites',
    'icon',
    'image_url',
    'background_color',
    'order_index',
  ];
  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      fields.push(`${key} = ?`);
      values.push(data[key]);
    }
  }
  if (fields.length === 0) return findById(id);
  values.push(id);
  await pool.query(`UPDATE modules SET ${fields.join(', ')} WHERE id = ?`, values);
  return findById(id);
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM modules WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = { findAll, findById, create, update, remove };

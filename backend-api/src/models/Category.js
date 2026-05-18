const pool = require('../config/db');

const SELECT_COLS = 'id, name, icon, color, order_index, created_at, updated_at';

async function findAll() {
  const [rows] = await pool.query(
    `SELECT c.${SELECT_COLS.split(', ').join(', c.')},
            (SELECT COUNT(*) FROM category_modules cm WHERE cm.category_id = c.id) AS module_count
     FROM categories c
     ORDER BY c.order_index ASC, c.id ASC`
  );
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query(
    `SELECT ${SELECT_COLS} FROM categories WHERE id = ? LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

async function create(data) {
  const {
    name,
    icon = 'book',
    color = '#F26A4A',
    order_index = 0,
  } = data;
  const [result] = await pool.query(
    `INSERT INTO categories (name, icon, color, order_index) VALUES (?, ?, ?, ?)`,
    [name, icon, color, order_index]
  );
  return findById(result.insertId);
}

async function update(id, data) {
  const fields = [];
  const values = [];
  for (const key of ['name', 'icon', 'color', 'order_index']) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      fields.push(`${key} = ?`);
      values.push(data[key]);
    }
  }
  if (fields.length === 0) return findById(id);
  values.push(id);
  await pool.query(`UPDATE categories SET ${fields.join(', ')} WHERE id = ?`, values);
  return findById(id);
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM categories WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

async function getModules(categoryId) {
  const [rows] = await pool.query(
    `SELECT m.id, m.title, m.description, m.prerequisites, m.icon, m.image_url,
            m.background_color, m.order_index, m.created_at, m.updated_at
     FROM modules m
     INNER JOIN category_modules cm ON cm.module_id = m.id
     WHERE cm.category_id = ?
     ORDER BY m.order_index ASC, m.id ASC`,
    [categoryId]
  );
  return rows;
}

async function addModule(categoryId, moduleId) {
  await pool.query(
    `INSERT IGNORE INTO category_modules (category_id, module_id) VALUES (?, ?)`,
    [categoryId, moduleId]
  );
}

async function removeModule(categoryId, moduleId) {
  const [result] = await pool.query(
    `DELETE FROM category_modules WHERE category_id = ? AND module_id = ?`,
    [categoryId, moduleId]
  );
  return result.affectedRows > 0;
}

async function getModuleIds(categoryId) {
  const [rows] = await pool.query(
    `SELECT module_id FROM category_modules WHERE category_id = ?`,
    [categoryId]
  );
  return rows.map((r) => r.module_id);
}

module.exports = {
  findAll, findById, create, update, remove,
  getModules, addModule, removeModule, getModuleIds,
};

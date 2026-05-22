const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const pool = require('./db');

async function ensureDatabaseExists() {
  const dbName = process.env.DB_NAME || 'master-react-native';
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    ssl: String(process.env.DB_SSL).toLowerCase() === 'true' ? {} : undefined,
    connectTimeout: Number(process.env.DB_CONNECT_TIMEOUT) || 10000,
  });
  await conn.query(
    `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );
  await conn.end();
}

async function columnExists(conn, table, column) {
  const dbName = process.env.DB_NAME || 'master-react-native';
  const [rows] = await conn.query(
    `SELECT COUNT(*) AS c FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [dbName, table, column]
  );
  return rows[0].c > 0;
}

async function addMissingColumn(conn, table, column, definition) {
  if (await columnExists(conn, table, column)) return;
  await conn.query(`ALTER TABLE \`${table}\` ADD COLUMN ${column} ${definition}`);
  console.log(`[db] added missing column ${table}.${column}`);
}

const DEFAULT_CATEGORIES = [
  { name: 'Beginner',      icon: 'sparkle', color: '#9EC9A8', order_index: 1 },
  { name: 'Components',    icon: 'layers',  color: '#61DAFB', order_index: 2 },
  { name: 'Hooks & State', icon: 'sparkle', color: '#F26A4A', order_index: 3 },
  { name: 'Navigation',    icon: 'compass', color: '#7B68EE', order_index: 4 },
  { name: 'Styling',       icon: 'layers',  color: '#E8A0BF', order_index: 5 },
  { name: 'APIs & Data',   icon: 'shield',  color: '#4682B4', order_index: 6 },
  { name: 'Ship to Store', icon: 'book',    color: '#F5C24B', order_index: 7 },
];

async function seedDefaultCategories(conn) {
  const [rows] = await conn.query('SELECT COUNT(*) AS c FROM categories');
  if (rows[0].c > 0) return;
  for (const c of DEFAULT_CATEGORIES) {
    await conn.query(
      'INSERT INTO categories (name, icon, color, order_index) VALUES (?, ?, ?, ?)',
      [c.name, c.icon, c.color, c.order_index]
    );
  }
  console.log(`[db] seeded ${DEFAULT_CATEGORIES.length} default categories`);
}

async function widenColumnIfNeeded(conn, table, column, targetType) {
  const dbName = process.env.DB_NAME || 'master-react-native';
  const [rows] = await conn.query(
    `SELECT DATA_TYPE FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [dbName, table, column]
  );
  const current = rows[0]?.DATA_TYPE?.toLowerCase();
  if (!current || current === targetType.toLowerCase()) return;
  await conn.query(`ALTER TABLE \`${table}\` MODIFY ${column} ${targetType}`);
  console.log(`[db] widened ${table}.${column}: ${current} → ${targetType}`);
}

async function runMigrations(conn) {
  // Older databases were created before created_at/updated_at existed.
  await addMissingColumn(conn, 'modules', 'created_at', 'DATETIME DEFAULT CURRENT_TIMESTAMP');
  await addMissingColumn(conn, 'modules', 'updated_at', 'DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP');
  await addMissingColumn(conn, 'lessons', 'created_at', 'DATETIME DEFAULT CURRENT_TIMESTAMP');
  await addMissingColumn(conn, 'lessons', 'updated_at', 'DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP');
  await addMissingColumn(conn, 'app_content', 'updated_at', 'DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP');
  await addMissingColumn(conn, 'app_content', 'welcome_subtitle', 'TEXT');
  await addMissingColumn(conn, 'app_content', 'welcome_footer', 'TEXT');
  await addMissingColumn(conn, 'app_content', 'app_description', 'TEXT');
  await addMissingColumn(conn, 'app_content', 'terms_url', 'VARCHAR(500)');
  await addMissingColumn(conn, 'app_content', 'privacy_url', 'VARCHAR(500)');
  await addMissingColumn(conn, 'app_content', 'featured_module_id', 'INT');
  await addMissingColumn(conn, 'app_content', 'premium_title', 'VARCHAR(255)');
  await addMissingColumn(conn, 'app_content', 'premium_description', 'TEXT');
  await addMissingColumn(conn, 'app_content', 'support_email', 'VARCHAR(255)');
  await addMissingColumn(conn, 'app_content', 'contact_url', 'VARCHAR(500)');
  await addMissingColumn(conn, 'app_content', 'help_content', 'TEXT');
  // Users gained an editable bio after the table first shipped.
  await addMissingColumn(conn, 'users', 'bio', 'VARCHAR(300)');
  // GitHub OAuth: link a GitHub account id to a user (nullable — email/OTP
  // accounts have none). password_hash is already nullable, so a GitHub
  // account without a password is valid.
  await addMissingColumn(conn, 'users', 'github_id', 'VARCHAR(64)');
  // Widen image_url so it can hold base64-encoded PNG/SVG data URIs.
  await widenColumnIfNeeded(conn, 'modules', 'image_url', 'LONGTEXT');
  await seedDefaultCategories(conn);
}

async function initializeDatabase() {
  await ensureDatabaseExists();
  const schemaPath = path.join(__dirname, '..', '..', 'schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf8');
  const conn = await pool.getConnection();
  try {
    await conn.query(sql);
    await runMigrations(conn);
    console.log('[db] schema initialized');
  } finally {
    conn.release();
  }
}

module.exports = { initializeDatabase };

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

async function runMigrations(conn) {
  // Older databases were created before created_at/updated_at existed.
  // Add them in-place so models that SELECT these columns don't break.
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

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

async function initializeDatabase() {
  await ensureDatabaseExists();
  const schemaPath = path.join(__dirname, '..', '..', 'schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf8');
  const conn = await pool.getConnection();
  try {
    await conn.query(sql);
    console.log('[db] schema initialized');
  } finally {
    conn.release();
  }
}

module.exports = { initializeDatabase };

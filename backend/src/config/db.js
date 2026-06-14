// backend/src/config/db.js
const { Pool } = require('pg')

const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME     || 'critiq_db',
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD || '',
  // Keep a small pool for dev; scale up in production
  max:               10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// Convenience wrapper — returns rows directly
const query = (text, params) => pool.query(text, params)

// Called on startup to verify the DB is reachable
async function testConnection() {
  try {
    const res = await pool.query('SELECT NOW() AS now')
    console.log(`✅  DB connected — server time: ${res.rows[0].now}`)
  } catch (err) {
    console.error('❌  DB connection failed:', err.message)
    throw err
  }
}

module.exports = { pool, query, testConnection }
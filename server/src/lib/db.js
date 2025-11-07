const mysql = require('mysql2/promise')

let pool

async function connectDb() {
  if (pool) return pool
  const host = process.env.MYSQL_HOST || '127.0.0.1'
  const port = Number(process.env.MYSQL_PORT || 3306)
  const user = process.env.MYSQL_USER || 'root'
  const password = process.env.MYSQL_PASSWORD || ''
  const database = process.env.MYSQL_DATABASE || 'admin_portal'

  // Ensure database exists
  const serverConn = await mysql.createConnection({ host, port, user, password, multipleStatements: true })
  await serverConn.query(`CREATE DATABASE IF NOT EXISTS \`${database}\``)
  await serverConn.end()

  pool = mysql.createPool({ host, port, user, password, database, waitForConnections: true, connectionLimit: 10 })

  await ensureSchema(pool)
  console.log('Connected to MySQL')
  return pool
}

async function ensureSchema(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(32) NOT NULL DEFAULT 'admin',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `)
}

function getPool() {
  if (!pool) throw new Error('DB not connected yet')
  return pool
}

module.exports = { connectDb, getPool }



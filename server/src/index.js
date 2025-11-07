require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { connectDb, getPool } = require('./lib/db')
const authRoutes = require('./routes/auth')

const app = express()
app.use(cors())
app.use(express.json())

connectDb().then(async () => {
  // Seed a default admin if none exists
  const pool = getPool()
  const [rows] = await pool.query('SELECT COUNT(*) AS c FROM admins')
  if (Number(rows[0].c) === 0) {
    const bcrypt = require('bcryptjs')
    const hash = await bcrypt.hash('admin123', 10)
    await pool.query(
      'INSERT IGNORE INTO admins (email, password_hash, role) VALUES (?, ?, ?)',
      ['admin@example.com', hash, 'admin']
    )
    console.log('Seeded default admin: admin@example.com / admin123')
  }
}).catch((err) => {
  console.error('DB connection failed:', err)
  process.exit(1)
})

app.use('/api/admin', authRoutes)

app.get('/api/health', (_req, res) => res.json({ ok: true }))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Admin API listening on http://localhost:${PORT}`)
})



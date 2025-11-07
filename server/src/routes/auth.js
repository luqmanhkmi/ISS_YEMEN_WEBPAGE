const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { getPool } = require('../lib/db')

const router = express.Router()

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {}
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' })
  const pool = getPool()
  const [rows] = await pool.query('SELECT id, email, password_hash, role FROM admins WHERE email=? LIMIT 1', [email])
  if (rows.length === 0) return res.status(401).json({ message: 'Invalid credentials' })
  const admin = rows[0]
  const ok = await bcrypt.compare(password, admin.password_hash)
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' })
  const token = jwt.sign({ sub: admin.id, role: admin.role }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '1d' })
  res.json({ token })
})

router.post('/register', async (req, res) => {
  const { email, password, name } = req.body || {}
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' })
  const pool = getPool()
  const [existing] = await pool.query('SELECT id FROM admins WHERE email=? LIMIT 1', [email])
  if (existing.length) return res.status(409).json({ message: 'Email already registered' })
  const bcrypt = require('bcryptjs')
  const hash = await bcrypt.hash(password, 10)
  await pool.query('INSERT INTO admins (email, password_hash, role) VALUES (?, ?, ?)', [email, hash, 'admin'])
  return res.status(201).json({ ok: true })
})

module.exports = router



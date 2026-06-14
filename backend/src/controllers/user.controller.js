const { validationResult } = require('express-validator')
const { query } = require('../config/db')
const { asyncHandler } = require('../middleware/errorHandler')

// ── GET /api/users/reviewers ──────────────────────────────────────
const listReviewers = asyncHandler(async (_req, res) => {
  const result = await query(
    `SELECT id, name, email, bio, review_count, created_at
     FROM   users
     WHERE  role IN ('reviewer', 'admin')
     ORDER  BY review_count DESC`
  )

  res.json({ reviewers: result.rows })
})

// ── GET /api/users/:id ────────────────────────────────────────────
const getProfile = asyncHandler(async (req, res) => {
  const result = await query(
    `SELECT id, name, email, bio, role, review_count, created_at
     FROM   users
     WHERE  id = $1`,
    [req.params.id]
  )

  if (!result.rows[0]) {
    return res.status(404).json({ error: 'User not found' })
  }

  res.json({ user: result.rows[0] })
})

// ── PATCH /api/users/me ───────────────────────────────────────────
const updateProfile = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { name, bio } = req.body
  const fields  = []
  const params  = []

  if (name !== undefined) { params.push(name); fields.push(`name = $${params.length}`) }
  if (bio  !== undefined) { params.push(bio);  fields.push(`bio  = $${params.length}`) }

  if (fields.length === 0) {
    return res.status(400).json({ error: 'No fields provided to update' })
  }

  params.push(req.user.id)
  const result = await query(
    `UPDATE users SET ${fields.join(', ')} WHERE id = $${params.length} RETURNING id, name, email, bio, role`,
    params
  )

  res.json({ user: result.rows[0] })
})

module.exports = { listReviewers, getProfile, updateProfile }
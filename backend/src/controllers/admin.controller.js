const { query } = require('../config/db')
const { asyncHandler } = require('../middleware/errorHandler')

// ── GET /api/admin/stats ──────────────────────────────────────────
const getAdminStats = asyncHandler(async (_req, res) => {
  const [users, requests, comments, pending, inReview, completed] = await Promise.all([
    query('SELECT COUNT(*) FROM users'),
    query('SELECT COUNT(*) FROM review_requests'),
    query('SELECT COUNT(*) FROM comments'),
    query("SELECT COUNT(*) FROM review_requests WHERE status = 'pending'"),
    query("SELECT COUNT(*) FROM review_requests WHERE status = 'in-review'"),
    query("SELECT COUNT(*) FROM review_requests WHERE status = 'completed'"),
  ])

  res.json({
    stats: {
      total_users:      Number(users.rows[0].count),
      total_requests:   Number(requests.rows[0].count),
      total_comments:   Number(comments.rows[0].count),
      pending:          Number(pending.rows[0].count),
      in_review:        Number(inReview.rows[0].count),
      completed:        Number(completed.rows[0].count),
    },
  })
})

// ── GET /api/admin/users ──────────────────────────────────────────
const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 30, role } = req.query
  const offset = (page - 1) * limit
  const params = []
  const conditions = []

  if (role) {
    params.push(role)
    conditions.push(`role = $${params.length}`)
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

  const result = await query(
    `SELECT id, name, email, role, bio, review_count, created_at
     FROM   users
     ${where}
     ORDER  BY created_at DESC
     LIMIT  $${params.length + 1} OFFSET $${params.length + 2}`,
    [...params, limit, offset]
  )

  const total = await query(`SELECT COUNT(*) FROM users ${where}`, params)

  res.json({
    users: result.rows,
    total: Number(total.rows[0].count),
    page:  Number(page),
    limit: Number(limit),
  })
})

// ── PATCH /api/admin/users/:id/role ──────────────────────────────
const updateUserRole = asyncHandler(async (req, res) => {
  const { id }   = req.params
  const { role } = req.body

  if (!['requester', 'reviewer', 'admin', 'suspended'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' })
  }

  const result = await query(
    'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, name, email, role',
    [role, id]
  )

  if (!result.rows[0]) {
    return res.status(404).json({ error: 'User not found' })
  }

  res.json({ user: result.rows[0] })
})

// ── PATCH /api/admin/users/:id/suspend ───────────────────────────
// Uses role field — sets to 'suspended' or restores previous role
const suspendUser = asyncHandler(async (req, res) => {
  const { id }      = req.params
  const { suspend } = req.body  // boolean

  const existing = await query('SELECT id, role FROM users WHERE id = $1', [id])
  if (!existing.rows[0]) {
    return res.status(404).json({ error: 'User not found' })
  }

  const newRole = suspend ? 'suspended' : 'requester'

  const result = await query(
    'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, name, email, role',
    [newRole, id]
  )

  res.json({ user: result.rows[0] })
})

// ── GET /api/admin/requests ───────────────────────────────────────
const getAllRequestsAdmin = asyncHandler(async (req, res) => {
  const { page = 1, limit = 30, status } = req.query
  const offset = (page - 1) * limit
  const params = []
  const conditions = []

  if (status) {
    params.push(status)
    conditions.push(`rr.status = $${params.length}`)
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

  const result = await query(
    `SELECT rr.*,
            u.name  AS author_name,
            u.email AS author_email,
            rv.name AS reviewer_name,
            COUNT(c.id) AS comment_count
     FROM   review_requests rr
     JOIN   users u   ON u.id  = rr.author_id
     LEFT JOIN users rv  ON rv.id = rr.reviewer_id
     LEFT JOIN comments c ON c.request_id = rr.id
     ${where}
     GROUP  BY rr.id, u.name, u.email, rv.name
     ORDER  BY rr.created_at DESC
     LIMIT  $${params.length + 1} OFFSET $${params.length + 2}`,
    [...params, limit, offset]
  )

  const total = await query(
    `SELECT COUNT(*) FROM review_requests rr ${where}`,
    params
  )

  res.json({
    requests: result.rows,
    total:    Number(total.rows[0].count),
    page:     Number(page),
    limit:    Number(limit),
  })
})

module.exports = {
  getAdminStats,
  getAllUsers,
  updateUserRole,
  suspendUser,
  getAllRequestsAdmin,
}

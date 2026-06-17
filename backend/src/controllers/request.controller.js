const { validationResult } = require('express-validator')
const { query } = require('../config/db')
const { asyncHandler } = require('../middleware/errorHandler')

// ── GET /api/requests ─────────────────────────────────────────────
// All open requests visible to reviewers, with optional filters
const getAllRequests = asyncHandler(async (req, res) => {
  const { status, language, page = 1, limit = 20 } = req.query
  const offset = (page - 1) * limit
  const params = []
  const conditions = []

  if (status) {
    params.push(status)
    conditions.push(`rr.status = $${params.length}`)
  }
  if (language) {
    params.push(language)
    conditions.push(`rr.language ILIKE $${params.length}`)
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
     LEFT JOIN users rv ON rv.id = rr.reviewer_id
     LEFT JOIN comments c ON c.request_id = rr.id
     ${where}
     GROUP BY rr.id, u.name, u.email, rv.name
     ORDER BY rr.created_at DESC
     LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    [...params, limit, offset]
  )

  res.json({ requests: result.rows, page: Number(page), limit: Number(limit) })
})

// ── GET /api/requests/mine ────────────────────────────────────────
const getMyRequests = asyncHandler(async (req, res) => {
  const result = await query(
    `SELECT rr.*,
            rv.name AS reviewer_name,
            COUNT(c.id) AS comment_count
     FROM   review_requests rr
     LEFT JOIN users rv    ON rv.id = rr.reviewer_id
     LEFT JOIN comments c  ON c.request_id = rr.id
     WHERE  rr.author_id = $1
     GROUP BY rr.id, rv.name
     ORDER BY rr.created_at DESC`,
    [req.user.id]
  )

  res.json({ requests: result.rows })
})

// ── GET /api/requests/:id ─────────────────────────────────────────
const getRequestById = asyncHandler(async (req, res) => {
  const { id } = req.params

  const reqResult = await query(
    `SELECT rr.*,
            u.name  AS author_name,
            u.email AS author_email,
            rv.name AS reviewer_name
     FROM   review_requests rr
     JOIN   users u   ON u.id  = rr.author_id
     LEFT JOIN users rv ON rv.id = rr.reviewer_id
     WHERE  rr.id = $1`,
    [id]
  )

  if (!reqResult.rows[0]) {
    return res.status(404).json({ error: 'Request not found' })
  }

  // Fetch comments for this request
  const commentsResult = await query(
    `SELECT c.*, u.name AS author_name
     FROM   comments c
     JOIN   users u ON u.id = c.author_id
     WHERE  c.request_id = $1
     ORDER  BY c.line_number, c.created_at`,
    [id]
  )

  res.json({
    request:  reqResult.rows[0],
    comments: commentsResult.rows,
  })
})

// ── POST /api/requests ────────────────────────────────────────────
const createRequest = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { title, description, language, code, urgency = 'normal', reviewer_id } = req.body

  if (reviewer_id) {
    const reviewer = await query(
      "SELECT id FROM users WHERE id = $1 AND role IN ('reviewer', 'admin')",
      [reviewer_id]
    )

    if (!reviewer.rows[0]) {
      return res.status(400).json({ error: 'Reviewer must be an active reviewer or admin' })
    }
  }

  const result = await query(
    `INSERT INTO review_requests
       (title, description, language, code, urgency, author_id, reviewer_id, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      title,
      description || null,
      language,
      code,
      urgency,
      req.user.id,
      reviewer_id || null,
      reviewer_id ? 'in-review' : 'pending',
    ]
  )

  // Notify reviewer if one was assigned
  if (reviewer_id) {
    await query(
      `INSERT INTO notifications (user_id, type, message, reference_id)
       VALUES ($1, 'review_assigned', $2, $3)`,
      [reviewer_id, `You have been assigned a new review: "${title}"`, result.rows[0].id]
    )
  }

  res.status(201).json({ request: result.rows[0] })
})

// ── PATCH /api/requests/:id/status ───────────────────────────────
const updateStatus = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { id }     = req.params
  const { status } = req.body

  const existing = await query('SELECT * FROM review_requests WHERE id = $1', [id])
  if (!existing.rows[0]) {
    return res.status(404).json({ error: 'Request not found' })
  }

  const req_row = existing.rows[0]

  // Only author or assigned reviewer can update status
  const isAuthor   = req_row.author_id   === req.user.id
  const isReviewer = req_row.reviewer_id === req.user.id
  const isAdmin    = req.user.role === 'admin'

  if (!isAuthor && !isReviewer && !isAdmin) {
    return res.status(403).json({ error: 'Not authorised to update this request' })
  }

  const result = await query(
    'UPDATE review_requests SET status = $1 WHERE id = $2 RETURNING *',
    [status, id]
  )

  // Notify the author when review is completed
  if (status === 'completed') {
    await query(
      `INSERT INTO notifications (user_id, type, message, reference_id)
       VALUES ($1, 'review_completed', $2, $3)`,
      [req_row.author_id, `Your review request "${req_row.title}" has been completed.`, id]
    )
  }

  res.json({ request: result.rows[0] })
})

// ── PATCH /api/requests/:id/assign ───────────────────────────────
const assignReviewer = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { id }          = req.params
  const { reviewer_id } = req.body

  const existing = await query('SELECT author_id FROM review_requests WHERE id = $1', [id])
  if (!existing.rows[0]) {
    return res.status(404).json({ error: 'Request not found' })
  }

  const isAuthor = existing.rows[0].author_id === req.user.id
  const isAdmin  = req.user.role === 'admin'

  if (!isAuthor && !isAdmin) {
    return res.status(403).json({ error: 'Not authorised to assign this request' })
  }

  const reviewer = await query(
    "SELECT id FROM users WHERE id = $1 AND role IN ('reviewer', 'admin')",
    [reviewer_id]
  )

  if (!reviewer.rows[0]) {
    return res.status(400).json({ error: 'Reviewer must be an active reviewer or admin' })
  }

  const result = await query(
    `UPDATE review_requests
     SET reviewer_id = $1, status = 'in-review'
     WHERE id = $2
     RETURNING *`,
    [reviewer_id, id]
  )

  res.json({ request: result.rows[0] })
})

// ── DELETE /api/requests/:id ──────────────────────────────────────
const deleteRequest = asyncHandler(async (req, res) => {
  const { id } = req.params

  const existing = await query('SELECT author_id FROM review_requests WHERE id = $1', [id])
  if (!existing.rows[0]) {
    return res.status(404).json({ error: 'Request not found' })
  }

  const isAuthor = existing.rows[0].author_id === req.user.id
  const isAdmin  = req.user.role === 'admin'

  if (!isAuthor && !isAdmin) {
    return res.status(403).json({ error: 'Not authorised to delete this request' })
  }

  await query('DELETE FROM review_requests WHERE id = $1', [id])

  res.json({ message: 'Request deleted' })
})

module.exports = {
  getAllRequests,
  getMyRequests,
  getRequestById,
  createRequest,
  updateStatus,
  assignReviewer,
  deleteRequest,
}

const { validationResult } = require('express-validator')
const { query } = require('../config/db')
const { asyncHandler } = require('../middleware/errorHandler')

// ── POST /api/comments ────────────────────────────────────────────
const addComment = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { request_id, line_number, text } = req.body

  // Verify request exists
  const reqCheck = await query(
    'SELECT id, author_id, title FROM review_requests WHERE id = $1',
    [request_id]
  )
  if (!reqCheck.rows[0]) {
    return res.status(404).json({ error: 'Review request not found' })
  }

  const result = await query(
    `INSERT INTO comments (request_id, author_id, line_number, text)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [request_id, req.user.id, line_number, text]
  )

  const comment = result.rows[0]

  // Notify the request author (unless they are commenting on their own)
  const reviewRequest = reqCheck.rows[0]
  if (reviewRequest.author_id !== req.user.id) {
    await query(
      `INSERT INTO notifications (user_id, type, message, reference_id)
       VALUES ($1, 'new_comment', $2, $3)`,
      [
        reviewRequest.author_id,
        `New comment on line ${line_number} in "${reviewRequest.title}"`,
        request_id,
      ]
    )
  }

  // Return comment with author name
  const full = await query(
    `SELECT c.*, u.name AS author_name
     FROM comments c JOIN users u ON u.id = c.author_id
     WHERE c.id = $1`,
    [comment.id]
  )

  res.status(201).json({ comment: full.rows[0] })
})

// ── GET /api/comments?request_id=uuid ────────────────────────────
const getComments = asyncHandler(async (req, res) => {
  const { request_id } = req.query

  if (!request_id) {
    return res.status(400).json({ error: 'request_id query param is required' })
  }

  const result = await query(
    `SELECT c.*, u.name AS author_name
     FROM   comments c
     JOIN   users u ON u.id = c.author_id
     WHERE  c.request_id = $1
     ORDER  BY c.line_number, c.created_at`,
    [request_id]
  )

  res.json({ comments: result.rows })
})

// ── DELETE /api/comments/:id ──────────────────────────────────────
const deleteComment = asyncHandler(async (req, res) => {
  const { id } = req.params

  const existing = await query('SELECT author_id FROM comments WHERE id = $1', [id])
  if (!existing.rows[0]) {
    return res.status(404).json({ error: 'Comment not found' })
  }

  const isAuthor = existing.rows[0].author_id === req.user.id
  const isAdmin  = req.user.role === 'admin'

  if (!isAuthor && !isAdmin) {
    return res.status(403).json({ error: 'Not authorised to delete this comment' })
  }

  await query('DELETE FROM comments WHERE id = $1', [id])

  res.json({ message: 'Comment deleted' })
})

module.exports = { addComment, getComments, deleteComment }
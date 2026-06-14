const { query } = require('../config/db')
const { asyncHandler } = require('../middleware/errorHandler')

// ── GET /api/notifs ───────────────────────────────────────────────
const getNotifs = asyncHandler(async (req, res) => {
  const result = await query(
    `SELECT * FROM notifications
     WHERE  user_id = $1
     ORDER  BY created_at DESC
     LIMIT  50`,
    [req.user.id]
  )

  const unreadCount = result.rows.filter((n) => !n.is_read).length

  res.json({ notifications: result.rows, unread_count: unreadCount })
})

// ── PATCH /api/notifs/:id/read ────────────────────────────────────
const markRead = asyncHandler(async (req, res) => {
  const result = await query(
    `UPDATE notifications
     SET    is_read = TRUE
     WHERE  id = $1 AND user_id = $2
     RETURNING *`,
    [req.params.id, req.user.id]
  )

  if (!result.rows[0]) {
    return res.status(404).json({ error: 'Notification not found' })
  }

  res.json({ notification: result.rows[0] })
})

// ── PATCH /api/notifs/read-all ────────────────────────────────────
const markAllRead = asyncHandler(async (req, res) => {
  await query(
    'UPDATE notifications SET is_read = TRUE WHERE user_id = $1',
    [req.user.id]
  )

  res.json({ message: 'All notifications marked as read' })
})

module.exports = { getNotifs, markRead, markAllRead }
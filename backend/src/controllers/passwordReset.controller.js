const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const { query } = require('../config/db')
const { asyncHandler } = require('../middleware/errorHandler')

// Token expires in 1 hour by default
const RESET_TOKEN_EXPIRES_IN = process.env.RESET_TOKEN_EXPIRES_IN || '1h'

function signResetToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: RESET_TOKEN_EXPIRES_IN })
}

function sanitizeEmailResponse(_email) {
  // Prevent account enumeration
  return { message: 'If an account exists for that email, a reset link will be sent.' }
}

/*
  POST /api/auth/forgot-password
  Body: { email }

  NOTE: This repo currently does not have an email service.
  We implement the flow by returning a reset link token in the response.
  In production you should email the reset link.
*/
const forgotPassword = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { email } = req.body

  const result = await query('SELECT id, email FROM users WHERE email = $1', [email])
  const user = result.rows[0]

  // Always respond with generic message
  if (!user) return res.json(sanitizeEmailResponse(email))

  const token = signResetToken({ userId: user.id, email: user.email, kind: 'password_reset' })

  // For development: return a link so frontend can continue the flow.
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173'
  const resetLink = `${clientUrl}/reset-password?token=${encodeURIComponent(token)}`

  return res.json({
    ...sanitizeEmailResponse(email),
    resetLink,
  })
})

/*
  POST /api/auth/reset-password
  Body: { token, newPassword }
*/
const resetPassword = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { token, newPassword } = req.body

  let decoded
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    return res.status(400).json({ error: 'Invalid or expired reset token' })
  }

  if (!decoded || decoded.kind !== 'password_reset' || !decoded.userId) {
    return res.status(400).json({ error: 'Invalid reset token' })
  }

  const userId = decoded.userId

  const password_hash = await bcrypt.hash(newPassword, 12)
  await query('UPDATE users SET password_hash = $1 WHERE id = $2', [password_hash, userId])

  return res.json({ message: 'Password updated successfully' })
})

module.exports = { forgotPassword, resetPassword }


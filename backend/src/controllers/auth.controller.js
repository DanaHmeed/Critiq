const bcrypt = require('bcryptjs')
const jwt    = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const { query } = require('../config/db')
const { asyncHandler } = require('../middleware/errorHandler')

// ── Helpers ───────────────────────────────────────────────────────
function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )
}

function sanitizeUser(user) {
  const { password_hash, ...safe } = user
  return safe
}

function clientUrl() {
  return process.env.CLIENT_URL || 'http://localhost:5173'
}

function githubCallbackUrl() {
  return (
    process.env.GITHUB_CALLBACK_URL ||
    `${process.env.API_PUBLIC_URL || `http://localhost:${process.env.PORT || 5000}`}/api/auth/github/callback`
  )
}

function redirectWithError(res, message) {
  const url = new URL('/login', clientUrl())
  url.searchParams.set('error', message)
  return res.redirect(url.toString())
}

async function fetchGitHubJson(url, token) {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'User-Agent': 'Critiq',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })

  if (!response.ok) {
    throw new Error(`GitHub request failed (${response.status})`)
  }

  return response.json()
}

async function getGitHubEmail(accessToken, profile) {
  if (profile.email) return profile.email

  const emails = await fetchGitHubJson('https://api.github.com/user/emails', accessToken)
  const primary = emails.find((email) => email.primary && email.verified)
  const verified = emails.find((email) => email.verified)

  return primary?.email || verified?.email || null
}

// ── POST /api/auth/register ───────────────────────────────────────
const register = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { name, email, password, role } = req.body

  // Check duplicate email
  const existing = await query('SELECT id FROM users WHERE email = $1', [email])
  if (existing.rows.length > 0) {
    return res.status(409).json({ error: 'Email already registered' })
  }

  const password_hash = await bcrypt.hash(password, 12)

  const result = await query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [name, email, password_hash, role]
  )

  const user  = result.rows[0]
  const token = signToken(user)

  res.status(201).json({ token, user: sanitizeUser(user) })
})

// ── POST /api/auth/login ──────────────────────────────────────────
const login = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { email, password } = req.body

  const result = await query('SELECT * FROM users WHERE email = $1', [email])
  const user   = result.rows[0]

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }

  const valid = await bcrypt.compare(password, user.password_hash)
  if (!valid) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }

  const token = signToken(user)

  res.json({ token, user: sanitizeUser(user) })
})

// GET /api/auth/github
const githubLogin = asyncHandler(async (_req, res) => {
  if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
    return redirectWithError(res, 'GitHub login is not configured')
  }

  const state = jwt.sign(
    { provider: 'github', nonce: Math.random().toString(36).slice(2) },
    process.env.JWT_SECRET,
    { expiresIn: '10m' }
  )

  const url = new URL('https://github.com/login/oauth/authorize')
  url.searchParams.set('client_id', process.env.GITHUB_CLIENT_ID)
  url.searchParams.set('redirect_uri', githubCallbackUrl())
  url.searchParams.set('scope', 'read:user user:email')
  url.searchParams.set('state', state)

  res.redirect(url.toString())
})

// GET /api/auth/github/callback
const githubCallback = asyncHandler(async (req, res) => {
  const { code, state, error } = req.query

  if (error) {
    return redirectWithError(res, String(error))
  }

  if (!code || !state) {
    return redirectWithError(res, 'Missing GitHub authorization response')
  }

  try {
    const decoded = jwt.verify(state, process.env.JWT_SECRET)
    if (decoded.provider !== 'github') {
      return redirectWithError(res, 'Invalid GitHub login state')
    }
  } catch {
    return redirectWithError(res, 'GitHub login expired. Please try again.')
  }

  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': 'Critiq',
    },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: githubCallbackUrl(),
    }),
  })

  const tokenData = await tokenResponse.json()
  if (!tokenResponse.ok || tokenData.error || !tokenData.access_token) {
    return redirectWithError(res, tokenData.error_description || 'GitHub login failed')
  }

  const profile = await fetchGitHubJson('https://api.github.com/user', tokenData.access_token)
  const email = await getGitHubEmail(tokenData.access_token, profile)

  if (!email) {
    return redirectWithError(res, 'GitHub account has no verified email')
  }

  const existing = await query('SELECT * FROM users WHERE email = $1', [email])
  let user = existing.rows[0]

  if (!user) {
    const passwordHash = await bcrypt.hash(`github:${profile.id}:${Date.now()}`, 12)
    const result = await query(
      `INSERT INTO users (name, email, password_hash, role, bio)
       VALUES ($1, $2, $3, 'requester', $4)
       RETURNING *`,
      [
        profile.name || profile.login || 'GitHub User',
        email,
        passwordHash,
        profile.bio || null,
      ]
    )
    user = result.rows[0]
  }

  const token = signToken(user)
  const callback = new URL('/auth/callback', clientUrl())
  callback.searchParams.set('token', token)
  callback.searchParams.set('user', JSON.stringify(sanitizeUser(user)))

  res.redirect(callback.toString())
})

// ── GET /api/auth/me ──────────────────────────────────────────────
const getMe = asyncHandler(async (req, res) => {
  const result = await query(
    'SELECT id, name, email, role, bio, review_count, created_at FROM users WHERE id = $1',
    [req.user.id]
  )

  if (!result.rows[0]) {
    return res.status(404).json({ error: 'User not found' })
  }

  res.json({ user: result.rows[0] })
})

module.exports = { register, login, getMe, githubLogin, githubCallback }

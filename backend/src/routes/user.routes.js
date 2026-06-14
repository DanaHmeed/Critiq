const express = require('express')
const { body } = require('express-validator')
const { getProfile, updateProfile, listReviewers } = require('../controllers/user.controller')
const { protect } = require('../middleware/auth')

const router = express.Router()

router.use(protect)

// GET  /api/users/reviewers   — list users with reviewer role
router.get('/reviewers', listReviewers)

// GET  /api/users/:id         — get any user's public profile
router.get('/:id', getProfile)

// PATCH /api/users/me         — update own profile
router.patch(
  '/me',
  [
    body('name').optional().trim().notEmpty(),
    body('bio').optional().trim(),
  ],
  updateProfile
)

module.exports = router
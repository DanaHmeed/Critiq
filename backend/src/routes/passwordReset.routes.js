const express = require('express')
const { body } = require('express-validator')
const { forgotPassword, resetPassword } = require('../controllers/passwordReset.controller')

const router = express.Router()

router.post(
  '/forgot-password',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  ],
  forgotPassword
)

router.post(
  '/reset-password',
  [
    body('token').notEmpty().withMessage('Reset token is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  ],
  resetPassword
)

module.exports = router


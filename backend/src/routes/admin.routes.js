const express = require('express')
const {
  getAllUsers,
  updateUserRole,
  suspendUser,
  getAdminStats,
  getAllRequestsAdmin,
} = require('../controllers/admin.controller')
const { protect, restrictTo } = require('../middleware/auth')

const router = express.Router()

// All admin routes require auth + admin role
router.use(protect, restrictTo('admin'))

// GET  /api/admin/stats        — platform overview stats
router.get('/stats', getAdminStats)

// GET  /api/admin/users        — list all users
router.get('/users', getAllUsers)

// PATCH /api/admin/users/:id/role     — change user role
router.patch('/users/:id/role', updateUserRole)

// PATCH /api/admin/users/:id/suspend  — suspend / unsuspend user
router.patch('/users/:id/suspend', suspendUser)

// GET  /api/admin/requests     — all requests with full detail
router.get('/requests', getAllRequestsAdmin)

module.exports = router
// backend/src/routes/request.routes.js
const express = require('express')
const { body } = require('express-validator')
const {
  getAllRequests,
  getMyRequests,
  getRequestById,
  createRequest,
  updateStatus,
  assignReviewer,
  deleteRequest,
} = require('../controllers/request.controller')
const { protect, restrictTo } = require('../middleware/auth')

const router = express.Router()

// All routes require auth
router.use(protect)

// GET  /api/requests           — browse open requests (reviewers)
router.get('/', getAllRequests)

// GET  /api/requests/mine      — my submitted requests
router.get('/mine', getMyRequests)

router.get('/:id', getRequestById)

// POST /api/requests           — submit new review request
router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('code').notEmpty().withMessage('Code is required'),
    body('language').notEmpty().withMessage('Language is required'),
    body('urgency').optional().isIn(['low', 'normal', 'high']),
    body('reviewer_id').optional({ nullable: true }).isUUID().withMessage('Valid reviewer UUID required'),
  ],
  createRequest
)

router.patch('/:id/status',
  [body('status').isIn(['pending', 'in-review', 'completed', 'rejected'])],
  updateStatus
)

// PATCH /api/requests/:id/assign   — assign reviewer
router.patch('/:id/assign',
  [body('reviewer_id').isUUID().withMessage('Valid reviewer UUID required')],
  assignReviewer
)

// DELETE /api/requests/:id     — author or admin only
router.delete('/:id', deleteRequest)

module.exports = router

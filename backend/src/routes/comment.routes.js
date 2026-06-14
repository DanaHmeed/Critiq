const express = require('express')
const { body } = require('express-validator')
const { addComment, getComments, deleteComment } = require('../controllers/comment.controller')
const { protect } = require('../middleware/auth')

const router = express.Router()

router.use(protect)

router.post(
  '/',
  [
    body('request_id').isUUID().withMessage('Valid request UUID required'),
    body('line_number').isInt({ min: 1 }).withMessage('Line number must be a positive integer'),
    body('text').trim().notEmpty().withMessage('Comment text is required'),
  ],
  addComment
)

// GET /api/comments?request_id=uuid
router.get('/', getComments)

// DELETE /api/comments/:id
router.delete('/:id', deleteComment)

module.exports = router
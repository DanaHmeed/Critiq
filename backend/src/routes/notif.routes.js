const express = require('express')
const { getNotifs, markRead, markAllRead } = require('../controllers/notif.controller')
const { protect } = require('../middleware/auth')

const router = express.Router()

router.use(protect)

// GET   /api/notifs          — get my notifications
router.get('/',            getNotifs)

// PATCH /api/notifs/:id/read — mark one as read
router.patch('/:id/read',  markRead)

// PATCH /api/notifs/read-all — mark all as read
router.patch('/read-all',  markAllRead)

module.exports = router
const express = require('express')
const router = express.Router()
const { giveFeedback, getFeedback } = require('../controllers/feedbackController')
const { protect } = require('../middleware/auth')

router.post('/give', protect, giveFeedback)
router.get('/:userId', protect, getFeedback)

module.exports = router
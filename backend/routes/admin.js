const express = require('express')
const router = express.Router()
const { getAllUsers, banUser, unbanUser, deleteFeedback, getAllFeedbacks, getStats } = require('../controllers/adminController')
const { protect } = require('../middleware/auth')
const adminAuth = require('../middleware/adminAuth')

router.use(protect, adminAuth) // Sab routes protected

router.get('/stats', getStats)
router.get('/users', getAllUsers)
router.put('/users/:id/ban', banUser)
router.put('/users/:id/unban', unbanUser)
router.get('/feedbacks', getAllFeedbacks)
router.delete('/feedbacks/:id', deleteFeedback)

module.exports = router
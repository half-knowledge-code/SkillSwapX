const express = require('express')
const router = express.Router()
const { addSkill, removeSkill, updateProfile, getAllUsers, getLeaderboard } = require('../controllers/userController')
const { protect } = require('../middleware/auth')

router.get('/leaderboard', protect, getLeaderboard)
router.get('/', protect, getAllUsers)
router.put('/profile', protect, updateProfile)
router.post('/skills/add', protect, addSkill)
router.post('/skills/remove', protect, removeSkill)

module.exports = router
const express = require('express')
const router = express.Router()
const { sendRequest, getMyRequests, updateRequest } = require('../controllers/exchangeController')
const { protect } = require('../middleware/auth')

router.post('/send', protect, sendRequest)
router.get('/my', protect, getMyRequests)
router.put('/:id', protect, updateRequest)

module.exports = router
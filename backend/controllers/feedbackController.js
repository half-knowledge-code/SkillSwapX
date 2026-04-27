const Feedback = require('../models/Feedback')
const User = require('../models/User')
const Exchange = require('../models/Exchange')

// Feedback do
const giveFeedback = async (req, res) => {
  try {
    const { receiverId, exchangeId, rating, comment } = req.body

    // Exchange accepted hai?
    const exchange = await Exchange.findById(exchangeId)
    if (!exchange || exchange.status !== 'accepted') {
      return res.status(400).json({ message: 'Sirf accepted exchanges pe feedback de sakte ho!' })
    }

    // Already diya?
    const exists = await Feedback.findOne({
      sender: req.user._id, exchangeId
    })
    if (exists) return res.status(400).json({ message: 'Is exchange pe feedback already de diya!' })

    const feedback = await Feedback.create({
      receiver: receiverId,
      exchangeId,
      rating,
      comment,
      sender: req.user._id
    })

    // User ka rating update karo
    const allFeedbacks = await Feedback.find({ receiver: receiverId })
    const avgRating = allFeedbacks.reduce((sum, f) => sum + f.rating, 0) / allFeedbacks.length
    await User.findByIdAndUpdate(receiverId, {
      rating: Math.round(avgRating * 10) / 10,
      totalReviews: allFeedbacks.length,
      $inc: { xp: 20 }
    })

    res.status(201).json({ success: true, feedback })
  } catch (err) {
    res.status(500).json({ message: 'Server error!', error: err.message })
  }
}

// Kisi ka feedback dekho — sender hidden
const getFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ receiver: req.params.userId })
      .select('-sender') // Sender KABHI show nahi hoga!
      .sort({ createdAt: -1 })

    res.json({ success: true, feedbacks })
  } catch (err) {
    res.status(500).json({ message: 'Server error!', error: err.message })
  }
}

module.exports = { giveFeedback, getFeedback }
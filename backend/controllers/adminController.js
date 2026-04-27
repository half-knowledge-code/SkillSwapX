const User = require('../models/User')
const Feedback = require('../models/Feedback')
const Exchange = require('../models/Exchange')

// Sab users dekho
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 })
    res.json({ success: true, users })
  } catch (err) {
    res.status(500).json({ message: 'Server error!' })
  }
}

// User ban karo
const banUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBanned: true },
      { new: true }
    ).select('-password')
    res.json({ success: true, user })
  } catch (err) {
    res.status(500).json({ message: 'Server error!' })
  }
}

// User unban karo
const unbanUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBanned: false },
      { new: true }
    ).select('-password')
    res.json({ success: true, user })
  } catch (err) {
    res.status(500).json({ message: 'Server error!' })
  }
}

// Feedback delete karo
const deleteFeedback = async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'Feedback delete ho gaya!' })
  } catch (err) {
    res.status(500).json({ message: 'Server error!' })
  }
}

// Sab feedbacks dekho
const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate('receiver', 'name email')
      .populate('sender', 'name email')
      .sort({ createdAt: -1 })
    res.json({ success: true, feedbacks })
  } catch (err) {
    res.status(500).json({ message: 'Server error!' })
  }
}

// Stats
const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments()
    const bannedUsers = await User.countDocuments({ isBanned: true })
    const totalExchanges = await Exchange.countDocuments()
    const acceptedExchanges = await Exchange.countDocuments({ status: 'accepted' })
    const totalFeedbacks = await Feedback.countDocuments()

    res.json({
      success: true,
      stats: { totalUsers, bannedUsers, totalExchanges, acceptedExchanges, totalFeedbacks }
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error!' })
  }
}

module.exports = { getAllUsers, banUser, unbanUser, deleteFeedback, getAllFeedbacks, getStats }
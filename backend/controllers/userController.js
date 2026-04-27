const User = require('../models/User')

// Skills add karo
const addSkill = async (req, res) => {
  try {
    const { skill, type } = req.body
    const user = await User.findById(req.user._id)

    if (type === 'offered') {
      if (user.skillsOffered.includes(skill)) {
        return res.status(400).json({ message: 'Skill already hai!' })
      }
      user.skillsOffered.push(skill)
    } else {
      if (user.skillsWanted.includes(skill)) {
        return res.status(400).json({ message: 'Skill already hai!' })
      }
      user.skillsWanted.push(skill)
    }

    await user.save()
    res.json({ success: true, user })
  } catch (err) {
    res.status(500).json({ message: 'Server error!', error: err.message })
  }
}

// Skill remove karo
const removeSkill = async (req, res) => {
  try {
    const { skill, type } = req.body
    const user = await User.findById(req.user._id)

    if (type === 'offered') {
      user.skillsOffered = user.skillsOffered.filter(s => s !== skill)
    } else {
      user.skillsWanted = user.skillsWanted.filter(s => s !== skill)
    }

    await user.save()
    res.json({ success: true, user })
  } catch (err) {
    res.status(500).json({ message: 'Server error!', error: err.message })
  }
}

// Profile update karo
const updateProfile = async (req, res) => {
  try {
    const { name, bio } = req.body
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, bio },
      { new: true }
    ).select('-password')

    res.json({ success: true, user })
  } catch (err) {
    res.status(500).json({ message: 'Server error!', error: err.message })
  }
}

// Sab users get karo matching ke liye
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.user._id },
      isBanned: { $ne: true }
    }).select('-password')
    res.json({ success: true, users })
  } catch (err) {
    res.status(500).json({ message: 'Server error!', error: err.message })
  }
}

// Leaderboard
const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({ isBanned: { $ne: true } })
      .select('-password')
      .sort({ xp: -1 })
      .limit(200)
    res.json({ success: true, users })
  } catch (err) {
    res.status(500).json({ message: 'Server error!', error: err.message })
  }
}

module.exports = { addSkill, removeSkill, updateProfile, getAllUsers, getLeaderboard }
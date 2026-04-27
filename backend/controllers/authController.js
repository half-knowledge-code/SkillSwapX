const User = require('../models/User')
const jwt = require('jsonwebtoken')

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE })
}

// Register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    const exists = await User.findOne({ email })
    if (exists) return res.status(400).json({ message: 'Email already registered hai!' })

    const user = await User.create({ name, email, password })

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, xp: user.xp }
    })
} catch (err) {
  console.log('REGISTER ERROR:', err) // ye add karo
  res.status(500).json({ message: 'Server error!', error: err.message })
}
}

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ message: 'Email ya password galat hai!' })

    const isMatch = await user.comparePassword(password)
    if (!isMatch) return res.status(400).json({ message: 'Email ya password galat hai!' })

    res.json({
      success: true,
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, xp: user.xp }
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error!', error: err.message })
  }
}

// Get current user
const getMe = async (req, res) => {
  res.json({ success: true, user: req.user })
}

module.exports = { register, login, getMe }
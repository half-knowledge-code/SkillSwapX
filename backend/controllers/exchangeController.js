const Exchange = require('../models/Exchange')
const User = require('../models/User')

// Request bhejo
const sendRequest = async (req, res) => {
  try {
    const { receiverId, skillOffered, skillWanted, message } = req.body

    const exists = await Exchange.findOne({
      sender: req.user._id, receiver: receiverId, status: 'pending'
    })
    if (exists) return res.status(400).json({ message: 'Request already bheji hai!' })

    const exchange = await Exchange.create({
      sender: req.user._id,
      receiver: receiverId,
      skillOffered, skillWanted, message
    })

    // XP add karo sender ko
    await User.findByIdAndUpdate(req.user._id, { $inc: { xp: 10 } })

    res.status(201).json({ success: true, exchange })
  } catch (err) {
    res.status(500).json({ message: 'Server error!', error: err.message })
  }
}

// Apni requests dekho
const getMyRequests = async (req, res) => {
  try {
    const sent = await Exchange.find({ sender: req.user._id })
      .populate('receiver', 'name email skillsOffered skillsWanted')
    const received = await Exchange.find({ receiver: req.user._id })
      .populate('sender', 'name email skillsOffered skillsWanted')

    res.json({ success: true, sent, received })
  } catch (err) {
    res.status(500).json({ message: 'Server error!', error: err.message })
  }
}

// Request accept/reject karo
const updateRequest = async (req, res) => {
  try {
    const { status } = req.body
    const exchange = await Exchange.findById(req.params.id)

    if (!exchange) return res.status(404).json({ message: 'Request nahi mili!' })
    if (exchange.receiver.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Unauthorized!' })
    }

    exchange.status = status
    await exchange.save()

    // XP add karo accept hone pe
    if (status === 'accepted') {
      await User.findByIdAndUpdate(req.user._id, { $inc: { xp: 50 } })
      await User.findByIdAndUpdate(exchange.sender, { $inc: { xp: 50 } })
    }

    res.json({ success: true, exchange })
  } catch (err) {
    res.status(500).json({ message: 'Server error!', error: err.message })
  }
}

module.exports = { sendRequest, getMyRequests, updateRequest }
const Message = require('../models/Message')

// Messages fetch karo
const getMessages = async (req, res) => {
  try {
    const { userId } = req.params
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id }
      ]
    }).sort({ createdAt: 1 })

    res.json({ success: true, messages })
  } catch (err) {
    res.status(500).json({ message: 'Server error!', error: err.message })
  }
}

// Message save karo
const saveMessage = async (senderId, receiverId, message) => {
  const msg = await Message.create({
    sender: senderId, receiver: receiverId, message
  })
  return msg
}

module.exports = { getMessages, saveMessage }
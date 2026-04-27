const { saveMessage } = require('../controllers/chatController')

const socketHandler = (io) => {
  const onlineUsers = new Map()

  io.on('connection', (socket) => {
    console.log('🔌 User connected:', socket.id)

    // User online ho gaya
    socket.on('user_online', (userId) => {
      onlineUsers.set(userId, socket.id)
      io.emit('online_users', Array.from(onlineUsers.keys()))
    })

    // Message bhejo
    socket.on('send_message', async (data) => {
      const { senderId, receiverId, message } = data
      try {
        const saved = await saveMessage(senderId, receiverId, message)
        const receiverSocket = onlineUsers.get(receiverId)
        if (receiverSocket) {
          io.to(receiverSocket).emit('receive_message', saved)
        }
        socket.emit('message_sent', saved)
      } catch (err) {
        console.log('Message error:', err)
      }
    })

    // Disconnect
    socket.on('disconnect', () => {
      onlineUsers.forEach((socketId, userId) => {
        if (socketId === socket.id) onlineUsers.delete(userId)
      })
      io.emit('online_users', Array.from(onlineUsers.keys()))
      console.log('❌ User disconnected:', socket.id)
    })
  })
}

module.exports = socketHandler
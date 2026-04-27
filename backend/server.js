const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const http = require('http')
const socketIO = require('socket.io')
const socketHandler = require('./socket/socketHandler')
require('dotenv').config()

const app = express()
const server = http.createServer(app)
const io = socketIO(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
})

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}))
app.use(express.json())

// Routes
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/users')
const exchangeRoutes = require('./routes/exchanges')
const chatRoutes = require('./routes/chat')
const feedbackRoutes = require('./routes/feedback')
const adminRoutes = require('./routes/admin')
app.use('/api/admin', adminRoutes)

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/exchanges', exchangeRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/feedback', feedbackRoutes)

// Test Route
app.get('/', (req, res) => {
  res.json({ message: '🚀 SkillSwapX Backend is Running!' })
})

// MongoDB Connect
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected!'))
  .catch((err) => console.log('❌ MongoDB Error:', err))

// Socket.io
socketHandler(io)

// Start Server
const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
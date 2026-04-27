const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  name: {
    type: String, required: true, trim: true
  },
  email: {
    type: String, required: true, unique: true, lowercase: true
  },
  password: {
    type: String, required: true, minlength: 6
  },
  isDummy: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  isBanned: { type: Boolean, default: false },
  skillsOffered: [{ type: String }],
  skillsWanted: [{ type: String }],
  bio: { type: String, default: '' },
  avatar: { type: String, default: '' },
  xp: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
}, { timestamps: true })

// Password hash
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Password compare
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model('User', userSchema)
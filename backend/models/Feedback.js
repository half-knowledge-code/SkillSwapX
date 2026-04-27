const mongoose = require('mongoose')

const feedbackSchema = new mongoose.Schema({
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  exchangeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exchange', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  // Sender kabhi reveal nahi hoga!
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true })

module.exports = mongoose.model('Feedback', feedbackSchema)
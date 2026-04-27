const mongoose = require('mongoose')
const User = require('./models/User')
require('dotenv').config()

const makeAdmin = async () => {
  await mongoose.connect(process.env.MONGODB_URI)
  
  // Apna email daalo yahan
  const user = await User.findOneAndUpdate(
    { email: 'shubham12@gmail.com' },
    { isAdmin: true },
    { new: true }
  )
  
  if (user) {
    console.log(`✅ ${user.name} ko admin bana diya!`)
  } else {
    console.log('❌ User nahi mila!')
  }
  process.exit(0)
}

makeAdmin()
require('dotenv').config();
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("DB Connected in Seed ✅"))
  .catch((err) => console.log(err));
const bcrypt = require('bcryptjs')
require('dotenv').config()

const User = require('./models/User')

const skills = [
  '⚛️ React.js', '🐍 Python', '🎨 UI Design', '📸 Photography',
  '🎵 Music Theory', '✍️ Copywriting', '🎬 Video Editing',
  '📊 Data Science', '🛠 Node.js', '🎮 Game Dev', '📱 Flutter',
  '🔐 Cybersecurity', '☁️ Cloud AWS', '🤖 Machine Learning',
  '🌐 Web Design', '📈 SEO', '🎯 Marketing', '🗣 Public Speaking',
  '📝 Content Writing', '🎸 Guitar', '🏋️ Fitness', '🍳 Cooking',
  '📱 React Native', '🔧 DevOps', '🎭 Acting'
]

const names = [
  'Aarav Sharma', 'Priya Patel', 'Rohit Kumar', 'Sneha Singh',
  'Arjun Mehta', 'Pooja Verma', 'Vikram Joshi', 'Ananya Gupta',
  'Karan Malhotra', 'Riya Shah', 'Aditya Rao', 'Kavya Nair',
  'Rahul Tiwari', 'Divya Agarwal', 'Nikhil Reddy', 'Shreya Bose',
  'Manish Yadav', 'Nisha Pandey', 'Suresh Iyer', 'Meera Krishnan',
  'Amit Saxena', 'Deepika Chauhan', 'Rajesh Mishra', 'Sunita Desai',
  'Varun Kapoor', 'Ankita Bhatt', 'Sanjay Dubey', 'Rekha Pillai',
  'Gaurav Sinha', 'Pallavi Menon', 'Tushar Ghosh', 'Swati Jain',
  'Harish Nair', 'Lalita Sharma', 'Dinesh Patel', 'Geeta Verma',
  'Ravi Shankar', 'Uma Devi', 'Ajay Singh', 'Shobha Rao',
  'Manoj Kumar', 'Lata Gupta', 'Sunil Mehta', 'Kamla Joshi',
  'Vijay Malhotra', 'Savita Shah', 'Ashok Tiwari', 'Radha Agarwal',
  'Mohan Reddy', 'Gita Bose', 'Ramesh Yadav', 'Sita Pandey',
  'Krishna Iyer', 'Durga Krishnan', 'Gopal Saxena', 'Parvati Chauhan',
  'Shyam Mishra', 'Lakshmi Desai', 'Balram Kapoor', 'Saraswati Bhatt',
  'Dev Dubey', 'Indira Pillai', 'Jay Sinha', 'Tara Menon',
  'Om Ghosh', 'Nandita Jain', 'Ram Nair', 'Leela Sharma',
  'Shiv Patel', 'Mandira Verma', 'Hari Shankar', 'Champa Devi',
  'Prakash Singh', 'Vimla Rao', 'Naresh Kumar', 'Santosh Gupta',
  'Hemant Mehta', 'Pushpa Joshi', 'Yogesh Malhotra', 'Sudha Shah',
  'Prem Tiwari', 'Nirmala Agarwal', 'Satish Reddy', 'Shakuntala Bose',
  'Girish Yadav', 'Madhuri Pandey', 'Tarun Iyer', 'Saroj Krishnan',
  'Vivek Saxena', 'Usha Chauhan', 'Deepak Mishra', 'Asha Desai',
  'Anil Kapoor', 'Suman Bhatt', 'Rakesh Dubey', 'Mala Pillai',
  'Suresh Sinha', 'Veena Menon', 'Navin Ghosh', 'Shanta Jain'
]

const getRandomItems = (arr, min, max) => {
  const count = Math.floor(Math.random() * (max - min + 1)) + min
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ MongoDB Connected!')

    // Purane dummy users delete karo
    await User.deleteMany({ isDummy: true })
    console.log('🗑️ Purane dummy users delete kiye!')

    const hashedPassword = await bcrypt.hash('password123', 10)
    const users = []

    for (let i = 0; i < 100; i++) {
      const offeredSkills = getRandomItems(skills, 1, 4)
      const remainingSkills = skills.filter(s => !offeredSkills.includes(s))
      const wantedSkills = getRandomItems(remainingSkills, 1, 3)

      users.push({
        name: names[i] || `Student ${i + 1}`,
        email: `student${i + 1}@skillswapx.com`,
        password: hashedPassword,
        skillsOffered: offeredSkills,
        skillsWanted: wantedSkills,
        xp: Math.floor(Math.random() * 3000),
        rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
        totalReviews: Math.floor(Math.random() * 50),
        bio: `Hi! Main ${names[i] || `Student ${i + 1}`} hoon. Skills share karna pasand hai!`,
        isDummy: true
      })
    }

    await User.insertMany(users)
    console.log('✅ 100 dummy students add kiye!')
    console.log('🎉 Seed complete!')
    process.exit(0)
  } catch (err) {
    console.log('❌ Error:', err.message)
    process.exit(1)
  }
}

seedDatabase()
const mongoose = require('mongoose');

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI is not defined in environment variables. Database connection deferred.');
    return;
  }
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Create demo user on startup
    setTimeout(async () => {
      try {
        const User = require('../models/User');
        const bcrypt = require('bcryptjs');
        const demo = await User.findOne({ email: process.env.DEMO_EMAIL || 'demo@startupiq.ai' });
        if (!demo) {
          const hash = await bcrypt.hash(process.env.DEMO_PASSWORD || 'Demo@12345', 12);
          await User.create({
            fullName: 'Demo User',
            email: process.env.DEMO_EMAIL || 'demo@startupiq.ai',
            password: hash,
            isDemo: true,
            isVerified: true,
            role: 'demo',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo'
          });
          console.log('✅ Demo user created');
        }
      } catch (e) {
        console.log('Demo user setup:', e.message);
      }
    }, 2000);

  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
  }
};

module.exports = connectDB;

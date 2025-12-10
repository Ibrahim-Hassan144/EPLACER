// config/db.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);

    // seed admin if none exists
    const adminExists = await User.exists({ role: 'admin' });
    if (!adminExists) {
      const password = 'admin123';
      const hashed = await bcrypt.hash(password, 10);
      const admin = new User({
        name: 'Admin',
        email: 'admin@eplacer.test',
        password: hashed,
        role: 'admin',
      });
      await admin.save();
      console.log('Seeded default admin -> admin@eplacer.test / admin123');
    }
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;

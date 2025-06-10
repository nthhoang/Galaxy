const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB for creating admin');

    const adminExists = await User.findOne({ email: 'admin@cosmo.com' });
    if (adminExists) {
      console.log('Admin account already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash('123456', 10);
    const admin = new User({
      username: 'admin',
      email: 'admin@cosmo.com',
      password: hashedPassword,
      role: 'admin',
    });
    await admin.save();
    console.log('Admin created!');
  } catch (error) {
    console.error('Error creating admin:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
  }
}

if (require.main === module) {
  createAdmin().catch(console.error);
}

module.exports = { createAdmin };
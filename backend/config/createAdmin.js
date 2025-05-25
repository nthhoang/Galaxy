const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');

mongoose.connect('mongodb://localhost:27017/vutru');

(async () => {
  const hashedPassword = await bcrypt.hash('123456', 10);
  const admin = new User({
    username: 'admin',
    email: 'admin@cosmo.com',
    password: hashedPassword,
    role: 'admin'
  });

  await admin.save();
  console.log('Admin created!');
  mongoose.disconnect();
})();

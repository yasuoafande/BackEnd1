require('dotenv').config();

const connectDB = require('../src/config/db');
const User = require('../src/models/User');

async function seedAdmin() {
  await connectDB();

  const name = process.env.ADMIN_NAME || 'Admin';
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD are required');
  }

  const existingAdmin = await User.findOne({ email });

  if (existingAdmin) {
    existingAdmin.name = name;
    existingAdmin.role = 'admin';
    existingAdmin.isActive = true;
    await existingAdmin.save();
    console.log(`Admin updated: ${email}`);
    return;
  }

  await User.create({
    name,
    email,
    password,
    role: 'admin',
  });

  console.log(`Admin created: ${email}`);
}

seedAdmin()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    const mongoose = require('mongoose');
    await mongoose.disconnect();
  });

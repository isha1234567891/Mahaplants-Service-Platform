const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const createWorker = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mahaplants');
    console.log('Connected to MongoDB');

    // Check if worker already exists
    const existingWorker = await User.findOne({ role: 'worker' });
    if (existingWorker) {
      console.log('Worker user already exists:', existingWorker.email);
      process.exit(0);
    }

    // Create worker user
    const workerUser = new User({
      name: 'Plant Care Worker',
      email: 'worker@mahaplants.com',
      password: 'worker123',
      role: 'worker',
      phone: '9876543210',
      address: {
        street: 'Worker Street',
        city: 'Worker City',
        state: 'Worker State',
        zipCode: '654321',
        country: 'India'
      }
    });

    await workerUser.save();
    console.log('Worker user created successfully!');
    console.log('Email: worker@mahaplants.com');
    console.log('Password: worker123');

  } catch (error) {
    console.error('Error creating worker user:', error);
  } finally {
    mongoose.connection.close();
  }
};

createWorker();
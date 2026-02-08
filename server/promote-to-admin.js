const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const promoteToAdmin = async (email) => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mahaplants');
    console.log('Connected to MongoDB');

    // Find and update user
    const user = await User.findOneAndUpdate(
      { email: email },
      { role: 'admin' },
      { new: true }
    );

    if (!user) {
      console.log('User not found with email:', email);
      process.exit(1);
    }

    console.log('User promoted to admin successfully!');
    console.log('Name:', user.name);
    console.log('Email:', user.email);
    console.log('Role:', user.role);

  } catch (error) {
    console.error('Error promoting user to admin:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Get email from command line argument
const email = process.argv[2];
if (!email) {
  console.log('Usage: node promote-to-admin.js <email>');
  console.log('Example: node promote-to-admin.js user@example.com');
  process.exit(1);
}

promoteToAdmin(email);
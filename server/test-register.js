require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function testRegister() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Test user data
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };

    // Check if user exists
    const existing = await User.findOne({ email: testUser.email });
    if (existing) {
      await User.deleteOne({ email: testUser.email });
      console.log('🗑️ Deleted existing test user');
    }

    // Create new user
    const user = new User(testUser);
    await user.save();
    console.log('✅ User created successfully:', user.email);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testRegister();
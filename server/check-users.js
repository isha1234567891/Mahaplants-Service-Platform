const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const users = await User.find({}, 'name email role');
    console.log('\n=== EXISTING USERS ===');
    
    if (users.length === 0) {
      console.log('No users found in database');
    } else {
      users.forEach((user, index) => {
        console.log(`${index + 1}. Name: ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log('---');
      });
    }

    const adminUsers = users.filter(user => user.role === 'admin');
    console.log(`\nAdmin users found: ${adminUsers.length}`);
    
    if (adminUsers.length === 0) {
      console.log('\n⚠️  NO ADMIN USERS FOUND!');
      console.log('To access admin panel, you need to:');
      console.log('1. Run: node promote-to-admin.js your-email@example.com');
      console.log('2. Or create new admin: node create-admin.js');
    } else {
      console.log('\n✅ Admin access available with:');
      adminUsers.forEach(admin => {
        console.log(`   - ${admin.email}`);
      });
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
};

checkUsers();
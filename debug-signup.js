require('dotenv').config({ path: './server/.env' });
const mongoose = require('mongoose');

console.log('🔍 Debugging Signup Issues...\n');

// 1. Check environment variables
console.log('1. Environment Variables:');
console.log('   PORT:', process.env.PORT);
console.log('   JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Missing');
console.log('   MONGODB_URI:', process.env.MONGODB_URI ? '✅ Set' : '❌ Missing');
console.log('   NODE_ENV:', process.env.NODE_ENV);
console.log('   CORS_ORIGIN:', process.env.CORS_ORIGIN);

// 2. Test MongoDB connection
console.log('\n2. Testing MongoDB Connection...');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('   ✅ MongoDB connected successfully');
    
    // 3. Test User model
    console.log('\n3. Testing User Model...');
    const User = require('./server/models/User');
    
    const testUser = new User({
      name: 'Debug Test',
      email: 'debug@test.com',
      password: 'TestPass123!'
    });
    
    return testUser.validate();
  })
  .then(() => {
    console.log('   ✅ User model validation passed');
    
    // 4. Test bcrypt
    console.log('\n4. Testing bcrypt...');
    const bcrypt = require('bcryptjs');
    const testPassword = 'TestPass123!';
    const hash = bcrypt.hashSync(testPassword, 12);
    const isValid = bcrypt.compareSync(testPassword, hash);
    console.log('   ✅ bcrypt working:', isValid);
    
    // 5. Test JWT
    console.log('\n5. Testing JWT...');
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: 'test123' }, process.env.JWT_SECRET, { expiresIn: '30d' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('   ✅ JWT working:', decoded.id === 'test123');
    
    console.log('\n✅ All core components working!');
    console.log('\n📋 Next Steps:');
    console.log('   1. Start server: cd server && npm run dev');
    console.log('   2. Start client: cd client && npm start');
    console.log('   3. Try signup at http://localhost:3000/signup');
    
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
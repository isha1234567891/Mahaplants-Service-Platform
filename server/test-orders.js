require('dotenv').config();
const mongoose = require('mongoose');
const SimpleOrder = require('./models/SimpleOrder');

async function testOrders() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if any orders exist
    const orders = await SimpleOrder.find();
    console.log('Orders in database:', orders.length);
    
    if (orders.length > 0) {
      console.log('Latest order:', orders[orders.length - 1]);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testOrders();
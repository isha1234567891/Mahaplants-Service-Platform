const mongoose = require('mongoose');

const simpleOrderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true
  },
  items: [{
    name: String,
    price: Number,
    quantity: Number,
    potSize: String
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  customerInfo: {
    name: { type: String, default: 'Customer' },
    email: { type: String, default: 'customer@example.com' }
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Generate order number before saving
simpleOrderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await this.constructor.countDocuments();
    this.orderNumber = `MP${Date.now()}${count + 1}`;
  }
  next();
});

module.exports = mongoose.model('SimpleOrder', simpleOrderSchema);
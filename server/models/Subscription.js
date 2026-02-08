const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  packageName: {
    type: String,
    required: true
  },
  plantsCount: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  potSize: {
    type: String,
    required: true
  },
  maintenanceSchedule: {
    frequency: {
      type: String,
      enum: ['weekly', 'bi-weekly', 'monthly'],
      required: true
    },
    services: [{
      type: String,
      enum: ['watering', 'pruning', 'health-check', 'pest-control', 'fertilizing', 'plant-rotation']
    }]
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  nextBillingDate: {
    type: Date,
    required: true
  },
  nextMaintenanceDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'cancelled', 'expired'],
    default: 'active'
  },
  deliveryAddress: {
    address: String,
    city: String,
    pincode: String,
    phone: String
  }
}, {
  timestamps: true
});

// Calculate next maintenance date based on frequency
subscriptionSchema.methods.calculateNextMaintenance = function() {
  const now = new Date();
  switch(this.maintenanceSchedule.frequency) {
    case 'weekly':
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    case 'bi-weekly':
      return new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    case 'monthly':
      return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    default:
      return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  }
};

module.exports = mongoose.model('Subscription', subscriptionSchema);
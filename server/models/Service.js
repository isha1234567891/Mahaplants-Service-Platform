const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  subscriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription',
    required: true
  },
  visitDate: {
    type: Date,
    required: true
  },
  workerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  checklist: [{
    task: {
      type: String,
      required: true
    },
    completed: {
      type: Boolean,
      default: false
    }
  }],
  photos: [{
    type: String
  }],
  notes: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['PENDING', 'ASSIGNED', 'COMPLETED_BY_WORKER', 'CONFIRMED_BY_CUSTOMER', 'REQUIRES_REVISIT'],
    default: 'PENDING'
  }
}, {
  timestamps: true
});

// Auto-schedule next maintenance visit when current one is confirmed
serviceSchema.post('save', async function() {
  if (this.status === 'CONFIRMED_BY_CUSTOMER') {
    const Subscription = require('./Subscription');
    const subscription = await Subscription.findById(this.subscriptionId);
    
    if (subscription && subscription.status === 'active') {
      subscription.nextMaintenanceDate = subscription.calculateNextMaintenance();
      await subscription.save();
    }
  }
});

module.exports = mongoose.model('Service', serviceSchema);
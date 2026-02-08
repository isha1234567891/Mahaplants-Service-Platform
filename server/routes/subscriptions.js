const express = require('express');
const Subscription = require('../models/Subscription');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/subscriptions
// @desc    Create new subscription
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { packageName, plantsCount, price, potSize, maintenanceSchedule, tasksChecklist } = req.body;
    
    const nextBillingDate = new Date();
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

    const subscription = new Subscription({
      user: req.user._id,
      packageName,
      plantsCount,
      price,
      potSize,
      maintenanceSchedule,
      nextBillingDate,
      nextMaintenanceDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      deliveryAddress: req.body.deliveryAddress
    });

    await subscription.save();
    
    const Service = require('../models/Service');
    
    // Create initial delivery service visit
    await new Service({
      subscriptionId: subscription._id,
      visitDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      workerId: null,
      checklist: [{ task: 'Deliver plants', completed: false }, { task: 'Setup plants', completed: false }],
      photos: [],
      notes: '',
      status: 'PENDING'
    }).save();
    
    // Auto-create 4 weeks of ServiceVisit records
    const serviceVisits = [];
    for (let week = 1; week <= 4; week++) {
      const visitDate = new Date(Date.now() + week * 7 * 24 * 60 * 60 * 1000);
      
      const serviceVisit = new Service({
        subscriptionId: subscription._id,
        visitDate: visitDate,
        workerId: null,
        checklist: tasksChecklist.map(task => ({
          task: task,
          completed: false
        })),
        photos: [],
        notes: '',
        status: 'PENDING'
      });
      
      serviceVisits.push(serviceVisit.save());
    }
    
    await Promise.all(serviceVisits);

    res.status(201).json({ message: 'Subscription created successfully', subscription });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/subscriptions
// @desc    Get user subscriptions
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ subscriptions });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/subscriptions/:id/services
// @desc    Get services for subscription
// @access  Private
router.get('/:id/services', auth, async (req, res) => {
  try {
    const Service = require('../models/Service');
    const services = await Service.find({ subscriptionId: req.params.id })
      .sort({ scheduledDate: 1 });
    res.json({ services });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/subscriptions/admin/all
// @desc    Get all subscriptions (Admin only)
// @access  Private/Admin
router.get('/admin/all', auth, async (req, res) => {
  try {
    const subscriptions = await Subscription.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json({ subscriptions });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
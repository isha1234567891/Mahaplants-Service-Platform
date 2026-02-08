const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const SimpleOrder = require('../models/SimpleOrder');
const { auth } = require('../middleware/auth');

// Get all services (for admin portal)
router.get('/admin', async (req, res) => {
  try {
    const services = await Service.find()
      .populate({
        path: 'subscriptionId',
        populate: { path: 'user', select: 'name email' }
      })
      .sort({ visitDate: 1 });
    
    const formattedServices = services.map(service => ({
      ...service.toObject(),
      customerName: service.subscriptionId?.user?.name || 'Customer',
      customerEmail: service.subscriptionId?.user?.email || ''
    }));
    
    res.json({ services: formattedServices });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get services for specific subscription
router.get('/subscription/:subscriptionId', async (req, res) => {
  try {
    const services = await Service.find({ subscriptionId: req.params.subscriptionId })
      .sort({ scheduledDate: 1 });
    res.json({ services });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new service
router.post('/', async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();
    res.status(201).json({ service });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update service (worker updates)
router.put('/:serviceId', async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { status, completedServices, notes, photos } = req.body;
    
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    
    // Add worker update
    service.workerUpdates.push({
      notes,
      photos,
      workerName: 'Worker Team'
    });
    
    // Update completed services
    if (completedServices) {
      service.completedServices = completedServices;
    }
    
    // Update status
    if (status) {
      service.status = status;
    }
    
    await service.save();
    res.json({ service });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Customer confirm service
router.put('/:serviceId/confirm', async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.serviceId,
      {
        status: 'CONFIRMED_BY_CUSTOMER',
        confirmationDate: new Date()
      },
      { new: true }
    );
    
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    
    res.json({ service });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Customer report issue
router.put('/:serviceId/report-issue', async (req, res) => {
  try {
    const { comment } = req.body;
    
    const service = await Service.findByIdAndUpdate(
      req.params.serviceId,
      {
        status: 'REQUIRES_REVISIT',
        notes: comment ? `${service.notes || ''}
Issue reported: ${comment}` : service.notes
      },
      { new: true }
    );
    
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    
    res.json({ service });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Assign worker to service (admin only)
router.put('/:serviceId/assign', async (req, res) => {
  try {
    const { workerId } = req.body;
    
    const service = await Service.findByIdAndUpdate(
      req.params.serviceId,
      {
        workerId: workerId,
        status: 'ASSIGNED'
      },
      { new: true }
    );
    
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    
    res.json({ service });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get services for worker (assigned only)
router.get('/worker', auth, async (req, res) => {
  try {
    console.log('Worker request - User ID:', req.user._id);
    const workerId = req.user._id;
    
    const services = await Service.find({ 
      workerId: workerId,
      status: { $in: ['ASSIGNED', 'COMPLETED_BY_WORKER'] }
    })
    .populate({
      path: 'subscriptionId',
      populate: { path: 'user', select: 'name' }
    })
    .sort({ visitDate: 1 });
    
    console.log('Found services for worker:', services.length);
    
    const formattedServices = services.map(service => ({
      ...service.toObject(),
      customerName: service.subscriptionId?.user?.name || 'Customer',
      address: service.subscriptionId?.deliveryAddress?.address || 'Address not provided'
    }));
    
    res.json({ data: { services: formattedServices } });
  } catch (error) {
    console.error('Worker services error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Submit work (worker only)
router.put('/:serviceId/submit', async (req, res) => {
  try {
    const { checklist, photos, notes } = req.body;
    
    const service = await Service.findByIdAndUpdate(
      req.params.serviceId,
      {
        checklist,
        photos,
        notes,
        status: 'COMPLETED_BY_WORKER'
      },
      { new: true }
    );
    
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    
    res.json({ service });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get services for user (their subscriptions)
router.get('/user', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    
    const services = await Service.find({
      status: { $in: ['COMPLETED_BY_WORKER', 'CONFIRMED_BY_CUSTOMER', 'REQUIRES_REVISIT'] }
    })
    .populate({
      path: 'subscriptionId',
      match: { user: userId },
      populate: { path: 'user', select: 'name email' }
    })
    .populate('workerId', 'name')
    .sort({ visitDate: -1 });
    
    // Filter out services where subscription doesn't match user
    const userServices = services.filter(service => service.subscriptionId);
    
    res.json({ services: userServices });
  } catch (error) {
    console.error('User services error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
const express = require('express');
const Order = require('../models/Order');
const SimpleOrder = require('../models/SimpleOrder');
const Plant = require('../models/Plant');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/orders
// @desc    Create new order
// @access  Public
router.post('/', async (req, res) => {
  try {
    console.log('=== ORDER CREATION START ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    const orderData = {
      items: req.body.items || [],
      totalAmount: req.body.totalAmount || 0,
      shippingAddress: req.body.shippingAddress || {}
    };
    
    console.log('Order data to save:', JSON.stringify(orderData, null, 2));
    
    const order = new SimpleOrder(orderData);
    console.log('Order model created, attempting to save...');
    
    await order.save();
    console.log('Order saved successfully:', order.orderNumber);
    
    res.json({ message: 'Order created successfully', order });
  } catch (error) {
    console.error('=== ORDER CREATION ERROR ===');
    console.error('Error details:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    res.status(400).json({ message: 'Failed to save order', error: error.message });
  }
});

// @route   GET /api/orders
// @desc    Get user orders
// @access  Public (for testing)
router.get('/', async (req, res) => {
  try {
    console.log('GET /api/orders called');
    const orders = await SimpleOrder.find()
      .sort({ createdAt: -1 })
      .limit(20);

    console.log('Found orders:', orders.length);
    res.json({
      orders,
      total: orders.length
    });
  } catch (error) {
    console.error('GET orders error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.plant', 'name images')
      .populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns the order or is admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status (Admin only)
// @access  Private/Admin
router.put('/:id/status', [auth, adminAuth], async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('items.plant', 'name');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(400).json({ message: 'Update failed', error: error.message });
  }
});

// @route   GET /api/orders/admin/all
// @desc    Get all orders (Admin only)
// @access  Private/Admin
router.get('/admin/all', [auth, adminAuth], async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    
    const filter = {};
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .populate('items.plant', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(filter);

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
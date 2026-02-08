const express = require('express');
const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/contact
// @desc    Submit contact form
// @access  Public
router.post('/', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, message } = req.body;

    // Demo mode - skip database operations
    if (process.env.MONGODB_URI === 'disabled') {
      return res.status(201).json({ 
        message: 'Thank you for your message! We will get back to you within 24 hours. (Demo Mode)',
        contactId: 'demo-' + Date.now()
      });
    }

    const contact = new Contact({
      name,
      email,
      message
    });

    await contact.save();

    res.status(201).json({ 
      message: 'Thank you for your message! We will get back to you within 24 hours.',
      contactId: contact._id
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit message', error: error.message });
  }
});

// @route   GET /api/contact
// @desc    Get all contact messages (Admin only)
// @access  Private/Admin
router.get('/', [auth, adminAuth], async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    
    const filter = {};
    if (status) filter.status = status;

    const contacts = await Contact.find(filter)
      .populate('reply.repliedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Contact.countDocuments(filter);

    res.json({
      contacts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/contact/:id/reply
// @desc    Reply to contact message (Admin only)
// @access  Private/Admin
router.put('/:id/reply', [auth, adminAuth], async (req, res) => {
  try {
    const { message } = req.body;

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        status: 'replied',
        reply: {
          message,
          repliedAt: new Date(),
          repliedBy: req.user._id
        }
      },
      { new: true }
    ).populate('reply.repliedBy', 'name');

    if (!contact) {
      return res.status(404).json({ message: 'Contact message not found' });
    }

    res.json({ message: 'Reply sent successfully', contact });
  } catch (error) {
    res.status(400).json({ message: 'Reply failed', error: error.message });
  }
});

// @route   PUT /api/contact/:id/status
// @desc    Update contact status (Admin only)
// @access  Private/Admin
router.put('/:id/status', [auth, adminAuth], async (req, res) => {
  try {
    const { status } = req.body;

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ message: 'Contact message not found' });
    }

    res.json({ message: 'Status updated successfully', contact });
  } catch (error) {
    res.status(400).json({ message: 'Update failed', error: error.message });
  }
});

module.exports = router;
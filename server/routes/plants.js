const express = require('express');
const Plant = require('../models/Plant');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/plants
// @desc    Get all plants with filtering and pagination
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      category, 
      size, 
      minPrice, 
      maxPrice, 
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = { isActive: true };
    
    if (category) filter.category = category;
    if (size) filter.size = size;
    if (search) {
      filter.$text = { $search: search };
    }
    if (minPrice || maxPrice) {
      filter['price.daily'] = {};
      if (minPrice) filter['price.daily'].$gte = Number(minPrice);
      if (maxPrice) filter['price.daily'].$lte = Number(maxPrice);
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const plants = await Plant.find(filter)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Plant.countDocuments(filter);

    res.json({
      plants,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/plants/:id
// @desc    Get single plant
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id);
    
    if (!plant || !plant.isActive) {
      return res.status(404).json({ message: 'Plant not found' });
    }

    res.json(plant);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/plants
// @desc    Create new plant (Admin only)
// @access  Private/Admin
router.post('/', [auth, adminAuth], async (req, res) => {
  try {
    const plant = new Plant(req.body);
    await plant.save();
    res.status(201).json({ message: 'Plant created successfully', plant });
  } catch (error) {
    res.status(400).json({ message: 'Validation error', error: error.message });
  }
});

// @route   PUT /api/plants/:id
// @desc    Update plant (Admin only)
// @access  Private/Admin
router.put('/:id', [auth, adminAuth], async (req, res) => {
  try {
    const plant = await Plant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!plant) {
      return res.status(404).json({ message: 'Plant not found' });
    }

    res.json({ message: 'Plant updated successfully', plant });
  } catch (error) {
    res.status(400).json({ message: 'Update error', error: error.message });
  }
});

// @route   DELETE /api/plants/:id
// @desc    Delete plant (Admin only)
// @access  Private/Admin
router.delete('/:id', [auth, adminAuth], async (req, res) => {
  try {
    const plant = await Plant.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!plant) {
      return res.status(404).json({ message: 'Plant not found' });
    }

    res.json({ message: 'Plant deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
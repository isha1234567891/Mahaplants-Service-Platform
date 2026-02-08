const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Plant name is required'],
    trim: true
  },
  scientificName: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Indoor', 'Outdoor', 'Flowering', 'Foliage', 'Succulent', 'Herb']
  },
  size: {
    type: String,
    enum: ['Small', 'Medium', 'Large', 'Extra Large'],
    required: true
  },
  price: {
    daily: { type: Number, required: true },
    weekly: { type: Number, required: true },
    monthly: { type: Number, required: true }
  },
  images: [{
    url: String,
    alt: String
  }],
  care: {
    light: { type: String, enum: ['Low', 'Medium', 'High'] },
    water: { type: String, enum: ['Low', 'Medium', 'High'] },
    humidity: { type: String, enum: ['Low', 'Medium', 'High'] },
    temperature: String,
    fertilizer: String
  },
  benefits: [String],
  availability: {
    inStock: { type: Boolean, default: true },
    quantity: { type: Number, default: 0 }
  },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for search functionality
plantSchema.index({ name: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Plant', plantSchema);
require('dotenv').config();
const mongoose = require('mongoose');
const Plant = require('./models/Plant');

const plantsData = [
  {
    name: 'Money Plant Golden',
    scientificName: 'Epipremnum aureum',
    category: 'Indoor',
    size: 'Small',
    price: {
      daily: 10,
      weekly: 50,
      monthly: 150
    },
    description: 'Beautiful golden money plant perfect for indoor decoration',
    care: {
      light: 'Medium',
      water: 'Medium',
      humidity: 'Medium'
    },
    benefits: ['Air purification', 'Low maintenance', 'Good luck charm'],
    images: [{
      url: 'https://example.com/money-plant.jpg',
      alt: 'Money Plant Golden'
    }],
    availability: {
      inStock: true,
      quantity: 100
    }
  },
  {
    name: 'Syngonium Pink',
    scientificName: 'Syngonium podophyllum',
    category: 'Indoor',
    size: 'Small',
    price: {
      daily: 12,
      weekly: 60,
      monthly: 180
    },
    description: 'Attractive pink syngonium with heart-shaped leaves',
    care: {
      light: 'Medium',
      water: 'Medium',
      humidity: 'High'
    },
    benefits: ['Air purification', 'Decorative', 'Easy care'],
    images: [{
      url: 'https://example.com/syngonium.jpg',
      alt: 'Syngonium Pink'
    }],
    availability: {
      inStock: true,
      quantity: 75
    }
  },
  {
    name: 'Peace Lily',
    scientificName: 'Spathiphyllum wallisii',
    category: 'Flowering',
    size: 'Medium',
    price: {
      daily: 15,
      weekly: 70,
      monthly: 200
    },
    description: 'Elegant peace lily with white flowers',
    care: {
      light: 'Low',
      water: 'High',
      humidity: 'High'
    },
    benefits: ['Air purification', 'Beautiful flowers', 'Low light tolerant'],
    images: [{
      url: 'https://example.com/peace-lily.jpg',
      alt: 'Peace Lily'
    }],
    availability: {
      inStock: true,
      quantity: 50
    }
  },
  {
    name: 'Areca Palm',
    scientificName: 'Dypsis lutescens',
    category: 'Indoor',
    size: 'Large',
    price: {
      daily: 25,
      weekly: 130,
      monthly: 400
    },
    description: 'Large areca palm for statement decoration',
    care: {
      light: 'High',
      water: 'Medium',
      humidity: 'High'
    },
    benefits: ['Air purification', 'Humidity control', 'Statement plant'],
    images: [{
      url: 'https://example.com/areca-palm.jpg',
      alt: 'Areca Palm'
    }],
    availability: {
      inStock: true,
      quantity: 30
    }
  }
];

async function seedPlants() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing plants
    await Plant.deleteMany({});
    console.log('Cleared existing plants');

    // Insert new plants
    await Plant.insertMany(plantsData);
    console.log('✅ Plants seeded successfully');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding plants:', error);
    process.exit(1);
  }
}

seedPlants();
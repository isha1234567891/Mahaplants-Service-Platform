const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Plant = require('../models/Plant');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
};

const seedUsers = async () => {
  try {
    await User.deleteMany({});
    
    const users = [
      {
        name: 'Admin User',
        email: 'admin@mahaplants.com',
        password: await bcrypt.hash('admin123', 12),
        role: 'admin',
        phone: '09850928571'
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: await bcrypt.hash('user123', 12),
        role: 'user',
        phone: '9876543210'
      }
    ];

    await User.insertMany(users);
    console.log('✅ Users seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding users:', error);
  }
};

const seedPlants = async () => {
  try {
    await Plant.deleteMany({});
    
    const plants = [
      {
        name: 'Monstera Deliciosa',
        scientificName: 'Monstera deliciosa',
        description: 'A stunning tropical plant with large, glossy leaves featuring natural splits and holes. Perfect for adding a dramatic touch to any indoor space.',
        category: 'Indoor',
        size: 'Large',
        price: { daily: 25, weekly: 150, monthly: 500 },
        images: [{ url: '/images/monstera.jpg', alt: 'Monstera Deliciosa' }],
        care: {
          light: 'Medium',
          water: 'Medium',
          humidity: 'High',
          temperature: '18-27°C',
          fertilizer: 'Monthly during growing season'
        },
        benefits: ['Air purification', 'Aesthetic appeal', 'Low maintenance'],
        availability: { inStock: true, quantity: 15 },
        rating: { average: 4.8, count: 24 }
      },
      {
        name: 'Snake Plant',
        scientificName: 'Sansevieria trifasciata',
        description: 'An extremely hardy plant with upright, sword-like leaves. Known for its air-purifying qualities and ability to thrive in low light conditions.',
        category: 'Indoor',
        size: 'Medium',
        price: { daily: 15, weekly: 90, monthly: 300 },
        images: [{ url: '/images/snake-plant.jpg', alt: 'Snake Plant' }],
        care: {
          light: 'Low',
          water: 'Low',
          humidity: 'Low',
          temperature: '15-30°C',
          fertilizer: 'Rarely needed'
        },
        benefits: ['Air purification', 'Low maintenance', 'Drought tolerant'],
        availability: { inStock: true, quantity: 25 },
        rating: { average: 4.9, count: 18 }
      },
      {
        name: 'Peace Lily',
        scientificName: 'Spathiphyllum wallisii',
        description: 'Elegant flowering plant with dark green leaves and beautiful white blooms. Excellent for improving indoor air quality.',
        category: 'Flowering',
        size: 'Medium',
        price: { daily: 20, weekly: 120, monthly: 400 },
        images: [{ url: '/images/peace-lily.jpg', alt: 'Peace Lily' }],
        care: {
          light: 'Medium',
          water: 'Medium',
          humidity: 'High',
          temperature: '18-25°C',
          fertilizer: 'Monthly'
        },
        benefits: ['Air purification', 'Beautiful flowers', 'Humidity indicator'],
        availability: { inStock: true, quantity: 12 },
        rating: { average: 4.7, count: 15 }
      },
      {
        name: 'Rubber Plant',
        scientificName: 'Ficus elastica',
        description: 'A classic houseplant with large, glossy, dark green leaves. Fast-growing and perfect for creating a bold statement in any room.',
        category: 'Indoor',
        size: 'Large',
        price: { daily: 22, weekly: 130, monthly: 450 },
        images: [{ url: '/images/rubber-plant.jpg', alt: 'Rubber Plant' }],
        care: {
          light: 'Medium',
          water: 'Medium',
          humidity: 'Medium',
          temperature: '16-24°C',
          fertilizer: 'Monthly during spring/summer'
        },
        benefits: ['Air purification', 'Fast growth', 'Easy care'],
        availability: { inStock: true, quantity: 18 },
        rating: { average: 4.6, count: 22 }
      },
      {
        name: 'ZZ Plant',
        scientificName: 'Zamioculcas zamiifolia',
        description: 'An incredibly resilient plant with glossy, dark green leaves. Perfect for beginners and low-light environments.',
        category: 'Indoor',
        size: 'Medium',
        price: { daily: 18, weekly: 100, monthly: 350 },
        images: [{ url: '/images/zz-plant.jpg', alt: 'ZZ Plant' }],
        care: {
          light: 'Low',
          water: 'Low',
          humidity: 'Low',
          temperature: '15-24°C',
          fertilizer: 'Rarely needed'
        },
        benefits: ['Extremely low maintenance', 'Drought tolerant', 'Air purification'],
        availability: { inStock: true, quantity: 20 },
        rating: { average: 4.8, count: 16 }
      }
    ];

    await Plant.insertMany(plants);
    console.log('✅ Plants seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding plants:', error);
  }
};

const seedDatabase = async () => {
  await connectDB();
  await seedUsers();
  await seedPlants();
  console.log('🌱 Database seeded successfully!');
  process.exit(0);
};

seedDatabase();
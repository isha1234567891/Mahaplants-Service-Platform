require('dotenv').config();
const mongoose = require('mongoose');
const Plant = require('./models/Plant');

async function getPlantId() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const plant = await Plant.findOne();
    console.log('First plant ID:', plant._id.toString());
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

getPlantId();
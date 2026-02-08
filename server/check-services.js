const mongoose = require('mongoose');
const Service = require('./models/Service');
const User = require('./models/User');
const Subscription = require('./models/Subscription');
require('dotenv').config();

const checkServices = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all services
    const services = await Service.find()
      .populate('workerId', 'name email role')
      .populate({
        path: 'subscriptionId',
        populate: { path: 'user', select: 'name email' }
      });

    console.log('\n=== ALL SERVICES ===');
    services.forEach((service, index) => {
      console.log(`${index + 1}. Service ID: ${service._id}`);
      console.log(`   Customer: ${service.subscriptionId?.user?.name || 'Unknown'}`);
      console.log(`   Visit Date: ${service.visitDate}`);
      console.log(`   Worker: ${service.workerId?.name || 'Unassigned'} (${service.workerId?.email || 'No email'})`);
      console.log(`   Status: ${service.status}`);
      console.log('---');
    });

    // Get all workers
    const workers = await User.find({ role: 'worker' });
    console.log('\n=== ALL WORKERS ===');
    workers.forEach((worker, index) => {
      console.log(`${index + 1}. Name: ${worker.name}`);
      console.log(`   Email: ${worker.email}`);
      console.log(`   ID: ${worker._id}`);
      console.log('---');
    });

    // Check assigned services
    const assignedServices = await Service.find({ status: 'ASSIGNED' });
    console.log(`\n=== ASSIGNED SERVICES: ${assignedServices.length} ===`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
};

checkServices();
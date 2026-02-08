import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLeaf, FaArrowLeft, FaCalendar, FaRupeeSign, FaCheck, FaClock, FaPhone, FaEnvelope } from 'react-icons/fa';
import { subscriptionsAPI } from '../../utils/api';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSubscription();
  }, [id]);

  const fetchSubscription = async () => {
    try {
      const response = await subscriptionsAPI.getUserSubscriptions();
      const sub = response.subscriptions.find(s => s._id === id);
      if (sub) {
        setSubscription(sub);
      } else {
        setError('Subscription not found');
      }
    } catch (error) {
      setError('Failed to fetch subscription details');
    } finally {
      setLoading(false);
    }
  };

  const handleServiceComplete = async (serviceIndex) => {
    try {
      await subscriptionsAPI.updateService(id, {
        serviceIndex,
        status: 'completed',
        completedDate: new Date().toISOString()
      });
      fetchSubscription();
    } catch (error) {
      console.error('Failed to update service:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !subscription) {
    return (
      <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Order Not Found</h2>
          <button
            onClick={() => navigate('/user/orders')}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/user/orders')}
            className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 mb-4"
          >
            <FaArrowLeft />
            <span>Back to Orders</span>
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {subscription.packageName}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Subscription ID: {subscription._id}
              </p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
              subscription.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
              'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
            }`}>
              {subscription.status.toUpperCase()}
            </span>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Package Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Package Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Plants Count:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">{subscription.plantsCount}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Pot Size:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">{subscription.potSize}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Monthly Price:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">₹{subscription.price}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Start Date:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">
                    {new Date(subscription.startDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Service Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Service Timeline</h2>
              <div className="space-y-4">
                {subscription.services?.map((service, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className={`w-4 h-4 rounded-full flex-shrink-0 ${
                      service.status === 'completed' ? 'bg-green-500' :
                      service.status === 'scheduled' ? 'bg-blue-500' : 'bg-gray-400'
                    }`} />
                    
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">{service.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <FaCalendar />
                          <span>
                            {service.status === 'completed' && service.completedDate
                              ? `Completed: ${new Date(service.completedDate).toLocaleDateString()}`
                              : `Scheduled: ${new Date(service.scheduledDate).toLocaleDateString()}`
                            }
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        service.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        service.status === 'scheduled' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                      }`}>
                        {service.status}
                      </span>
                      
                      {service.status !== 'completed' && (
                        <button
                          onClick={() => handleServiceComplete(index)}
                          className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition-colors"
                          title="Mark as completed"
                        >
                          <FaCheck className="text-sm" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Billing Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Billing Information</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Next Billing:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {new Date(subscription.nextBillingDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Amount:</span>
                  <span className="font-medium text-gray-900 dark:text-white">₹{subscription.price}</span>
                </div>
              </div>
            </motion.div>

            {/* Contact Support */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold text-primary-900 dark:text-primary-100 mb-4">Need Help?</h3>
              <div className="space-y-3">
                <a
                  href="tel:09850928571"
                  className="flex items-center space-x-3 text-primary-700 dark:text-primary-300 hover:text-primary-800 dark:hover:text-primary-200"
                >
                  <FaPhone />
                  <span>09850928571</span>
                </a>
                <a
                  href="mailto:dilipmhnpl@gmail.com"
                  className="flex items-center space-x-3 text-primary-700 dark:text-primary-300 hover:text-primary-800 dark:hover:text-primary-200"
                >
                  <FaEnvelope />
                  <span>dilipmhnpl@gmail.com</span>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
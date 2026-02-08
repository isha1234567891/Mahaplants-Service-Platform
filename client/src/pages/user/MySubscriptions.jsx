import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { subscriptionsAPI, servicesAPI } from '../../utils/api';
import { FaCalendar, FaCheck, FaClock, FaExclamationTriangle } from 'react-icons/fa';

const MySubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const response = await subscriptionsAPI.getUserSubscriptions();
      setSubscriptions(response.subscriptions || []);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Subscriptions
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your plant rental subscriptions and service schedules
          </p>
        </motion.div>

        {subscriptions.length === 0 ? (
          <div className="text-center py-12">
            <FaExclamationTriangle className="text-6xl text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No subscriptions found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">You haven't subscribed to any packages yet.</p>
            <a
              href="/packages"
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Browse Packages
            </a>
          </div>
        ) : (
          <div className="grid gap-6">
            {subscriptions.map((subscription, index) => (
              <motion.div
                key={subscription._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {subscription.packageName}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {subscription.plantsCount} plants • {subscription.potSize}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(subscription.status)}`}>
                        {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                      </span>
                      <div className="text-2xl font-bold text-primary-600 mt-2">
                        ₹{subscription.price.toLocaleString()}/month
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <FaCalendar />
                      <span>Started: {new Date(subscription.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <FaClock />
                      <span>Next billing: {new Date(subscription.nextBillingDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {subscription.maintenanceSchedule && (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Maintenance Schedule</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>Frequency: {subscription.maintenanceSchedule.frequency}</span>
                        <span>•</span>
                        <span>Services: {subscription.maintenanceSchedule.services?.join(', ')}</span>
                      </div>
                      {subscription.nextMaintenanceDate && (
                        <div className="mt-2 text-sm text-primary-600 dark:text-primary-400">
                          Next maintenance: {new Date(subscription.nextMaintenanceDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => window.location.href = `/user/services/${subscription._id}`}
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      View Service History
                    </button>
                    <div className="space-x-2">
                      {subscription.status === 'active' && (
                        <button className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                          Pause
                        </button>
                      )}
                      <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MySubscriptions;
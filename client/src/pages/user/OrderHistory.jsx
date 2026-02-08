import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaLeaf, FaCalendar, FaRupeeSign, FaEye, FaCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { ordersAPI, subscriptionsAPI } from '../../utils/api';
import { saveOrder } from '../../utils/sharedData';

const OrderHistory = () => {
  const { selectedPackage, cartItems } = useCart();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // Create mock order from cart if items exist
      if (cartItems && cartItems.length > 0) {
        const mockOrder = {
          id: Date.now().toString(),
          orderNumber: `ORD${Date.now().toString().slice(-6)}`,
          customerName: 'John Doe',
          items: cartItems,
          totalAmount: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          status: 'confirmed',
          createdAt: new Date().toISOString(),
          shippingAddress: {
            address: '123 Green Street, Mumbai'
          }
        };
        saveOrder(mockOrder);
      }
      
      const [ordersResponse, subscriptionsResponse] = await Promise.all([
        ordersAPI.getUserOrders(),
        subscriptionsAPI.getUserSubscriptions()
      ]);
      setOrders(ordersResponse.orders || []);
      setSubscriptions(subscriptionsResponse.subscriptions || []);
    } catch (error) {
      setError('Failed to fetch data');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceComplete = async (subscriptionId, serviceIndex) => {
    try {
      await subscriptionsAPI.updateService(subscriptionId, {
        serviceIndex,
        status: 'completed',
        completedDate: new Date().toISOString()
      });
      fetchOrders(); // Refresh data
    } catch (error) {
      console.error('Failed to update service:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'active': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'confirmed': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'pending': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Orders</h1>
          <p className="text-gray-600 dark:text-gray-400">Track your plant rental orders and subscriptions</p>
        </motion.div>

        {/* Selected Package Alert */}
        {selectedPackage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center space-x-3">
              <FaLeaf className="text-green-600" />
              <div>
                <h3 className="font-semibold text-green-800 dark:text-green-200">
                  Package Selected: {selectedPackage.name}
                </h3>
                <p className="text-sm text-green-600 dark:text-green-300">
                  {selectedPackage.plantsCount} plants • ₹{selectedPackage.price}/month • {selectedPackage.potSize}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Active Subscriptions */}
          {subscriptions.map((subscription, index) => (
            <motion.div
              key={subscription._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <FaLeaf className="text-green-600 text-xl" />
                  <div>
                    <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
                      {subscription.packageName} - Active Subscription
                    </h3>
                    <p className="text-sm text-green-600 dark:text-green-300">
                      {subscription.plantsCount} plants • ₹{subscription.price}/month • {subscription.potSize}
                    </p>
                  </div>
                </div>
                <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium">
                  {subscription.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Start Date:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">
                    {new Date(subscription.startDate).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Next Billing:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">
                    {new Date(subscription.nextBillingDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              {/* Service Tracking */}
              <div className="border-t border-green-200 dark:border-green-700 pt-4">
                <h4 className="font-medium text-green-800 dark:text-green-200 mb-3">Service Schedule</h4>
                <div className="space-y-2">
                  {subscription.services?.map((service, serviceIndex) => (
                    <div key={serviceIndex} className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          service.status === 'completed' ? 'bg-green-500' :
                          service.status === 'scheduled' ? 'bg-blue-500' : 'bg-gray-400'
                        }`} />
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">{service.name}</span>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {service.status === 'completed' && service.completedDate
                              ? `Completed: ${new Date(service.completedDate).toLocaleDateString()}`
                              : `Scheduled: ${new Date(service.scheduledDate).toLocaleDateString()}`
                            }
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          service.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          service.status === 'scheduled' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                        }`}>
                          {service.status}
                        </span>
                        {service.status !== 'completed' && (
                          <button
                            onClick={() => handleServiceComplete(subscription._id, serviceIndex)}
                            className="bg-green-500 hover:bg-green-600 text-white p-1 rounded-full transition-colors"
                            title="Mark as completed"
                          >
                            <FaCheck className="text-xs" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
          
          {/* Orders */}
          {orders.map((order, index) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                  <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                    <div className="bg-primary-100 dark:bg-primary-900/20 p-3 rounded-full">
                      <FaLeaf className="text-primary-600 text-xl" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {order.packageName || order.items?.[0]?.name || `Order #${order.orderNumber}`}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <FaCalendar />
                          <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FaRupeeSign />
                          <span>₹{order.totalAmount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <button 
                      onClick={() => navigate(`/user/orders/${order._id}`)}
                      className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <FaEye />
                      <span>Track Services</span>
                    </button>
                  </div>
                </div>

                <div className="border-t dark:border-gray-700 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Items:</span>
                      <span className="ml-2 font-medium text-gray-900 dark:text-white">
                        {order.items?.length || 0} plants
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Start Date:</span>
                      <span className="ml-2 font-medium text-gray-900 dark:text-white">
                        {new Date(order.rentalPeriod?.startDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">End Date:</span>
                      <span className="ml-2 font-medium text-gray-900 dark:text-white">
                        {new Date(order.rentalPeriod?.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Payment:</span>
                      <span className={`ml-2 font-medium ${
                        order.paymentStatus === 'paid' ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        {order.paymentStatus?.charAt(0).toUpperCase() + order.paymentStatus?.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {orders.length === 0 && subscriptions.length === 0 && !selectedPackage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <FaLeaf className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Orders Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start your plant rental journey by choosing a package
              </p>
              <a
                href="/packages"
                className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                <FaLeaf />
                <span>Browse Packages</span>
              </a>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
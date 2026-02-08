import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaCheck, FaClock, FaUser, FaCalendar, FaClipboardList } from 'react-icons/fa';
import { ordersAPI, servicesAPI } from '../../utils/api';
import ServiceScheduler from '../../Components/ServiceScheduler';
import { getOrderById, addServiceToOrder, confirmServiceByCustomer, saveOrder } from '../../utils/sharedData';

const OrderServices = () => {
  const { orderId } = useParams();
  const subscriptionId = useParams().subscriptionId;
  const isSubscriptionView = !!subscriptionId;
  const serviceId = orderId || subscriptionId;
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scheduledServices, setScheduledServices] = useState([]);

  useEffect(() => {
    fetchOrderServices();
  }, [serviceId]);

  const fetchOrderServices = async () => {
    try {
      let response;
      if (isSubscriptionView) {
        // Fetch services for subscription
        response = await servicesAPI.getServicesBySubscription(subscriptionId);
        setServices(response.services || []);
        setOrder({ id: subscriptionId, type: 'subscription' });
      } else {
        // Original order logic (fallback)
        console.log('Fetching services for order:', orderId);
        
        const response = await fetch(`http://localhost:5001/api/services`);
        if (response.ok) {
          const data = await response.json();
          const orderServices = data.services?.filter(service => {
            const serviceOrderId = service.orderId?._id || service.orderId?.id || service.orderId;
            return serviceOrderId === orderId;
          }) || [];
          
          setOrder({ id: orderId, orderNumber: `ORD${orderId.slice(-6)}` });
          setServices(orderServices);
        }
      }
    } catch (error) {
      console.log('API failed, using localStorage fallback:', error);
      
      if (!isSubscriptionView) {
        const orderData = getOrderById(orderId);
        if (orderData) {
          setOrder(orderData);
          setServices(orderData.services || []);
        } else {
          setOrder({ id: orderId, orderNumber: `ORD${orderId.slice(-6)}` });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const confirmService = async (serviceId) => {
    try {
      await servicesAPI.confirmService(serviceId);
      alert('Service confirmed successfully!');
      fetchOrderServices();
    } catch (error) {
      console.error('Failed to confirm service:', error);
      alert('Failed to confirm service. Please try again.');
    }
  };

  const reportIssue = async (serviceId) => {
    const comment = prompt('Please describe the issue (optional):');
    try {
      await servicesAPI.reportIssue(serviceId, comment);
      alert('Issue reported. Our team will contact you soon.');
      fetchOrderServices();
    } catch (error) {
      console.error('Failed to report issue:', error);
      alert('Failed to report issue. Please try again.');
    }
  };

  const handleScheduleService = async (scheduleData) => {
    const serviceData = {
      orderId: orderId,
      type: scheduleData.serviceType.toLowerCase(),
      title: scheduleData.serviceType + ' Maintenance',
      description: 'Scheduled maintenance service',
      scheduledDate: new Date(scheduleData.scheduledDate + 'T' + convertTo24Hour(scheduleData.scheduledTime)),
      scheduledTime: scheduleData.scheduledTime,
      workerName: 'To be assigned',
      specialInstructions: scheduleData.specialInstructions
    };
    
    console.log('Scheduling service:', serviceData);
    
    try {
      // Try to save to backend API first
      const response = await fetch('http://localhost:5001/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serviceData)
      });
      
      if (response.ok) {
        console.log('Service saved to backend');
        alert('Service scheduled successfully!');
      } else {
        throw new Error('Backend save failed');
      }
    } catch (error) {
      console.log('Backend failed, saving to localStorage:', error);
      // Fallback to localStorage
      const newService = addServiceToOrder(orderId, serviceData);
      if (newService) {
        alert('Service scheduled successfully (offline mode)!');
      } else {
        alert('Failed to schedule service');
      }
    }
    
    // Refresh services from API
    fetchOrderServices();
  };

  const convertTo24Hour = (time12h) => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') hours = '00';
    if (modifier === 'PM') hours = parseInt(hours, 10) + 12;
    return hours + ':' + minutes;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <FaCheck className="text-green-500" />;
      case 'scheduled': return <FaClock className="text-blue-500" />;
      default: return <FaClock className="text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
                        onClick={() => navigate(isSubscriptionView ? '/user/subscriptions' : '/user/orders')}
            className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 mb-4"
          >
            <FaArrowLeft />
                        <span>Back to {isSubscriptionView ? 'Subscriptions' : 'Orders'}</span>
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {isSubscriptionView ? 'Service Records' : 'Service Tracking'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isSubscriptionView 
              ? 'Track your subscription maintenance visits and confirm completed services'
              : `Order #${order?.orderNumber || order?.id || 'N/A'} - Track and confirm your plant care services`
            }
          </p>
        </motion.div>

        {/* Debug: Create Test Order */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
          <button
            onClick={() => {
              const testOrder = {
                id: orderId,
                orderNumber: `ORD${orderId.slice(-6)}`,
                customerName: 'Test User',
                items: [{ name: 'Monstera' }, { name: 'Peace Lily' }],
                shippingAddress: { address: '123 Test Street' }
              };
              const savedOrder = saveOrder(testOrder);
              console.log('Test order created:', JSON.stringify(savedOrder, null, 2));
              fetchOrderServices();
            }}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg mr-4"
          >
            Create Test Order
          </button>
          <button
            onClick={() => {
              const orders = JSON.parse(localStorage.getItem('mahaplants_orders') || '[]');
              console.log('Current orders in localStorage:', JSON.stringify(orders, null, 2));
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Check localStorage
          </button>
        </div>

        {/* Service Scheduler */}
        <ServiceScheduler 
          orderId={orderId} 
          onSchedule={handleScheduleService}
        />

        <div className="space-y-6">
          {/* All Services */}
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {getStatusIcon(service.status)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {service.title || 'Service'}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {service.description || 'No description available'}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(service.status)}`}>
                    {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <FaCalendar />
                    <span>
                      Scheduled: {new Date(service.scheduledDate).toLocaleDateString()} at {service.scheduledTime || new Date(service.scheduledDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <FaUser />
                    <span>Worker: {service.workerName || 'To be assigned'}</span>
                  </div>
                </div>

                {(service.status === 'completed' || service.status === 'in-progress') && (
                  <div className="border-t dark:border-gray-700 pt-4">
                    {service.workerUpdates && service.workerUpdates.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Worker Updates</h4>
                        {service.workerUpdates.map((update, updateIndex) => (
                          <div key={updateIndex} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-2">
                            <div className="flex items-start space-x-2">
                              <FaClipboardList className="text-gray-500 mt-1 flex-shrink-0" />
                              <div>
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="font-medium text-gray-900 dark:text-white text-sm">
                                    {update.workerName}
                                  </span>
                                  <span className="text-gray-500 text-xs">
                                    {new Date(update.timestamp).toLocaleString()}
                                  </span>
                                </div>
                                {update.notes && (
                                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                                    {update.notes}
                                  </p>
                                )}
                                {update.checklist && (
                                  <div className="mt-2">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">Completed Tasks:</p>
                                    <ul className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                      {Object.entries(update.checklist).filter(([_, checked]) => checked).map(([task, _]) => (
                                        <li key={task} className="flex items-center space-x-1">
                                          <FaCheck className="text-green-500 text-xs" />
                                          <span>{task}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {service.status === 'COMPLETED_BY_WORKER' && !service.customerConfirmed && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                        <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-3 text-lg">
                          Did our team complete this service satisfactorily?
                        </h4>
                        <div className="flex space-x-4">
                          <button
                            onClick={() => confirmService(service.id || service._id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2 font-medium"
                          >
                            <FaCheck />
                            <span>Confirm Service</span>
                          </button>
                          <button
                            onClick={() => reportIssue(service.id || service._id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                          >
                            Report an Issue
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {(service.status === 'CONFIRMED_BY_CUSTOMER' || service.customerConfirmed) && (
                      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                          <FaCheck className="text-green-600" />
                          <span className="text-green-800 dark:text-green-200 font-medium">
                            ✔ Confirmed by you on {new Date(service.confirmationDate || service.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderServices;
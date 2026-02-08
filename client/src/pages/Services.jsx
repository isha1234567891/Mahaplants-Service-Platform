import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaTruck, 
  FaTools, 
  FaLeaf,
  FaCheck,
  FaClock,
  FaCalendar,
  FaClipboardList,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Services = () => {
  const { isAuthenticated, user } = useAuth();
  const [serviceRecords, setServiceRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Mock service records - replace with API call
  const mockServiceRecords = [
    {
      id: 1,
      orderNumber: 'MP17608755109703',
      packageName: 'Standard Package',
      plantsCount: 100,
      startDate: '2024-01-15',
      services: [
        {
          id: 1,
          type: 'delivery',
          name: 'Plant Delivery & Setup',
          scheduledDate: '2024-01-20',
          status: 'completed',
          completedDate: '2024-01-20',
          tasks: [
            { id: 1, name: 'Plants loaded for delivery', completed: true, completedBy: 'Driver Team', workerNotes: 'All 100 plants loaded safely' },
            { id: 2, name: 'Delivery to location', completed: true, completedBy: 'Driver Team', workerNotes: 'Delivered to office reception' },
            { id: 3, name: 'Plants setup and positioned', completed: true, completedBy: 'Setup Team', workerNotes: 'Positioned as per layout plan' },
            { id: 4, name: 'Initial watering completed', completed: true, completedBy: 'Setup Team', workerNotes: 'All plants watered properly' },
            { id: 5, name: 'Customer walkthrough done', completed: true, completedBy: 'Setup Team', workerNotes: 'Explained care instructions' }
          ],
          customerConfirmed: true,
          confirmedBy: 'Customer',
          confirmedDate: '2024-01-20T15:30:00Z'
        },
        {
          id: 2,
          type: 'maintenance',
          name: 'Weekly Maintenance - Week 1',
          scheduledDate: '2024-01-27',
          status: 'in-progress',
          tasks: [
            { id: 1, name: 'Plant health inspection', completed: true, completedBy: 'Maintenance Team', workerNotes: 'All plants healthy, no issues found' },
            { id: 2, name: 'Watering all plants', completed: true, completedBy: 'Maintenance Team', workerNotes: 'Watered 100 plants, soil moisture optimal' },
            { id: 3, name: 'Pruning dead leaves', completed: true, completedBy: 'Maintenance Team', workerNotes: 'Removed dead leaves from 15 plants' },
            { id: 4, name: 'Pest control check', completed: true, completedBy: 'Maintenance Team', workerNotes: 'No pests detected, applied preventive spray' },
            { id: 5, name: 'Soil condition check', completed: true, completedBy: 'Maintenance Team', workerNotes: 'Soil condition good, added fertilizer to 5 plants' },
            { id: 6, name: 'Report generation', completed: true, completedBy: 'Maintenance Team', workerNotes: 'Weekly report generated and uploaded' }
          ],
          customerConfirmed: false
        },
        {
          id: 3,
          type: 'maintenance',
          name: 'Weekly Maintenance - Week 2',
          scheduledDate: '2024-02-03',
          status: 'scheduled',
          tasks: [
            { id: 1, name: 'Plant health inspection', completed: false },
            { id: 2, name: 'Watering all plants', completed: false },
            { id: 3, name: 'Pruning dead leaves', completed: false },
            { id: 4, name: 'Pest control check', completed: false },
            { id: 5, name: 'Fertilizer application', completed: false },
            { id: 6, name: 'Report generation', completed: false }
          ]
        }
      ]
    }
  ];

  useEffect(() => {
    if (isAuthenticated) {
      setServiceRecords(mockServiceRecords);
    }
  }, [isAuthenticated]);

  const confirmService = (recordId, serviceId) => {
    setServiceRecords(prev => prev.map(record => {
      if (record.id === recordId) {
        return {
          ...record,
          services: record.services.map(service => {
            if (service.id === serviceId) {
              return {
                ...service,
                customerConfirmed: true,
                confirmedBy: user?.name || 'Customer',
                confirmedDate: new Date().toISOString(),
                status: 'completed'
              };
            }
            return service;
          })
        };
      }
      return record;
    }));
    
    toast.success('Service confirmed successfully!');
  };

  const getServiceIcon = (type) => {
    switch (type) {
      case 'delivery': return FaTruck;
      case 'maintenance': return FaTools;
      default: return FaLeaf;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in-progress': return 'text-blue-600 bg-blue-100';
      case 'scheduled': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTaskProgress = (tasks) => {
    const completed = tasks.filter(task => task.completed).length;
    return Math.round((completed / tasks.length) * 100);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FaLeaf className="text-6xl text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Login Required</h2>
          <p className="text-gray-600 dark:text-gray-400">Please login to track your services</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <section className="bg-white dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Service Records & Confirmation
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              View completed work by our team and confirm service completion
            </p>
          </motion.div>
        </div>
      </section>

      {/* Service Records */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {serviceRecords.map((record) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-8 overflow-hidden"
            >
              {/* Record Header */}
              <div className="bg-primary-50 dark:bg-primary-900/20 p-6 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {record.packageName}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Order: {record.orderNumber} • {record.plantsCount} plants • Started: {new Date(record.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <FaClipboardList className="text-3xl text-primary-600" />
                </div>
              </div>

              {/* Services List */}
              <div className="p-6">
                <div className="space-y-6">
                  {record.services.map((service) => {
                    const ServiceIcon = getServiceIcon(service.type);
                    const progress = getTaskProgress(service.tasks);
                    
                    return (
                      <div key={service.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                        {/* Service Header */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <ServiceIcon className="text-xl text-primary-600" />
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {service.name}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Scheduled: {new Date(service.scheduledDate).toLocaleDateString()}
                                {service.completedDate && ` • Completed: ${new Date(service.completedDate).toLocaleDateString()}`}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(service.status)}`}>
                              {service.status}
                            </span>
                            <div className="text-right">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {progress}% Complete
                              </div>
                              <div className="w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                <div 
                                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Tasks List */}
                        <div className="space-y-3">
                          {service.tasks.map((task) => (
                            <div 
                              key={task.id}
                              className={`p-4 rounded-lg border ${
                                task.completed 
                                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                                  : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-3">
                                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 ${
                                    task.completed
                                      ? 'bg-green-500 border-green-500 text-white'
                                      : 'border-gray-300 dark:border-gray-600'
                                  }`}>
                                    {task.completed && <FaCheck className="text-xs" />}
                                  </div>
                                  <div className="flex-1">
                                    <span className={`font-medium block ${
                                      task.completed 
                                        ? 'text-green-800 dark:text-green-200' 
                                        : 'text-gray-900 dark:text-white'
                                    }`}>
                                      {task.name}
                                    </span>
                                    {task.completedBy && (
                                      <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                                        ✓ Completed by: {task.completedBy}
                                      </p>
                                    )}
                                    {task.workerNotes && (
                                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 bg-white dark:bg-gray-800 p-2 rounded border">
                                        <strong>Worker Notes:</strong> {task.workerNotes}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                
                                {task.completed ? (
                                  <FaCheckCircle className="text-green-500 mt-1" />
                                ) : (
                                  <FaClock className="text-gray-400 mt-1" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Customer Confirmation */}
                        {service.status === 'in-progress' && service.tasks.every(task => task.completed) && !service.customerConfirmed && (
                          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-blue-800 dark:text-blue-200">Service Completed - Awaiting Your Confirmation</h4>
                                <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                                  Our team has completed all tasks. Please confirm the service was satisfactory.
                                </p>
                              </div>
                              <button
                                onClick={() => confirmService(record.id, service.id)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                              >
                                Confirm Service
                              </button>
                            </div>
                          </div>
                        )}
                        
                        {/* Confirmed Service */}
                        {service.customerConfirmed && (
                          <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <FaCheckCircle className="text-green-600" />
                              <div>
                                <span className="font-medium text-green-800 dark:text-green-200">
                                  Service Confirmed by {service.confirmedBy}
                                </span>
                                <p className="text-sm text-green-600 dark:text-green-400">
                                  Confirmed on {new Date(service.confirmedDate).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ))}

          {serviceRecords.length === 0 && (
            <div className="text-center py-12">
              <FaLeaf className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Service Records
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Your service tracking will appear here once you have active orders
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Services;
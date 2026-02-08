import React, { useState, useEffect } from 'react';
import { servicesAPI } from '../../utils/api';

const ServiceConfirmation = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [reportModal, setReportModal] = useState(false);
  const [issueComment, setIssueComment] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await servicesAPI.getUserServices();
      setServices(response.services || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const confirmService = async (serviceId) => {
    try {
      await servicesAPI.confirmService(serviceId);
      fetchServices();
    } catch (error) {
      console.error('Error confirming service:', error);
    }
  };

  const reportIssue = async () => {
    try {
      await servicesAPI.reportIssue(selectedService._id, issueComment);
      setReportModal(false);
      setSelectedService(null);
      setIssueComment('');
      fetchServices();
    } catch (error) {
      console.error('Error reporting issue:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Service Confirmations
        </h1>

        {services.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">No services awaiting confirmation</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {services.map((service) => (
              <div key={service._id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Service Visit - {new Date(service.visitDate).toLocaleDateString()}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Worker: {service.workerId?.name || 'Unknown'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Package: {service.subscriptionId?.packageName || 'Unknown'}
                    </p>
                  </div>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                    service.status === 'CONFIRMED_BY_CUSTOMER' ? 'bg-green-100 text-green-800' :
                    service.status === 'REQUIRES_REVISIT' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {service.status === 'CONFIRMED_BY_CUSTOMER' ? 'Confirmed ✓' :
                     service.status === 'REQUIRES_REVISIT' ? 'Needs Revisit ⚠' :
                     'Awaiting Confirmation'}
                  </span>
                </div>

                {/* Checklist */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Work Completed:</h4>
                  <div className="space-y-1">
                    {service.checklist?.map((item, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${
                          item.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                        }`}>
                          {item.completed ? '✓' : '○'}
                        </span>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{item.task}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Photos */}
                {service.photos && service.photos.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Photos:</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {service.photos.map((photo, index) => (
                        <img
                          key={index}
                          src={photo}
                          alt={`Service photo ${index + 1}`}
                          className="w-full h-24 object-cover rounded"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {service.notes && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Worker Notes:</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded">
                      {service.notes}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                {service.status === 'COMPLETED_BY_WORKER' ? (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => confirmService(service._id)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                    >
                      Confirm Service ✓
                    </button>
                    <button
                      onClick={() => {
                        setSelectedService(service);
                        setReportModal(true);
                      }}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                    >
                      Report Issue ⚠
                    </button>
                  </div>
                ) : service.status === 'CONFIRMED_BY_CUSTOMER' ? (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                    <p className="text-green-800 dark:text-green-200 text-sm font-medium">
                      ✓ Service confirmed on {new Date(service.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                ) : service.status === 'REQUIRES_REVISIT' ? (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                    <p className="text-red-800 dark:text-red-200 text-sm font-medium">
                      ⚠ Issue reported - Worker will revisit
                    </p>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}

        {/* Report Issue Modal */}
        {reportModal && selectedService && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Report Issue
              </h3>
              <textarea
                value={issueComment}
                onChange={(e) => setIssueComment(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Describe the issue with the service..."
              />
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setReportModal(false);
                    setSelectedService(null);
                    setIssueComment('');
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={reportIssue}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Report Issue
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceConfirmation;
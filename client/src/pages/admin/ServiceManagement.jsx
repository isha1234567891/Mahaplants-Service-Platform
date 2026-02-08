import React, { useState, useEffect } from 'react';
import { subscriptionsAPI, servicesAPI, usersAPI } from '../../utils/api';

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [assignWorkerModal, setAssignWorkerModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [servicesRes, workersRes] = await Promise.all([
        servicesAPI.getAllServices(),
        usersAPI.getAllUsers({ role: 'worker' })
      ]);
      setServices(servicesRes.services || []);
      setWorkers(workersRes.users || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const assignWorker = async (serviceId, workerId) => {
    try {
      await servicesAPI.assignWorker(serviceId, workerId);
      setAssignWorkerModal(false);
      setSelectedService(null);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Service Management</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}
      
      {services.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No services found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Visit Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {services.map((service) => (
                <tr key={service._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {service.customerName || 'Unknown'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {new Date(service.visitDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      service.status === 'CONFIRMED_BY_CUSTOMER' ? 'bg-green-100 text-green-800' :
                      service.status === 'COMPLETED_BY_WORKER' ? 'bg-blue-100 text-blue-800' :
                      service.status === 'ASSIGNED' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {service.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {service.status === 'PENDING' && (
                      <button
                        onClick={() => {
                          setSelectedService(service);
                          setAssignWorkerModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400"
                      >
                        Assign Worker
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Assign Worker Modal */}
      {assignWorkerModal && selectedService && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Assign Worker
            </h3>
            <div className="space-y-3">
              {workers.map((worker) => (
                <button
                  key={worker._id}
                  onClick={() => assignWorker(selectedService._id, worker._id)}
                  className="w-full text-left p-3 border rounded hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600"
                >
                  <div className="font-medium text-gray-900 dark:text-white">
                    {worker.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {worker.email}
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => {
                  setAssignWorkerModal(false);
                  setSelectedService(null);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceManagement;
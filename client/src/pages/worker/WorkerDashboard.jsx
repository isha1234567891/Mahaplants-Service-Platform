import React, { useState, useEffect } from 'react';
import { servicesAPI } from '../../utils/api';

const WorkerDashboard = () => {
  const [assignedServices, setAssignedServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [checklist, setChecklist] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchAssignedServices();
  }, []);

  const fetchAssignedServices = async () => {
    try {
      const response = await servicesAPI.getWorkerServices();
      setAssignedServices(response.data.services || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const selectService = (service) => {
    setSelectedService(service);
    setChecklist(service.checklist || []);
    setPhotos(service.photos || []);
    setNotes(service.notes || '');
  };

  const updateChecklist = (index, completed) => {
    const updated = [...checklist];
    updated[index].completed = completed;
    setChecklist(updated);
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const photoUrls = files.map(file => URL.createObjectURL(file));
    setPhotos([...photos, ...photoUrls]);
  };

  const submitWork = async () => {
    if (!selectedService) return;
    
    try {
      await servicesAPI.submitWork(selectedService._id, {
        checklist,
        photos,
        notes
      });
      
      fetchAssignedServices();
      setSelectedService(null);
      setChecklist([]);
      setPhotos([]);
      setNotes('');
    } catch (error) {
      console.error('Error submitting work:', error);
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Worker Dashboard
        </h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Assigned Services List */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Assigned Services
            </h2>
            
            <div className="space-y-4">
              {assignedServices.map((service) => (
                <div
                  key={service._id}
                  onClick={() => selectService(service)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedService?._id === service._id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-gray-900 dark:text-white">
                    {new Date(service.visitDate).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {service.customerName}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-500">
                    {service.address || 'Address not provided'}
                  </div>
                  <div className="mt-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      service.status === 'COMPLETED_BY_WORKER' ? 'bg-green-100 text-green-800' :
                      service.status === 'ASSIGNED' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {service.status === 'COMPLETED_BY_WORKER' ? 'Completed' : 
                       service.status === 'ASSIGNED' ? 'Assigned' : service.status}
                    </span>
                  </div>
                </div>
              ))}
              
              {assignedServices.length === 0 && (
                <div className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No assigned services
                </div>
              )}
            </div>
          </div>

          {/* Service Details */}
          {selectedService && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Service Details
              </h2>

              {/* Checklist */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                  Checklist
                </h3>
                <div className="space-y-2">
                  {checklist.map((item, index) => (
                    <label key={index} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={(e) => updateChecklist(index, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-700 dark:text-gray-300">
                        {item.task}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Photo Upload */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                  Photos
                </h3>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="mb-3 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                
                {photos.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {photos.map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-20 object-cover rounded"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Notes */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                  Notes
                </h3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Add any notes about the service..."
                />
              </div>

              {/* Submit Button */}
              {selectedService?.status === 'ASSIGNED' ? (
                <button
                  onClick={submitWork}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
                >
                  Submit Work
                </button>
              ) : (
                <div className="w-full bg-gray-100 text-gray-600 py-3 px-4 rounded-lg font-semibold text-center">
                  Work Already Submitted
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;
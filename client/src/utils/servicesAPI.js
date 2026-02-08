const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Get all services (for worker portal)
export const getAllServices = async () => {
  const response = await fetch(`${API_BASE_URL}/services`);
  if (!response.ok) throw new Error('Failed to fetch services');
  return response.json();
};

// Get services for specific order
export const getOrderServices = async (orderId) => {
  const response = await fetch(`${API_BASE_URL}/services/order/${orderId}`);
  if (!response.ok) throw new Error('Failed to fetch order services');
  return response.json();
};

// Create new service
export const createService = async (serviceData) => {
  const response = await fetch(`${API_BASE_URL}/services`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(serviceData)
  });
  if (!response.ok) throw new Error('Failed to create service');
  return response.json();
};

// Update service (worker updates)
export const updateService = async (serviceId, updateData) => {
  const response = await fetch(`${API_BASE_URL}/services/${serviceId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData)
  });
  if (!response.ok) throw new Error('Failed to update service');
  return response.json();
};

// Customer confirm service
export const confirmService = async (serviceId) => {
  const response = await fetch(`${API_BASE_URL}/services/${serviceId}/confirm`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  if (!response.ok) throw new Error('Failed to confirm service');
  return response.json();
};
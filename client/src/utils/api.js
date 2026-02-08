const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('token');
    
    const config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...options,
    };

    // Only stringify if body exists and is an object (not already a string)
    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    const response = await fetch(url, config);
    
    // Check if response is ok first
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // If JSON parsing fails, use status text
      }
      throw new Error(errorMessage);
    }

    // Parse successful response
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('API Error:', error.message);
    // Only use offline mode for network errors, not server errors
    if (error.message.includes('fetch') || error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
      return handleOfflineMode(endpoint, options);
    }
    throw error;
  }
};

// Mock responses when server is offline
const handleOfflineMode = (endpoint, options) => {
  console.log('🔄 Using offline mode for:', endpoint);
  
  if (endpoint === '/auth/login' && options.method === 'POST') {
    const mockUser = { id: 'demo-1', name: 'Demo User', email: 'demo@mahaplants.com', role: 'user' };
    return Promise.resolve({ token: 'demo-token-' + Date.now(), user: mockUser, message: 'Login successful (Demo Mode)' });
  }
  
  if (endpoint === '/auth/register' && options.method === 'POST') {
    let body = {};
    try {
      body = typeof options.body === 'string' ? JSON.parse(options.body) : options.body || {};
    } catch (e) {
      console.log('Body parsing error:', e);
      body = {};
    }
    const mockUser = { 
      id: 'demo-' + Date.now(), 
      name: body.name || 'New User', 
      email: body.email || 'new@mahaplants.com', 
      role: 'user' 
    };
    return Promise.resolve({ token: 'demo-token-' + Date.now(), user: mockUser, message: 'Registration successful (Demo Mode)' });
  }
  
  if (endpoint === '/auth/me') {
    const mockUser = { id: 'demo-1', name: 'Demo User', email: 'demo@mahaplants.com', role: 'user' };
    return Promise.resolve({ user: mockUser });
  }
  
  if (endpoint.startsWith('/plants')) {
    return Promise.resolve({ plants: [], totalPages: 0, currentPage: 1, total: 0 });
  }
  
  if (endpoint.startsWith('/orders')) {
    return Promise.resolve({ orders: [] });
  }
  
  if (endpoint.startsWith('/subscriptions')) {
    if (options.method === 'POST') {
      return Promise.resolve({ 
        message: 'Subscription created successfully (Demo Mode)', 
        subscription: { _id: 'demo-sub-' + Date.now(), ...JSON.parse(options.body || '{}') }
      });
    }
    return Promise.resolve({ subscriptions: [] });
  }
  
  if (endpoint === '/contact' && options.method === 'POST') {
    return Promise.resolve({ message: 'Message sent successfully (Demo Mode)', contactId: 'demo-' + Date.now() });
  }
  
  return Promise.reject(new Error('Endpoint not supported in demo mode'));
};

// Auth API
export const authAPI = {
  register: (userData) => apiRequest('/auth/register', {
    method: 'POST',
    body: userData,
  }),
  
  login: (credentials) => apiRequest('/auth/login', {
    method: 'POST',
    body: credentials,
  }),
  
  getProfile: () => apiRequest('/auth/me'),
};

// Plants API
export const plantsAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/plants${queryString ? `?${queryString}` : ''}`);
  },
  
  getById: (id) => apiRequest(`/plants/${id}`),
  
  create: (plantData) => apiRequest('/plants', {
    method: 'POST',
    body: plantData,
  }),
  
  update: (id, plantData) => apiRequest(`/plants/${id}`, {
    method: 'PUT',
    body: plantData,
  }),
  
  delete: (id) => apiRequest(`/plants/${id}`, {
    method: 'DELETE',
  }),
};

// Orders API
export const ordersAPI = {
  create: (orderData) => apiRequest('/orders', {
    method: 'POST',
    body: orderData,
  }),
  
  getUserOrders: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/orders${queryString ? `?${queryString}` : ''}`);
  },
  
  getById: (id) => apiRequest(`/orders/${id}`),
  
  updateStatus: (id, status) => apiRequest(`/orders/${id}/status`, {
    method: 'PUT',
    body: { status },
  }),
  
  getAllOrders: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/orders/admin/all${queryString ? `?${queryString}` : ''}`);
  },
};

// Contact API
export const contactAPI = {
  submit: (contactData) => apiRequest('/contact', {
    method: 'POST',
    body: contactData,
  }),
  
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/contact${queryString ? `?${queryString}` : ''}`);
  },
  
  reply: (id, message) => apiRequest(`/contact/${id}/reply`, {
    method: 'PUT',
    body: { message },
  }),
  
  updateStatus: (id, status) => apiRequest(`/contact/${id}/status`, {
    method: 'PUT',
    body: { status },
  }),
};

// Users API
export const usersAPI = {
  updateProfile: (userData) => apiRequest('/users/profile', {
    method: 'PUT',
    body: userData,
  }),
  
  changePassword: (passwordData) => apiRequest('/users/change-password', {
    method: 'PUT',
    body: passwordData,
  }),
  
  getAllUsers: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/users/admin/all${queryString ? `?${queryString}` : ''}`);
  },
  
  updateUserStatus: (id, isActive) => apiRequest(`/users/admin/${id}/status`, {
    method: 'PUT',
    body: { isActive },
  }),
};

// Subscriptions API
export const subscriptionsAPI = {
  create: (subscriptionData) => apiRequest('/subscriptions', {
    method: 'POST',
    body: subscriptionData,
  }),
  
  getUserSubscriptions: () => apiRequest('/subscriptions'),
  
  getAllSubscriptions: () => apiRequest('/subscriptions/admin/all'),
  
  updateService: (subscriptionId, serviceData) => apiRequest(`/subscriptions/${subscriptionId}/service`, {
    method: 'PUT',
    body: serviceData,
  }),
};

// Services API
export const servicesAPI = {
  getAllServices: () => apiRequest('/services/admin'),
  assignWorker: (serviceId, workerId) => apiRequest(`/services/${serviceId}/assign`, {
    method: 'PUT',
    body: { workerId },
  }),
  getServicesBySubscription: (subscriptionId) => apiRequest(`/services/subscription/${subscriptionId}`),
  getUserServices: () => apiRequest('/services/user'),
  updateService: (serviceId, data) => apiRequest(`/services/${serviceId}`, {
    method: 'PUT',
    body: data,
  }),
  confirmService: (serviceId) => apiRequest(`/services/${serviceId}/confirm`, {
    method: 'PUT',
  }),
  reportIssue: (serviceId, comment) => apiRequest(`/services/${serviceId}/report-issue`, {
    method: 'PUT',
    body: { comment },
  }),
  getWorkerServices: () => apiRequest('/services/worker'),
  submitWork: (serviceId, workData) => apiRequest(`/services/${serviceId}/submit`, {
    method: 'PUT',
    body: workData,
  }),
};
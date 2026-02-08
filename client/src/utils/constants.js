// Update these lines in src/utils/constants.js

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

// Google Maps Configuration
export const MAPS_CONFIG = {
  API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  DEFAULT_CENTER: {
    lat: 18.6298, // Pune latitude
    lng: 73.7997, // Pune longitude
  },
  DEFAULT_ZOOM: 12,
  COMPANY_LOCATION: {
    lat: 18.6708, // Approximate location of Khed, Pune
    lng: 73.9370,
  },
};
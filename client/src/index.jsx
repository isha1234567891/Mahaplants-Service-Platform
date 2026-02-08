import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

// Get the root element
const container = document.getElementById('root');
const root = createRoot(container);

// Render the app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Global error handling
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  // Send error to monitoring service in production
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  // Send error to monitoring service in production
});

// Development helpers
if (import.meta.env.DEV) {
  console.log('🌱 Mahaplants - Development Mode');
  console.log('React DevTools available');
}
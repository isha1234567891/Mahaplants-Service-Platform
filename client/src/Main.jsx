import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Optional global error logging
window.addEventListener('error', (event) => {
  // keep same content as before but valid JS
  // logs the error object
  // remove any accidental non-JS tokens that caused parse failure
  // e.g., stray characters before this line in old file
  // eslint-disable-next-line no-console
  console.error('Global error:', event.error);
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Override global fetch in production to route API requests to your live backend server
if (import.meta.env.PROD) {
  const originalFetch = window.fetch;
  window.fetch = function (url, options) {
    if (typeof url === 'string' && (url.startsWith('/api') || url.startsWith('/uploads'))) {
      // Replace with your live backend server URL (e.g. Glitch or Render URL)
      const productionBackendUrl = 'https://gaba-backend.onrender.com'; 
      url = `${productionBackendUrl}${url}`;
    }
    return originalFetch(url, options);
  };
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

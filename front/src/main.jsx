import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Override global fetch to redirect /api and /uploads to production backend on Render when not in local development
const isDev = import.meta.env.DEV;
const BACKEND_URL = 'https://gaba-backend.onrender.com';

if (!isDev) {
  const originalFetch = window.fetch;
  window.fetch = async (input, init) => {
    let url = input;
    if (typeof input === 'string') {
      if (input.startsWith('/api') || input.startsWith('/uploads')) {
        url = `${BACKEND_URL}${input}`;
      }
    } else if (input instanceof URL) {
      if (input.pathname.startsWith('/api') || input.pathname.startsWith('/uploads')) {
        url = new URL(input.pathname + input.search, BACKEND_URL);
      }
    } else if (input && typeof input === 'object' && input.url) {
      if (input.url.startsWith('/api') || input.url.startsWith('/uploads')) {
        url = `${BACKEND_URL}${input.url}`;
      }
    }
    return originalFetch(url, init);
  };
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

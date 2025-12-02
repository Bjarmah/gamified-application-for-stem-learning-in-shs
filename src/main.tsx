import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerServiceWorker } from './utils/serviceWorker';
const container = document.getElementById("root");
if (!container) {
  throw new Error("Root element not found");
}

const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register service worker for offline support
registerServiceWorker();

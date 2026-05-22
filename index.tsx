import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './utils/loggerStore';
import './index.css';

// Suppress specific VConsole errors that might leak to the console
window.addEventListener('error', (e) => {
    if (e.message && (e.message.includes('VConsole is not defined') || e.message.includes('vconsole'))) {
        e.preventDefault();
        e.stopImmediatePropagation();
    }
});
window.addEventListener('unhandledrejection', (e) => {
    const msg = e.reason instanceof Error ? e.reason.message : String(e.reason);
    if (msg.includes('VConsole is not defined') || msg.includes('vconsole')) {
        e.preventDefault();
        e.stopImmediatePropagation();
    }
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
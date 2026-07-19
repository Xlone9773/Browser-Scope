import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './utils/loggerStore';
import './index.css';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { ToastProvider } from './components/ui/Toast';

// Suppress specific errors that might leak to the console
window.addEventListener('error', (e) => {
    if (e.message && (e.message.includes('VConsole is not defined') || e.message.includes('vconsole') || e.message.includes('WebSocket closed without opened'))) {
        e.preventDefault();
        e.stopImmediatePropagation();
    }
});
window.addEventListener('unhandledrejection', (e) => {
    const msg = e.reason instanceof Error ? e.reason.message : String(e.reason);
    const lowerMsg = msg.toLowerCase();
    if (
        msg.includes('VConsole is not defined') || 
        msg.includes('vconsole') || 
        msg.includes('WebSocket closed without opened') ||
        lowerMsg.includes('transition was skipped')
    ) {
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
    <ErrorBoundary name="RootApp">
      <ToastProvider>
        <App />
      </ToastProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
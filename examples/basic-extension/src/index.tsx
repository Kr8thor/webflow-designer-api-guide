/**
 * Basic Designer Extension - Entry Point
 *
 * This is the main entry point for the Designer Extension.
 * It initializes React and mounts the App component.
 *
 * Phase 1 Enhancements:
 * - Wraps with NotificationProvider for toast notifications
 * - Wraps with ErrorBoundary for error handling
 * - Wraps with ToastContainer for displaying toasts
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { NotificationProvider } from '../../shared/context/NotificationContext'
import { ErrorBoundary } from '../../shared/components/ErrorBoundary'
import { ToastContainer } from '../../shared/components/Toast'
import './styles.css'

const root = ReactDOM.createRoot(document.getElementById('root')!)
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <NotificationProvider>
        <App />
        <ToastContainer />
      </NotificationProvider>
    </ErrorBoundary>
  </React.StrictMode>
)

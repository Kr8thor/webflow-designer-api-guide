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

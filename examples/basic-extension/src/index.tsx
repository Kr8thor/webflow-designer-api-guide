/**
 * Basic Designer Extension - Entry Point
 *
 * This is the main entry point for the Designer Extension.
 * It initializes React and mounts the App component.
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles.css'

const root = ReactDOM.createRoot(document.getElementById('root')!)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

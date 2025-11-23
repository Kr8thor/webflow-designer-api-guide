import React from 'react'
import { Notification, NotificationType } from '../context/NotificationContext'
import { useNotification } from '../context/NotificationContext'

interface ToastProps {
  notification: Notification
  onRemove: (id: string) => void
}

const getToastStyles = (type: NotificationType) => {
  const baseStyles: React.CSSProperties = {
    padding: '12px 16px',
    marginBottom: '8px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSize: '14px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    animation: 'slideIn 0.3s ease-out',
    minWidth: '300px',
  }

  const typeStyles: Record<NotificationType, React.CSSProperties> = {
    success: {
      backgroundColor: '#d4edda',
      color: '#155724',
      border: '1px solid #c3e6cb',
    },
    error: {
      backgroundColor: '#f8d7da',
      color: '#721c24',
      border: '1px solid #f5c6cb',
    },
    warning: {
      backgroundColor: '#fff3cd',
      color: '#856404',
      border: '1px solid #ffeaa7',
    },
    info: {
      backgroundColor: '#d1ecf1',
      color: '#0c5460',
      border: '1px solid #bee5eb',
    },
  }

  return { ...baseStyles, ...typeStyles[type] }
}

const getIcon = (type: NotificationType) => {
  const iconStyles: React.CSSProperties = {
    fontSize: '18px',
    flexShrink: 0,
  }

  const icons: Record<NotificationType, string> = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  }

  return <span style={iconStyles}>{icons[type]}</span>
}

/**
 * Individual toast notification component
 */
export function Toast({ notification, onRemove }: ToastProps) {
  return (
    <div
      key={notification.id}
      style={getToastStyles(notification.type)}
      role="alert"
      aria-live="polite"
    >
      {getIcon(notification.type)}
      <span style={{ flex: 1 }}>{notification.message}</span>
      <button
        onClick={() => onRemove(notification.id)}
        style={{
          background: 'none',
          border: 'none',
          color: 'inherit',
          cursor: 'pointer',
          padding: '0',
          fontSize: '18px',
          opacity: 0.7,
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  )
}

/**
 * Toast container component - displays all notifications
 * Wrap this in your app to show toasts
 * @example
 * <NotificationProvider>
 *   <ToastContainer />
 *   <YourApp />
 * </NotificationProvider>
 */
export function ToastContainer() {
  const context = React.useContext(require('../context/NotificationContext').NotificationContext)

  if (!context) {
    return null
  }

  const { notifications, removeNotification } = context

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
      <div
        style={{
          position: 'fixed',
          bottom: '16px',
          right: '16px',
          zIndex: 9999,
          maxWidth: '400px',
          pointerEvents: 'auto',
        }}
      >
        {notifications.map((notification) => (
          <Toast key={notification.id} notification={notification} onRemove={removeNotification} />
        ))}
      </div>
    </>
  )
}

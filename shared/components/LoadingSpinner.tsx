import React from 'react'

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  message?: string
  fullScreen?: boolean
}

/**
 * Loading spinner component
 * @example
 * <LoadingSpinner size="medium" message="Loading data..." />
 * <LoadingSpinner fullScreen message="Processing..." />
 */
export function LoadingSpinner({
  size = 'medium',
  message,
  fullScreen = false,
}: LoadingSpinnerProps) {
  const sizeMap = {
    small: 24,
    medium: 40,
    large: 60,
  }

  const spinnerSize = sizeMap[size]

  const containerStyles: React.CSSProperties = fullScreen
    ? {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        zIndex: 9998,
      }
    : {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        gap: '12px',
      }

  const spinnerStyles: React.CSSProperties = {
    width: spinnerSize,
    height: spinnerSize,
    border: '3px solid #f0f0f0',
    borderTop: '3px solid #0066cc',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  }

  const messageStyles: React.CSSProperties = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSize: '14px',
    color: '#666',
    textAlign: 'center',
  }

  return (
    <>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <div style={containerStyles}>
        <div style={spinnerStyles} role="status" aria-live="polite" aria-label="Loading" />
        {message && <p style={messageStyles}>{message}</p>}
      </div>
    </>
  )
}

/**
 * Inline loading indicator - smaller version for inline use
 * @example
 * <LoadingIndicator />
 */
export function LoadingIndicator() {
  return (
    <span
      style={{
        display: 'inline-block',
        width: '16px',
        height: '16px',
        border: '2px solid #f0f0f0',
        borderTop: '2px solid #0066cc',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginRight: '8px',
        verticalAlign: 'middle',
      }}
      role="status"
      aria-label="Loading"
    >
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </span>
  )
}

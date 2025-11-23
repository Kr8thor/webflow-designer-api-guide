import React, { createContext, useCallback, useState } from 'react'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
  id: string
  message: string
  type: NotificationType
  duration?: number
}

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (message: string, type: NotificationType, duration?: number) => void
  removeNotification: (id: string) => void
  clearAll: () => void
}

export const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
)

/**
 * Provider component for notifications
 * Wrap your app with this to enable toast notifications
 * @example
 * <NotificationProvider>
 *   <App />
 * </NotificationProvider>
 */
export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = useCallback(
    (message: string, type: NotificationType = 'info', duration = 3000) => {
      const id = Date.now().toString()
      const notification: Notification = { id, message, type, duration }

      setNotifications((prev) => [...prev, notification])

      if (duration && duration > 0) {
        setTimeout(() => {
          removeNotification(id)
        }, duration)
      }
    },
    []
  )

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, removeNotification, clearAll }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

/**
 * Hook to use notifications
 * @example
 * const { showSuccess, showError } = useNotification()
 * showSuccess('Operation completed!')
 * showError('Something went wrong')
 */
export function useNotification() {
  const context = React.useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider')
  }

  return {
    show: (message: string, type: NotificationType = 'info', duration?: number) =>
      context.addNotification(message, type, duration),
    showSuccess: (message: string, duration?: number) =>
      context.addNotification(message, 'success', duration),
    showError: (message: string, duration?: number) =>
      context.addNotification(message, 'error', duration),
    showWarning: (message: string, duration?: number) =>
      context.addNotification(message, 'warning', duration),
    showInfo: (message: string, duration?: number) =>
      context.addNotification(message, 'info', duration),
    clear: () => context.clearAll(),
  }
}

import { createContext, useContext, useState, useCallback } from 'react'

const NotificationContext = createContext(null)

let nextId = 1

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])

  const addNotification = useCallback(({ title, message, type = 'info', duration = 5000 }) => {
    const id = nextId++
    const notification = { id, title, message, type }
    setNotifications((s) => [notification, ...s])

    if (duration > 0) {
      setTimeout(() => {
        setNotifications((s) => s.filter((n) => n.id !== id))
      }, duration)
    }

    return id
  }, [])

  const removeNotification = useCallback((id) => {
    setNotifications((s) => s.filter((n) => n.id !== id))
  }, [])

  // Placeholder socket room methods — implement socket logic here later
  const joinRoom = useCallback((roomId) => {
    // Example: socket.emit('join', roomId)
    // For now, no-op
    return
  }, [])

  const leaveRoom = useCallback((roomId) => {
    // Example: socket.emit('leave', roomId)
    return
  }, [])

  const api = {
    notifications,
    showNotification: addNotification,
    removeNotification,
    joinRoom,
    leaveRoom,
  }

  return (
    <NotificationContext.Provider value={api}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider')
  return ctx
}

export default NotificationContext

import React from 'react'
import { useNotifications } from '../../contexts/NotificationContext'
import './Toasts.css'

function ToastItem({ n, onClose }) {
  return (
    <div className={`toast toast-${n.type || 'info'}`}>
      <div className="toast-body">
        {n.title && <div className="toast-title">{n.title}</div>}
        {n.message && <div className="toast-message">{n.message}</div>}
      </div>
      <button className="toast-close" onClick={() => onClose(n.id)} aria-label="Cerrar">×</button>
    </div>
  )
}

export default function Toasts() {
  const { notifications, removeNotification } = useNotifications()

  return (
    <div className="toasts-root" aria-live="polite" aria-atomic="true">
      {notifications.map((n) => (
        <ToastItem key={n.id} n={n} onClose={removeNotification} />
      ))}
    </div>
  )
}

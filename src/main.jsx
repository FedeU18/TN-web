import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './i18n/i18n.jsx'
import { NotificationProvider } from './contexts/NotificationContext'
import Toasts from './components/Toasts/Toasts'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NotificationProvider>
      <App />
      <Toasts />
    </NotificationProvider>
  </StrictMode>,
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import './index.css'
import { setConfig, config } from '@nx-mono/broker'
import App from './App.tsx'

setConfig({ apiUrl: import.meta.env.VITE_API_NET || 'http://localhost:8000' })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)

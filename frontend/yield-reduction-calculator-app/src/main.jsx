import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CssVarsProvider } from '@mui/joy'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <CssVarsProvider>
    <App />
  </CssVarsProvider>,
)

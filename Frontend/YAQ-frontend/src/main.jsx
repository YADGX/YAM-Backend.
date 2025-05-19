import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './pages/App/App.jsx'
import { BrowserRouter } from 'react-router';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
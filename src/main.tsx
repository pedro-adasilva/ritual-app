import App from './App'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Solo en producción, para no pelear con la caché al desarrollar
if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then(async (reg) => {
        // intenta actualizar al cargar
        try { await reg.update(); } catch {}
      })
      .catch((err) => console.error("SW error", err));
  });
}


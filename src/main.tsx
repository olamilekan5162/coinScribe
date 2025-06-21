import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Temporary fix for process.env crash
if (typeof window !== "undefined" && typeof window.process === "undefined") {
  window.process = { env: {} };
}


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

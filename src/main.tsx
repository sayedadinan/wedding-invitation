import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { wedding } from './config/wedding';
import './index.css';

// Apply theme colours from the config as CSS variables.
for (const [key, value] of Object.entries(wedding.theme)) {
  document.documentElement.style.setProperty(`--c-${key}`, value);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserProvider } from './context/BrowserContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserProvider>
      <App />
    </BrowserProvider>
  </React.StrictMode>
);


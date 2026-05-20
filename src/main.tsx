import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import App from './App';
import ZipperReveal from './components/ZipperReveal';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <ZipperReveal>
          <App />
        </ZipperReveal>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);

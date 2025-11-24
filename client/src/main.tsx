import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/primereact.min.css'; 
import 'primeicons/primeicons.css';               
import 'primeflex/primeflex.css';                 

import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx';
import { CartProvider } from './context/CartContext.tsx';
import { ToastProvider } from './context/ToastContext.tsx'; // <--- Importar

const themeId = "theme-link";
const themeBase = "cyan"; 
let themeHref = `https://unpkg.com/primereact/resources/themes/lara-light-${themeBase}/theme.css`;

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  themeHref = `https://unpkg.com/primereact/resources/themes/lara-dark-${themeBase}/theme.css`;
}

let link = document.getElementById(themeId) as HTMLLinkElement;
if (!link) {
    link = document.createElement("link");
    link.id = themeId;
    link.rel = "stylesheet";
    document.head.appendChild(link);
}
link.href = themeHref;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PrimeReactProvider>
      <ToastProvider>
        <BrowserRouter>
          <AuthProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </AuthProvider>
        </BrowserRouter>
      </ToastProvider>
    </PrimeReactProvider>
  </React.StrictMode>,
)
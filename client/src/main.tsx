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

const themeId = "theme-link";
let themeHref = "https://unpkg.com/primereact/resources/themes/lara-light-teal/theme.css";

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  themeHref = "https://unpkg.com/primereact/resources/themes/lara-dark-teal/theme.css";
}

let link = document.getElementById(themeId) as HTMLLinkElement;
if (link) {
  link.href = themeHref;
} else {
  link = document.createElement("link");
  link.id = themeId;
  link.rel = "stylesheet";
  link.href = themeHref;
  document.head.appendChild(link);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PrimeReactProvider>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </PrimeReactProvider>
  </React.StrictMode>,
)
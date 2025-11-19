import React, { useEffect, useState, useRef } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { API_BASE_URL } from "@/lib/axios";
import { useAuth } from "@/context/hooks/use-auth";

// Componentes do PrimeReact
import { Button } from "primereact/button";
import { OverlayPanel } from "primereact/overlaypanel";
import { InputText } from "primereact/inputtext";
import { Menu } from "primereact/menu";
import { Avatar } from "primereact/avatar";

import { LoginForm } from "@/components/login-form";

import "./TopMenu.css";

const TopMenu: React.FC = () => {
  const navigate = useNavigate();
  const { authenticated, authenticatedUser, handleLogout } = useAuth();
  
  const searchPanel = useRef<OverlayPanel>(null);
  const loginPanel = useRef<OverlayPanel>(null);
  const userMenu = useRef<Menu>(null);

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const themeLink = document.getElementById("theme-link") as HTMLLinkElement;
    
    if (themeLink) {
      const currentUrl = themeLink.getAttribute('href');
      
      if (currentUrl) {
          let newUrl = currentUrl;

          if (darkMode && currentUrl.includes('light')) {
              newUrl = currentUrl.replace('light', 'dark');
          } else if (!darkMode && currentUrl.includes('dark')) {
              newUrl = currentUrl.replace('dark', 'light');
          }
          if (newUrl !== currentUrl) {
              themeLink.href = newUrl;
          }
      }

      localStorage.setItem("theme", darkMode ? "dark" : "light");
    }
  }, [darkMode]);

  const userMenuItems = [
    {
        label: 'Minha Conta',
        items: [
            { label: 'Meu Perfil', icon: 'pi pi-user', command: () => {} },
            { label: 'Meus Pedidos', icon: 'pi pi-box', command: () => {} },
        ]
    },
    {
        label: 'Ações',
        items: [
            { label: 'Sair', icon: 'pi pi-sign-out', command: () => { handleLogout(); navigate('/'); } }
        ]
    }
  ];

  return (
    <nav className="top-menu-container px-4 py-2 flex align-items-center justify-content-between">
      
      {/* ESQUERDA: LOGO */}
      <div className="flex align-items-center cursor-pointer" onClick={() => navigate("/")}>
        <img 
            src={`${API_BASE_URL}/images/logo.webp`} 
            alt="Boards and Cats" 
            className="logo-img mr-2" 
        />
      </div>

      {/* CENTRO: MENU DE NAVEGAÇÃO */}
      <div className="hidden md:flex align-items-center gap-1">
        <NavLink to="/" className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}>
            <img src={`${API_BASE_URL}/images/happy.png`} className="nav-icon-img" alt="Início" />
            <span>Início</span>
        </NavLink>
        <NavLink to="/categories/1" className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}>
            <img src={`${API_BASE_URL}/images/table-games.png`} className="nav-icon-img" alt="Tabuleiro" />
            <span>Jogos de Tabuleiro</span>
        </NavLink>
        <NavLink to="/categories/2" className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}>
            <img src={`${API_BASE_URL}/images/poker-game.png`} className="nav-icon-img" alt="Card Games" />
            <span>Card Games</span>
        </NavLink>
        <NavLink to="/categories/3" className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}>
            <img src={`${API_BASE_URL}/images/dices.png`} className="nav-icon-img" alt="Acessórios" />
            <span>Acessórios</span>
        </NavLink>
        <NavLink to="/promotions" className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}>
            <img src={`${API_BASE_URL}/images/promo-code.png`} className="nav-icon-img" alt="Promoções" />
            <span>Promoções</span>
        </NavLink>
      </div>

      {/* DIREITA: AÇÕES */}
      <div className="flex align-items-center gap-2 md:gap-3">

        {/* Botão de Tema (Lua/Sol) */}
        <Button 
            icon={`pi ${darkMode ? 'pi-sun' : 'pi-moon'}`} 
            rounded 
            text 
            severity="secondary" 
            aria-label="Alternar Tema"
            onClick={() => setDarkMode(!darkMode)}
            tooltip={darkMode ? "Modo Claro" : "Modo Escuro"}
            tooltipOptions={{ position: 'bottom' }}
        />

        {/* Busca */}
        <Button 
            icon="pi pi-search" 
            rounded text severity="secondary" aria-label="Buscar" 
            onClick={(e) => searchPanel.current?.toggle(e)}
        />
        <OverlayPanel ref={searchPanel} className="w-20rem">
            <div className="p-inputgroup">
                <InputText placeholder="Buscar produtos..." />
                <Button icon="pi pi-search" />
            </div>
        </OverlayPanel>

        {/* Carrinho */}
        <Button 
            icon="pi pi-shopping-cart" 
            rounded text severity="secondary" aria-label="Carrinho"
            onClick={() => navigate("/cart")}
        />

        {/* Usuário / Login Dropdown */}
        {authenticated ? (
            <>
                <Menu model={userMenuItems} popup ref={userMenu} id="popup_menu_user" />
                <div 
                    className="cursor-pointer flex align-items-center gap-2 hover:surface-100 p-1 border-round transition-duration-200"
                    onClick={(event) => userMenu.current?.toggle(event)}
                    aria-controls="popup_menu_user"
                    aria-haspopup
                >
                    <Avatar 
                        icon="pi pi-user"
                        shape="circle" 
                        className="surface-200 text-700"
                    />
                    <span className="font-semibold text-sm hidden lg:block text-900">
                        {authenticatedUser?.displayName?.split(' ')[0]}
                    </span>
                    <i className="pi pi-angle-down text-sm text-600 hidden lg:block"></i>
                </div>
            </>
        ) : (
            <>
                <Button 
                    icon="pi pi-user" 
                    rounded 
                    text 
                    severity="secondary" 
                    aria-label="Login"
                    onClick={(e) => loginPanel.current?.toggle(e)}
                />

                <OverlayPanel ref={loginPanel} className="w-20rem">
                    <div className="flex flex-column gap-3">
                        <h3 className="text-center m-0">Bem-vindo</h3>
                        <LoginForm 
                            onSuccess={() => loginPanel.current?.hide()} 
                            showRegisterLink={true}
                        />
                    </div>
                </OverlayPanel>
            </>
        )}

      </div>
    </nav>
  );
};

export default TopMenu;
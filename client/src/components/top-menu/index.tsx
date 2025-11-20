import React, { useEffect, useState, useRef } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { API_BASE_URL } from "@/lib/axios";
import { useAuth } from "@/context/hooks/use-auth";

import { Button } from "primereact/button";
import { OverlayPanel } from "primereact/overlaypanel";
import { InputText } from "primereact/inputtext";
import { Menu } from "primereact/menu";
import { Avatar } from "primereact/avatar";
import { Sidebar } from "primereact/sidebar";
import { Divider } from "primereact/divider";

import { LoginForm } from "@/components/login-form";
import { HappyIcon } from "@/components/icons/HappyIcon";
import { BoardGameIcon } from "@/components/icons/BoardGameIcon";
import { CardGameIcon } from "@/components/icons/CardGameIcon";
import { DicesIcon } from "@/components/icons/DicesIcon";
import { PromoIcon } from "@/components/icons/PromoIcon";

import "./TopMenu.css";

const TopMenu: React.FC = () => {
  const navigate = useNavigate();
  const { authenticated, authenticatedUser, handleLogout } = useAuth();
  
  const searchPanel = useRef<OverlayPanel>(null);
  const loginPanel = useRef<OverlayPanel>(null);
  const tabletControlPanel = useRef<OverlayPanel>(null); 
  const userMenu = useRef<Menu>(null);
  const [visibleSidebar, setVisibleSidebar] = useState(false);

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
            { label: 'Meu Perfil', icon: 'pi pi-user', command: () => navigate('/profile') },
            { label: 'Meus Pedidos', icon: 'pi pi-box', command: () => navigate('/orders') },
        ]
    },
    {
        label: 'Ações',
        items: [
            { label: 'Sair', icon: 'pi pi-sign-out', command: () => { handleLogout(); navigate('/'); } }
        ]
    }
  ];

  // Renderização do Conteúdo do Tablet (Overlay)
  const renderTabletPopupContent = () => (
      <div className="flex flex-column gap-2">
          {authenticated ? (
              <div className="flex flex-column gap-1">
                  <div className="flex align-items-center gap-2 mb-2 px-2 text-900">
                      <Avatar icon="pi pi-user" shape="circle" />
                      <span className="font-bold text-lg">{authenticatedUser?.displayName?.split(' ')[0]}</span>
                  </div>
                  <Button label="Meu Perfil" icon="pi pi-user" link className="text-left pl-2 py-2" onClick={() => { navigate('/profile'); tabletControlPanel.current?.hide(); }} />
                  <Button label="Meus Pedidos" icon="pi pi-box" link className="text-left pl-2 py-2" onClick={() => { navigate('/orders'); tabletControlPanel.current?.hide(); }} />
                  <Button label="Sair" icon="pi pi-sign-out" severity="danger" text className="text-left pl-2 py-2" onClick={() => { handleLogout(); tabletControlPanel.current?.hide(); navigate('/'); }} />
              </div>
          ) : (
              <div className="px-1 pt-1">
                  <h3 className="text-center m-0 mb-3 text-900">Bem-vindo</h3>
                  <LoginForm onSuccess={() => tabletControlPanel.current?.hide()} showRegisterLink={true} />
              </div>
          )}
          <Divider className="my-2" />
          <div className="flex justify-content-center gap-4 pb-1">
              <Button icon={`pi ${darkMode ? 'pi-sun' : 'pi-moon'}`} rounded text severity="secondary" aria-label="Alternar Tema" size="large" onClick={() => setDarkMode(!darkMode)} tooltip={darkMode ? "Modo Claro" : "Modo Escuro"} tooltipOptions={{ position: 'bottom' }} />
              <Button icon="pi pi-shopping-cart" rounded text severity="secondary" aria-label="Carrinho" size="large" onClick={() => { navigate("/cart"); tabletControlPanel.current?.hide(); }} />
          </div>
      </div>
  );

  const renderNavLinks = (isSidebar: boolean = false) => (
    <>
        <NavLink to="/" className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`} onClick={() => isSidebar && setVisibleSidebar(false)}>
            <HappyIcon size={28} className="nav-icon-svg" />
            <span>Início</span>
        </NavLink>
        <NavLink to="/categories/1" className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`} onClick={() => isSidebar && setVisibleSidebar(false)}>
            <BoardGameIcon size={28} className="nav-icon-svg" />
            <span>Jogos de Tabuleiro</span>
        </NavLink>
        <NavLink to="/categories/2" className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`} onClick={() => isSidebar && setVisibleSidebar(false)}>
            <CardGameIcon size={28} className="nav-icon-svg" />
            <span>Card Games</span>
        </NavLink>
        <NavLink to="/categories/3" className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`} onClick={() => isSidebar && setVisibleSidebar(false)}>
            <DicesIcon size={28} className="nav-icon-svg" />
            <span>Acessórios</span>
        </NavLink>
        <NavLink to="/promotions" className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`} onClick={() => isSidebar && setVisibleSidebar(false)}>
            <PromoIcon size={28} className="nav-icon-svg" />
            <span>Promoções</span>
        </NavLink>
    </>
  );

  return (
    <nav className="top-menu-container px-4 py-2 flex align-items-center justify-content-between relative">
      
      {/* --- 1. SIDEBAR (MOBILE ONLY - < 871px) --- */}
      <Sidebar 
        visible={visibleSidebar} 
        onHide={() => setVisibleSidebar(false)} 
        className="w-20rem"
        showCloseIcon={false} 
      >
          <div className="flex flex-column h-full">
              
              {/* Cabeçalho: Dark Mode e Fechar */}
              <div className="flex align-items-center justify-content-between mb-2">
                  <Button 
                      icon={`pi ${darkMode ? 'pi-sun' : 'pi-moon'}`} 
                      rounded text severity="secondary" aria-label="Alternar Tema"
                      onClick={() => setDarkMode(!darkMode)}
                  />
                  <Button 
                      icon="pi pi-times" 
                      rounded text severity="secondary" aria-label="Fechar"
                      onClick={() => setVisibleSidebar(false)}
                  />
              </div>

              {/* CORPO PRINCIPAL: Logo, Links, Carrinho, Login (Se não autenticado) */}
              <div className="flex flex-column gap-2">
                  <div className="text-center mb-3">
                    <img src={`${API_BASE_URL}/images/logow.webp`} alt="Logo" style={{ height: '60px' }} />
                  </div>
                  
                  <div className="flex flex-column gap-2">{renderNavLinks(true)}</div>
                  
                  <Divider />

                  <div className="flex flex-column gap-3">
                      {/* Carrinho: Fica aqui no corpo principal */}
                      <Button 
                          label="Carrinho"
                          icon="pi pi-shopping-cart" 
                          outlined onClick={() => { navigate("/cart"); setVisibleSidebar(false); }} className="w-full"
                      />
                      
                      {/* Botão de Login (Se NÃO logado): Fica aqui no corpo principal */}
                      {!authenticated && (
                          <div className="p-3 text-center surface-100 border-round">
                               <p className="m-0 mb-2 font-bold">Acesse sua conta</p>
                               <Button 
                                    label="Login / Cadastro" 
                                    onClick={() => { setVisibleSidebar(false); navigate('/login'); }} 
                                    className="w-full" 
                               />
                          </div>
                      )}
                  </div>
              </div>

              {/* RODAPÉ: Apenas Menu de Usuário Logado */}
              {authenticated && (
                  <div className="mt-auto pt-3">
                      <Divider />
                      <div className="flex flex-column gap-2 surface-100 p-3 border-round">
                          <div className="flex align-items-center gap-2 mb-2">
                              <Avatar icon="pi pi-user" shape="circle" />
                              <span className="font-bold">{authenticatedUser?.displayName}</span>
                          </div>
                          <Button label="Meu Perfil" icon="pi pi-user" link onClick={() => { navigate('/profile'); setVisibleSidebar(false); }} className="text-left pl-0" />
                          <Button label="Meus Pedidos" icon="pi pi-box" link onClick={() => { navigate('/orders'); setVisibleSidebar(false); }} className="text-left pl-0" />
                          <Button label="Sair" icon="pi pi-sign-out" severity="danger" text onClick={() => { handleLogout(); setVisibleSidebar(false); navigate('/'); }} className="text-left pl-0" />
                      </div>
                  </div>
              )}

          </div>
      </Sidebar>

      {/* --- 2. ESQUERDA --- */}
      <div className="flex align-items-center gap-2">
          <Button 
            icon="pi pi-bars" text rounded size="large"
            className="d-mobile text-900" 
            onClick={() => setVisibleSidebar(true)} 
          />
          
          <div className="d-tablet-desktop align-items-center cursor-pointer" onClick={() => navigate("/")}>
            <img src={`${API_BASE_URL}/images/logow.webp`} alt="Boards and Cats" className="logo-img mr-2" />
          </div>
      </div>

      {/* --- 3. CENTRO --- */}
      <div 
        className="d-mobile logo-mobile-center cursor-pointer" 
        onClick={() => navigate("/")}
      >
          <img src={`${API_BASE_URL}/images/logow.webp`} alt="Logo" className="logo-img" style={{ height: '50px', width: 'auto' }} />
      </div>

      <div className="d-tablet-desktop align-items-center gap-1">
        {renderNavLinks(false)}
      </div>

      {/* --- 4. DIREITA --- */}
      <div className="flex align-items-center gap-2 md:gap-3">
        <Button 
            icon="pi pi-search" rounded text severity="secondary" aria-label="Buscar" 
            onClick={(e) => searchPanel.current?.toggle(e)}
        />
        <OverlayPanel ref={searchPanel} className="w-20rem">
            <div className="p-inputgroup">
                <InputText placeholder="Buscar produtos..." />
                <Button icon="pi pi-search" />
            </div>
        </OverlayPanel>

        <div className="d-tablet">
            <Button icon="pi pi-ellipsis-v" rounded text severity="secondary" onClick={(e) => tabletControlPanel.current?.toggle(e)} />
            <OverlayPanel ref={tabletControlPanel} className="w-22rem">
                {renderTabletPopupContent()}
            </OverlayPanel>
        </div>

        <div className="d-desktop align-items-center gap-2">
            <Button 
                icon={`pi ${darkMode ? 'pi-sun' : 'pi-moon'}`} rounded text severity="secondary" 
                onClick={() => setDarkMode(!darkMode)} tooltip={darkMode ? "Modo Claro" : "Modo Escuro"} tooltipOptions={{ position: 'bottom' }}
            />
            <Button icon="pi pi-shopping-cart" rounded text severity="secondary" onClick={() => navigate("/cart")} />
            {authenticated ? (
                <>
                    <Menu model={userMenuItems} popup ref={userMenu} id="popup_menu_user" />
                    <div className="cursor-pointer flex align-items-center gap-2 hover:surface-100 p-1 border-round transition-duration-200" onClick={(event) => userMenu.current?.toggle(event)}>
                        <Avatar icon="pi pi-user" shape="circle" className="surface-200 text-700" />
                        <span className="font-semibold text-sm text-900">{authenticatedUser?.displayName?.split(' ')[0]}</span>
                        <i className="pi pi-angle-down text-sm text-600"></i>
                    </div>
                </>
            ) : (
                <>
                    <Button icon="pi pi-user" rounded text severity="secondary" onClick={(e) => loginPanel.current?.toggle(e)} />
                    <OverlayPanel ref={loginPanel} className="w-20rem">
                        <div className="flex flex-column gap-3">
                            <h3 className="text-center m-0">Bem-vindo</h3>
                            <LoginForm onSuccess={() => loginPanel.current?.hide()} showRegisterLink={true} />
                        </div>
                    </OverlayPanel>
                </>
            )}
        </div>
      </div>
    </nav>
  );
};

export default TopMenu;
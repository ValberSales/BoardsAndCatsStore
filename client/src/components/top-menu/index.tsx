import React, { useEffect, useState } from "react";
import { Menubar } from "primereact/menubar";
import type { MenuItem } from "primereact/menuitem";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/hooks/use-auth";
import { InputSwitch } from "primereact/inputswitch";

const TopMenu: React.FC = () => {
  const navigate = useNavigate();
  const { authenticated, authenticatedUser, handleLogout } = useAuth();


  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("theme") === "dark";
  });


  useEffect(() => {
    const themeLink = document.getElementById("theme-link") as HTMLLinkElement;
    
    if (themeLink) {

      const currentThemeHref = themeLink.href;
      let newThemeHref: string;

      if (darkMode) {
        newThemeHref = currentThemeHref.replace("light", "dark");
      } else {
        newThemeHref = currentThemeHref.replace("dark", "light");
      }
      
      themeLink.href = newThemeHref;
      localStorage.setItem("theme", darkMode ? "dark" : "light");
    }
  }, [darkMode]); 


  const handleLogoutClick = () => {
    handleLogout();
    navigate("/login");
  };

  const items: MenuItem[] = authenticated
    ? [ { label: "Home", icon: "pi pi-home", command: () => navigate("/") } ]
    : [ { label: "Home", icon: "pi pi-home", command: () => navigate("/") } ];

  const start = (
    <div
      className="flex align-items-center gap-2 cursor-pointer"
      onClick={() => navigate("/")}
    >
      <img
        src="/images/logo-placeholder.png" 
        alt="Logo"
        height={32}
        style={{ objectFit: "contain" }}
      />
      <span className="font-bold text-lg hidden sm:block">Boards and Cats</span>
    </div>
  );

  const end = (
    <div className="flex align-items-center gap-3">
      {/* Bloco do InputSwitch */}
      <div className="flex items-center gap-2">
        <i
          className={`pi pi-sun ${
            darkMode ? "text-gray-400" : "text-yellow-500"
          }`}
          style={{ marginTop: "5px" }}
        />
        <InputSwitch
          checked={darkMode}
          onChange={(e) => setDarkMode(e.value ?? false)}
        />
        <i
          className={`pi pi-moon ${
            darkMode ? "text-blue-300" : "text-gray-400"
          }`}
          style={{ marginTop: "5px" }}
        />
      </div>

      {authenticated ? (
        <>
          <span className="font-semibold hidden sm:block">{authenticatedUser?.displayName}</span>
          <Avatar
            image="https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Caleb"
            shape="circle"
          />
          <Button
            icon="pi pi-sign-out"
            className="p-button-text p-button-danger"
            onClick={handleLogoutClick}
            tooltip="Sair"
            tooltipOptions={{ position: 'bottom' }}
          />
        </>
      ) : (
        <>
          <Button
            label="Login"
            icon="pi pi-sign-in"
            className="p-button-text"
            onClick={() => navigate("/login")}
          />
          <Button
            label="Registrar"
            onClick={() => navigate("/register")}
          />
        </>
      )}
    </div>
  );

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        width: "100%",
        zIndex: 1000,
        backgroundColor: "var(--surface-ground)", 
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <Menubar model={items} start={start} end={end} />
    </div>
  );
};

export default TopMenu;
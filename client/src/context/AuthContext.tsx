import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { AuthenticatedUser, AuthenticationResponse } from "@/commons/types";
import { api } from "@/lib/axios";

interface AuthContextType {
  authenticated: boolean;
  authenticatedUser?: AuthenticatedUser;
  handleLogin: (authenticationResponse: AuthenticationResponse) => void;
  handleLogout: () => void;
  updateUser: (user: AuthenticatedUser) => void;
  updateAccessToken: (token: string) => void; // <--- NOVA FUNÇÃO
  isLoading: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext({} as AuthContextType);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState<AuthenticatedUser | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      try {
        const parsedToken = JSON.parse(storedToken);
        setAuthenticatedUser(JSON.parse(storedUser));
        setAuthenticated(true);
        api.defaults.headers.common["Authorization"] = `Bearer ${parsedToken}`;
      } catch (error) {
        console.error("Erro ao restaurar sessão:", error);
        handleLogout();
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (authenticationResponse: AuthenticationResponse) => {
    localStorage.setItem("token", JSON.stringify(authenticationResponse.token));
    localStorage.setItem("user", JSON.stringify(authenticationResponse.user));
    api.defaults.headers.common["Authorization"] = `Bearer ${authenticationResponse.token}`;
    setAuthenticatedUser(authenticationResponse.user);
    setAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    api.defaults.headers.common["Authorization"] = "";
    setAuthenticated(false);
    setAuthenticatedUser(undefined);
  };

  const updateUser = (user: AuthenticatedUser) => {
    localStorage.setItem("user", JSON.stringify(user));
    setAuthenticatedUser(user);
  };

  // --- NOVA FUNÇÃO ---
  const updateAccessToken = (token: string) => {
    localStorage.setItem("token", JSON.stringify(token));
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    // Não precisamos mexer no 'user' aqui, apenas renovar a credencial
  };

  return (
    <AuthContext.Provider
      value={{ 
        authenticated, 
        authenticatedUser, 
        handleLogin, 
        handleLogout, 
        updateUser, 
        updateAccessToken, // <--- Exportando
        isLoading 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
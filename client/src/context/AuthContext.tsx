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
  updateAccessToken: (token: string) => void;
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
    // ADIÇÃO: Limpa o carrinho ao deslogar para evitar mistura de dados entre usuários
    localStorage.removeItem("boardsandcats_cart");
    
    api.defaults.headers.common["Authorization"] = "";
    setAuthenticated(false);
    setAuthenticatedUser(undefined);
    
    // Opcional: Recarregar a página para limpar estados em memória de outros contextos
    // window.location.reload(); 
  };

  const updateUser = (user: AuthenticatedUser) => {
    localStorage.setItem("user", JSON.stringify(user));
    setAuthenticatedUser(user);
  };

  const updateAccessToken = (token: string) => {
    localStorage.setItem("token", JSON.stringify(token));
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  return (
    <AuthContext.Provider
      value={{ 
        authenticated, 
        authenticatedUser, 
        handleLogin, 
        handleLogout, 
        updateUser, 
        updateAccessToken,
        isLoading 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
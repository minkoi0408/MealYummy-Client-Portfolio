import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

interface User {
  username: string;
  email: string;
  avatarUrl?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (accessToken: string, refreshToken?: string, userData?: User, rememberMe?: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");

    if (token) {
      setIsAuthenticated(true);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Failed to parse stored user", e);
        }
      }
    }
    
    setIsInitializing(false);
  }, []);

  const login = (accessToken: string, refreshToken?: string, userData?: User, rememberMe?: boolean) => {
    const storage = rememberMe ? localStorage : sessionStorage;
    
    storage.setItem("accessToken", accessToken);
    if (refreshToken) {
      storage.setItem("refreshToken", refreshToken);
    }
    if (userData) {
      storage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    }
    
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("user");
    
    setIsAuthenticated(false);
    setUser(null);
    toast.success("Đã đăng xuất thành công");
  };

  if (isInitializing) {
    // Prevent rendering until we know the initial auth state,
    // to avoid flickering or incorrect redirects.
    return null; 
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

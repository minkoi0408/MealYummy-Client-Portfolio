import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";

interface User {
  username: string;
  email: string;
  avatarUrl?: string;
  role?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (accessToken: string, refreshToken?: string, userData?: User, rememberMe?: boolean) => void;
  logout: () => void;
  role: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");

    if (token) {
      setIsAuthenticated(true);
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setRole(parsedUser.role || null);
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
    
    // Decode JWT for role
    let decodedRole = "";
    try {
      const decoded: any = jwtDecode(accessToken);
      decodedRole = decoded.role || decoded.Role || "";
    } catch (e) {
      console.error("Failed to decode token", e);
    }

    if (userData) {
      const extendedUserData = { ...userData, role: decodedRole };
      storage.setItem("user", JSON.stringify(extendedUserData));
      setUser(extendedUserData);
      setRole(decodedRole);
    } else {
      setRole(decodedRole);
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
    setRole(null);
    toast.success("Đã đăng xuất thành công");
  };

  if (isInitializing) {
    // Prevent rendering until we know the initial auth state,
    // to avoid flickering or incorrect redirects.
    return null; 
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, role }}>
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

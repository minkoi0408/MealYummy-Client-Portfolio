import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../app/contexts/auth-context";
import { RequireLoginPage } from "../app/pages/require-login-page";

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <RequireLoginPage />;
  }

  return <Outlet />;
}

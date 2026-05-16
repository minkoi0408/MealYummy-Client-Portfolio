import { Navigate, Outlet } from "react-router";

export function ProtectedRoute() {
  const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
  
  if (!token) {
    // Redirect to login if there is no token
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

import { Outlet } from "react-router-dom";
import { useAuth } from "../app/contexts/auth-context";
import { RequirePremiumPage } from "../app/pages/require-premium-page";

/**
 * PremiumRoute - chặn trang với tài khoản ROLE_FREE
 * Hiển thị trang upsell Membership nếu user là Free
 */
export function PremiumRoute() {
  const { isAuthenticated, role } = useAuth();

  // Chưa đăng nhập -> Outlet sẽ được xử lý bởi ProtectedRoute ở ngoài
  // Đăng nhập nhưng là Free -> upsell
  if (isAuthenticated && role === "ROLE_FREE") {
    return <RequirePremiumPage />;
  }

  return <Outlet />;
}

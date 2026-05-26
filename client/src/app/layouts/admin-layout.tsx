import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Outlet, Link } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Shield, 
  LogOut, 
  Menu, 
  Utensils, 
  Tags, 
  Apple, 
  Coffee, 
  Package, 
  CreditCard, 
  UserCheck 
} from "lucide-react";
import { useAuth } from "../contexts/auth-context";

export function AdminLayout() {
  const { logout, role, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // Only allow Admin/Manager
  useEffect(() => {
    if (role !== "ROLE_ADMIN" && role !== "ROLE_MANAGER") {
      navigate("/home");
    }
  }, [role, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuGroups = [
    {
      title: "Chính",
      items: [
        { path: "/admin", label: "Tổng quan", icon: LayoutDashboard },
      ]
    },
    {
      title: "Quản lý Món ăn",
      items: [
        { path: "/admin/categories", label: "Danh mục", icon: Tags },
        { path: "/admin/tags", label: "Thẻ (Tags)", icon: Utensils },
        { path: "/admin/ingredients", label: "Nguyên liệu", icon: Apple },
        { path: "/admin/meals", label: "Món ăn", icon: Coffee },
      ]
    },
    {
      title: "Quản lý Gói Dịch vụ",
      items: [
        { path: "/admin/bundles", label: "Gói dịch vụ", icon: Package },
        { path: "/admin/user-subscriptions", label: "Đăng ký của User", icon: UserCheck },
        { path: "/admin/payment-histories", label: "Lịch sử thanh toán", icon: CreditCard },
      ]
    },
    {
      title: "Quản lý Người dùng",
      items: [
        { path: "/admin/users", label: "Người dùng", icon: Users },
        { path: "/admin/roles", label: "Vai trò & Quyền", icon: Shield },
      ]
    }
  ];

  return (
    <div className="flex h-screen bg-[#F3F4F6] text-[#111827] font-sans overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? "w-[260px]" : "w-[80px]"
        } bg-[#111827] text-white flex flex-col h-full shrink-0 transition-all duration-300 z-20`}
      >
        <div className="p-4 flex items-center justify-between">
          <div className={`flex items-center gap-3 ${!isSidebarOpen && "hidden"}`}>
            <img src="/logo.svg" alt="Logo" className="w-8 h-8 object-contain drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            <div className="flex flex-col">
              <span className="text-[18px] font-black uppercase tracking-[0.1em] text-white drop-shadow-md leading-none">
                DASHBOARD
              </span>
            </div>
          </div>
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          <div className="px-3 py-4 space-y-6">
            {menuGroups.map((group, groupIdx) => (
              <div key={groupIdx}>
                {isSidebarOpen && (
                  <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {group.title}
                  </h3>
                )}
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    // Check if active (exact match for root, startsWith for others)
                    const isActive = item.path === "/admin" 
                      ? location.pathname === "/admin" 
                      : location.pathname.startsWith(item.path);

                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        title={!isSidebarOpen ? item.label : undefined}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm
                          ${isActive 
                            ? "bg-[#10B981]/10 text-[#10B981]" 
                            : "text-gray-400 hover:text-white hover:bg-white/5"
                          }`}
                      >
                        <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-[#10B981]" : ""}`} />
                        {isSidebarOpen && <span className="truncate">{item.label}</span>}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            title={!isSidebarOpen ? "Đăng xuất" : undefined}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {isSidebarOpen && "Đăng xuất"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-gray-800">
              {/* Optional: Breadcrumbs or current page title could go here */}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-sm font-bold text-gray-900">{user?.username || "Admin"}</span>
              <span className="text-xs text-[#10B981] font-medium">{role === "ROLE_ADMIN" ? "Administrator" : "Manager"}</span>
            </div>
            <div className="w-10 h-10 bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] rounded-full flex items-center justify-center font-bold text-lg overflow-hidden">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                (user?.username || "A").charAt(0).toUpperCase()
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-[#F9FAFB] p-6 relative">
          {/* This is where the nested routes will render */}
          <Outlet />
        </div>
      </main>
    </div>
  );
}

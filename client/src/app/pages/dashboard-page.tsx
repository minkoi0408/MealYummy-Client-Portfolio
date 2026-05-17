import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, Settings, LogOut, Shield } from "lucide-react";
import { useAuth } from "../contexts/auth-context";
import { RoleManagement } from "../components/admin/role-management";

export function DashboardPage() {
  const { logout, role, user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("roles");

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

  const navItems = [
    { id: "overview", label: "Tổng quan", icon: LayoutDashboard },
    { id: "users", label: "Người dùng", icon: Users },
    { id: "roles", label: "Vai trò & Quyền", icon: Shield },
    { id: "settings", label: "Cài đặt", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#F3F4F6] text-[#111827] font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[250px] bg-[#111827] text-white flex flex-col h-full shrink-0">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="Logo" className="w-10 h-10 object-contain drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            <div className="flex flex-col">
              <span className="text-[22px] font-black uppercase tracking-[0.1em] text-white drop-shadow-md leading-none">
                DASHBOARD
              </span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-[#10B981] font-bold mt-1 leading-none">
                Workspace
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium text-sm
                  ${isActive 
                    ? "bg-white/10 text-[#10B981]" 
                    : "text-gray-400 hover:text-[#10B981] hover:bg-white/5"
                  }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-[#10B981]" : ""}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-400 hover:text-[#10B981] transition-colors rounded-lg hover:bg-white/5"
          >
            <LogOut className="w-5 h-5" />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
          <h1 className="text-xl font-semibold">
            {navItems.find(i => i.id === activeTab)?.label}
          </h1>
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
        <div className="flex-1 overflow-auto p-8">
          {activeTab === "roles" ? (
            <RoleManagement />
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-center h-64">
              <p className="text-gray-500">Tính năng đang được phát triển...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
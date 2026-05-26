import React from "react";
import { RoleManagement } from "../../../components/admin/role-management";

export function RoleManagementPage() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-full">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">Vai trò & Phân quyền</h2>
        <p className="text-sm text-gray-500 mt-1">Quản lý các vai trò và gán quyền hạn chi tiết cho từng vai trò.</p>
      </div>
      
      <RoleManagement />
    </div>
  );
}

import React, { useState, useEffect, useMemo } from "react";
import { Search, Edit, X, Loader2, Save, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

import type { RoleResponse, PermissionResponse } from "../../../apis/role.api";
import { roleApi } from "../../../apis/role.api";

export function RoleManagement() {
  const [roles, setRoles] = useState<RoleResponse[]>([]);
  const [permissions, setPermissions] = useState<PermissionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal state
  const [editingRole, setEditingRole] = useState<RoleResponse | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [rolesRes, permsRes] = await Promise.all([
        roleApi.getRoles(),
        roleApi.getPermissions()
      ]);
      setRoles(rolesRes?.data?.data || []);
      setPermissions(permsRes?.data?.data || []);
    } catch (err: any) {
      console.error(err);
      const backendMessage = err.response?.data?.message || "Không thể tải dữ liệu. Vui lòng thử lại sau.";
      setError(backendMessage);
      toast.error(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  const filteredRoles = useMemo(() => {
    if (!searchTerm) return roles;
    return (roles || []).filter(r => 
      r.roleName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      r.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [roles, searchTerm]);

  const permissionsByType = useMemo(() => {
    const groups: Record<string, PermissionResponse[]> = {};
    (permissions || []).forEach(p => {
      if (!groups[p.type]) groups[p.type] = [];
      groups[p.type].push(p);
    });
    return groups;
  }, [permissions]);

  const openEditModal = (role: RoleResponse) => {
    setEditingRole(role);
    setSelectedPermissions([...(role.permissions || [])]);
  };

  const closeEditModal = () => {
    setEditingRole(null);
    setSelectedPermissions([]);
  };

  const togglePermission = (code: string) => {
    setSelectedPermissions(prev => 
      prev.includes(code) 
        ? prev.filter(c => c !== code)
        : [...prev, code]
    );
  };

  const toggleAllInGroup = (type: string, selectAll: boolean) => {
    const groupPerms = permissionsByType[type].map(p => p.permissionCode);
    if (selectAll) {
      setSelectedPermissions(prev => [...new Set([...prev, ...groupPerms])]);
    } else {
      setSelectedPermissions(prev => prev.filter(code => !groupPerms.includes(code)));
    }
  };

  const renderPermissionPill = (p: string) => {
    let colorClass = "bg-gray-100 text-gray-800 border-gray-200";
    if (p.startsWith("GET_")) colorClass = "bg-green-100 text-green-800 border-green-200";
    else if (p.startsWith("POST_")) colorClass = "bg-amber-100 text-amber-800 border-amber-200";
    else if (p.startsWith("PUT_") || p.startsWith("PATCH_")) colorClass = "bg-blue-100 text-blue-800 border-blue-200";
    else if (p.startsWith("DELETE_")) colorClass = "bg-red-100 text-red-800 border-red-200";
  
    return (
      <span key={p} className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${colorClass}`}>
        {p}
      </span>
    );
  };

  const handleSavePermissions = async () => {
    if (!editingRole) return;
    setIsSaving(true);
    
    try {
      const originalPerms = editingRole.permissions || [];
      const toAdd = selectedPermissions.filter(p => !originalPerms.includes(p));
      const toRemove = originalPerms.filter(p => !selectedPermissions.includes(p));

      const promises = [];
      if (toAdd.length > 0) {
        promises.push(roleApi.addPermissions({ roleCode: editingRole.roleCode, permissionCodes: toAdd }));
      }
      if (toRemove.length > 0) {
        promises.push(roleApi.removePermissions({ roleCode: editingRole.roleCode, permissionCodes: toRemove }));
      }

      await Promise.all(promises);

      // Update local state
      setRoles(prev => prev.map(r => {
        if (r.roleCode === editingRole.roleCode) {
          return { ...r, permissions: selectedPermissions };
        }
        return r;
      }));

      toast.success(`Cập nhật quyền cho ${editingRole.roleName} thành công!`);
      closeEditModal();
    } catch (err: any) {
      console.error(err);
      const backendMessage = err.response?.data?.message || "Có lỗi xảy ra khi lưu quyền. Vui lòng thử lại.";
      toast.error(backendMessage);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Loader2 className="w-8 h-8 text-[#10B981] animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Đang tải dữ liệu vai trò...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-red-500">
        <ShieldAlert className="w-12 h-12 mb-4" />
        <p className="font-bold">{error}</p>
        <button onClick={fetchData} className="mt-4 px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition-colors">
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] sm:text-sm transition-colors"
            placeholder="Tìm kiếm vai trò..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-1/4">
                  Tên vai trò
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-1/4">
                  Mô tả
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-2/5">
                  Danh sách quyền
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider w-auto">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRoles.map((role) => (
                <tr key={role.roleCode} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-[#10B981]/10 flex items-center justify-center mr-3">
                        <ShieldAlert className="h-4 w-4 text-[#10B981]" />
                      </div>
                      <span className="text-sm font-bold text-gray-900">{role.roleName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">{role.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {(!role.permissions || role.permissions.length === 0) ? (
                        <span className="text-xs text-gray-400 italic">Chưa có quyền</span>
                      ) : (
                        <>
                          {role.permissions.slice(0, 5).map(renderPermissionPill)}
                          {role.permissions.length > 5 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-50 text-gray-500 border border-gray-200">
                              + {role.permissions.length - 5} quyền nữa
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => openEditModal(role)}
                      disabled={role.roleCode === "ROLE_ADMIN"}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-md transition-colors ${
                        role.roleCode === "ROLE_ADMIN"
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "text-[#10B981] hover:text-[#059669] bg-[#10B981]/10 hover:bg-[#10B981]/20"
                      }`}
                      title={role.roleCode === "ROLE_ADMIN" ? "Admin có toàn quyền, không thể sửa" : ""}
                    >
                      <Edit className="w-4 h-4" />
                      Sửa quyền
                    </button>
                  </td>
                </tr>
              ))}
              {filteredRoles.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    Không tìm thấy vai trò nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Permissions Modal */}
      {editingRole && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen p-4 text-center sm:p-0">
            
            {/* Background overlay */}
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" aria-hidden="true" onClick={closeEditModal}></div>

            {/* Modal Panel */}
            <div className="relative inline-block align-bottom bg-white border border-gray-200 rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl w-full">
              
              {/* Modal Header */}
              <div className="px-8 py-6 border-b border-gray-200 flex items-start justify-between bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center shrink-0">
                    <ShieldAlert className="w-6 h-6 text-[#10B981]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900" id="modal-title">
                      Phân quyền hệ thống
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Vai trò đang sửa: <span className="font-bold text-[#10B981] px-2 py-0.5 rounded bg-[#10B981]/10 border border-[#10B981]/20 ml-1">{editingRole.roleName}</span>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="bg-gray-100 rounded-full p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-all focus:outline-none"
                  onClick={closeEditModal}
                >
                  <span className="sr-only">Đóng</span>
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="px-8 py-6 max-h-[60vh] overflow-y-auto custom-scrollbar bg-white">
                {Object.entries(permissionsByType).map(([type, perms]) => (
                  <div key={type} className="mb-8 last:mb-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="flex items-center gap-3 mb-4">
                        <h4 className="text-sm font-black text-gray-800 uppercase tracking-widest bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
                          Nhóm: <span className="text-[#10B981]">{type}</span>
                        </h4>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => toggleAllInGroup(type, true)}
                            className="text-xs text-[#10B981] hover:underline font-semibold"
                          >
                            Chọn tất cả
                          </button>
                          <span className="text-gray-300">|</span>
                          <button
                            type="button"
                            onClick={() => toggleAllInGroup(type, false)}
                            className="text-xs text-gray-500 hover:underline font-semibold"
                          >
                            Bỏ chọn
                          </button>
                        </div>
                        <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent"></div>
                      </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {perms.map(permission => {
                        const isChecked = selectedPermissions.includes(permission.permissionCode);
                        return (
                          <div 
                            key={permission.permissionCode} 
                            className={`relative flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 group ${
                              isChecked 
                                ? 'border-[#10B981] bg-[#10B981]/5 shadow-[0_0_20px_rgba(16,185,129,0.1)]' 
                                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                            }`}
                            onClick={() => togglePermission(permission.permissionCode)}
                          >
                            <div className="flex items-center h-6 shrink-0 mt-0.5">
                              <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${isChecked ? 'bg-[#10B981] border-[#10B981]' : 'border-gray-300 bg-white'}`}>
                                {isChecked && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                              </div>
                            </div>
                            <div className="ml-4">
                              <label className={`text-sm font-bold cursor-pointer transition-colors ${isChecked ? 'text-gray-900' : 'text-gray-700 group-hover:text-gray-900'}`}>
                                {permission.permissionName}
                              </label>
                              <p className="text-gray-500 text-xs mt-1 leading-relaxed">{permission.description}</p>
                              <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-gray-100 text-gray-500 border border-gray-200">
                                {permission.permissionCode}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Modal Footer */}
              <div className="px-8 py-5 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 items-center">
                <span className="text-xs text-gray-500 mr-auto flex items-center gap-2 font-medium">
                  <ShieldAlert className="w-4 h-4 text-[#10B981]" /> Thay đổi quyền sẽ áp dụng ngay lập tức
                </span>
                <button
                  type="button"
                  className="px-5 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all focus:outline-none"
                  onClick={closeEditModal}
                  disabled={isSaving}
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center items-center px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-[#10B981] to-[#059669] rounded-xl hover:scale-105 active:scale-95 transition-all shadow-[0_4px_10px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:hover:scale-100"
                  onClick={handleSavePermissions}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Xác nhận lưu
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

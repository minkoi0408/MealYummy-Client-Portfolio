import { useState, useEffect } from "react";
import { userApi, UserResponseDTO } from "../../../apis/user.api";
import { roleApi, RoleResponse } from "../../../apis/role.api";
import { User, Shield, Search, ChevronLeft, ChevronRight, MoreVertical, Edit2 } from "lucide-react";
import { toast } from "sonner";

export function UserManagement() {
  const [users, setUsers] = useState<UserResponseDTO[]>([]);
  const [roles, setRoles] = useState<RoleResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [selectedRoleCode, setSelectedRoleCode] = useState<string>("");

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const fetchRoles = async () => {
    try {
      const res = await roleApi.getRoles();
      if (res.data.data) {
        setRoles(res.data.data);
      }
    } catch (err) {
      console.error("Lỗi khi tải vai trò", err);
    }
  };

  const fetchUsers = async (p: number) => {
    try {
      setLoading(true);
      const res = await userApi.getAll(p, 10);
      if (res.data.data) {
        setUsers(res.data.data.content);
        setTotalPages(res.data.data.totalPages);
        setTotalElements(res.data.data.totalElements);
      }
    } catch (err) {
      toast.error("Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId: string) => {
    if (!selectedRoleCode) return;
    const toastId = toast.loading("Đang cập nhật vai trò...");
    try {
      await userApi.updateRole(userId, selectedRoleCode);
      toast.success("Cập nhật vai trò thành công", { id: toastId });
      setEditingUserId(null);
      fetchUsers(page);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Cập nhật thất bại", { id: toastId });
    }
  };

  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-500" />
            Quản lý người dùng
          </h2>
          <p className="text-sm text-gray-500 mt-1">Tổng cộng {totalElements} người dùng trong hệ thống</p>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm người dùng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all w-64"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500 font-medium sticky top-0 z-10">
            <tr>
              <th className="px-6 py-4 font-semibold">Người dùng</th>
              <th className="px-6 py-4 font-semibold">Vai trò</th>
              <th className="px-6 py-4 font-semibold">Trạng thái</th>
              <th className="px-6 py-4 font-semibold">Ngày tham gia</th>
              <th className="px-6 py-4 font-semibold text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-gray-400">Đang tải dữ liệu...</td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-gray-400">Không tìm thấy người dùng nào</td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg shrink-0">
                        {u.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{u.username}</p>
                        <p className="text-xs text-gray-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {editingUserId === u.id ? (
                      <div className="flex items-center gap-2">
                        <select
                          value={selectedRoleCode}
                          onChange={(e) => setSelectedRoleCode(e.target.value)}
                          className="border border-gray-300 rounded-md text-xs p-1"
                        >
                          {roles.map(r => (
                            <option key={r.roleCode} value={r.roleCode}>{r.roleName}</option>
                          ))}
                        </select>
                        <button onClick={() => handleUpdateRole(u.id)} className="text-emerald-600 text-xs font-bold hover:underline">Lưu</button>
                        <button onClick={() => setEditingUserId(null)} className="text-gray-400 text-xs hover:underline">Hủy</button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <Shield className={`w-3.5 h-3.5 ${u.role?.roleCode === 'ROLE_ADMIN' ? 'text-purple-500' : u.role?.roleCode === 'ROLE_MANAGER' ? 'text-blue-500' : 'text-gray-400'}`} />
                        <span className={`font-medium ${u.role?.roleCode === 'ROLE_ADMIN' ? 'text-purple-700' : u.role?.roleCode === 'ROLE_MANAGER' ? 'text-blue-700' : 'text-gray-600'}`}>
                          {u.role?.roleName || "Người dùng"}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${u.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {u.active ? "Đang hoạt động" : "Bị khóa"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(u.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingUserId(u.id);
                          setSelectedRoleCode(u.role?.roleCode || "");
                        }}
                        className="p-1.5 text-gray-400 hover:text-emerald-600 transition-colors rounded hover:bg-emerald-50"
                        title="Đổi quyền"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-red-600 transition-colors rounded hover:bg-red-50">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50 rounded-b-xl">
        <span className="text-sm text-gray-500">
          Hiển thị trang {page + 1} trên {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="p-1.5 rounded border border-gray-200 text-gray-500 hover:bg-white disabled:opacity-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="p-1.5 rounded border border-gray-200 text-gray-500 hover:bg-white disabled:opacity-50 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

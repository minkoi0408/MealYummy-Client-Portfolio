import React, { useState, useEffect } from "react";
import { Table, Input, Tag, Select, message, Button } from "antd";
import { Search, ShieldAlert } from "lucide-react";
import { userApi, type UserResponseDTO } from "../../../../apis/user.api";
import { roleApi, type RoleResponse } from "../../../../apis/role.api";

export function UserManagementPage() {
  const [data, setData] = useState<UserResponseDTO[]>([]);
  const [roles, setRoles] = useState<RoleResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchUsers = async (page: number, size: number) => {
    setLoading(true);
    setError("");
    try {
      const response = await userApi.getAll(page - 1, size);
      if (response.data?.data) {
        setData(response.data.data.content || []);
        setTotal(response.data.data.page?.totalElements || response.data.data.totalElements || 0);
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Lỗi khi tải danh sách người dùng";
      message.error({ content: errorMsg, key: 'fetch-error' });
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await roleApi.getRoles();
      if (response.data?.data) {
        setRoles(response.data.data);
      }
    } catch (error) {
      console.error("Failed to load roles", error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    fetchUsers(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const handleRoleChange = async (userId: string, newRoleId: string) => {
    const hide = message.loading('Đang cập nhật quyền...', 0);
    try {
      await userApi.updateRole(userId, newRoleId);
      message.success('Cập nhật quyền thành công');
      fetchUsers(currentPage, pageSize); // refresh
    } catch (error) {
      message.error('Có lỗi xảy ra khi cập nhật quyền');
    } finally {
      hide();
    }
  };

  const columns = [
    {
      title: 'Tài khoản / Email',
      dataIndex: 'email',
      key: 'email',
      render: (email: string, record: UserResponseDTO) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800">{record.username}</span>
          <span className="text-xs text-gray-500">{email}</span>
        </div>
      )
    },
    {
      title: 'Vai trò (Role)',
      dataIndex: 'role',
      key: 'role',
      render: (role: any, record: UserResponseDTO) => {
        const currentRoleCode = roles.find(r => r.roleName === role?.roleName)?.roleCode || role?.roleCode;
        return (
          <Select
            value={currentRoleCode}
            className="w-40"
            onChange={(val) => handleRoleChange(record.id, val)}
            options={roles.map(r => ({ value: r.roleCode, label: r.roleName }))}
          />
        );
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'active',
      key: 'active',
      render: (active: boolean) => (
        <Tag color={active ? 'success' : 'error'} className="font-medium">
          {active ? 'Hoạt động' : 'Bị khóa'}
        </Tag>
      )
    },
    {
      title: 'Bảo mật 2FA',
      dataIndex: 'totpEnabled',
      key: 'totpEnabled',
      render: (totpEnabled: boolean) => (
        <Tag color={totpEnabled ? 'blue' : 'default'} className="font-medium">
          {totpEnabled ? 'Đã bật' : 'Chưa bật'}
        </Tag>
      )
    },
    {
      title: 'Ngày tham gia',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (dateStr: string) => <span className="text-gray-500">{new Date(dateStr).toLocaleDateString('vi-VN')}</span>
    },
  ];


  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <ShieldAlert className="w-16 h-16 mb-4 text-red-500" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">Không thể truy cập</h3>
        <p className="text-gray-500 text-center max-w-md mb-6">{error}</p>
        <Button onClick={() => { setError(""); fetchUsers(currentPage, pageSize); }} className="h-10 px-6 rounded-lg">
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Quản lý người dùng</h2>
          <p className="text-sm text-gray-500 mt-1">Danh sách người dùng và cấp phát vai trò (Role).</p>
        </div>
      </div>

      <div className="flex mb-6">
        <Input
          placeholder="Tìm kiếm user..."
          prefix={<Search className="w-4 h-4 text-gray-400" />}
          className="max-w-md h-10 rounded-lg hover:border-[#10B981] focus:border-[#10B981]"
        />
      </div>

      <Table
        dataSource={data}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          }
        }}
        className="[&_.ant-table-thead_th]:bg-gray-50 [&_.ant-table-thead_th]:text-gray-500 [&_.ant-table-thead_th]:font-semibold border border-gray-100 rounded-lg overflow-hidden"
      />
    </div>
  );
}

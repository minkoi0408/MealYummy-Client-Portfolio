import React, { useState, useEffect } from "react";
import { Table, Button, Input, Space, Tag, Modal, Form, message } from "antd";
import { Plus, Search, Edit2, Trash2, ShieldAlert } from "lucide-react";
import { categoryApi, type Category } from "../../../../apis/category.api";

export function CategoryManagementPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchCategories = async (page: number, size: number) => {
    setLoading(true);
    setError("");
    try {
      const response = await categoryApi.getAll(page - 1, size);
      if (response.data?.data) {
        setData(response.data.data.content || []);
        setTotal(response.data.data.page?.totalElements || response.data.data.totalElements || 0);
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Lỗi khi tải danh sách danh mục";
      message.error({ content: errorMsg, key: 'fetch-error' });
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const columns = [
    { title: 'Tên danh mục', dataIndex: 'name', key: 'name', width: '20%' },
    { title: 'Danh mục cha', dataIndex: 'parentName', key: 'parentName', width: '15%', render: (text: string) => text || '-' },
    { title: 'Mô tả', dataIndex: 'description', key: 'description' },
    { title: 'Ngày tạo', dataIndex: 'createdAt', key: 'createdAt', width: '15%' },
    {
      title: 'Trạng thái',
      dataIndex: 'active',
      key: 'active',
      width: '15%',
      render: (active: boolean) => (
        <Tag color={active ? 'success' : 'default'} className="px-3 py-1 rounded-full font-medium">
          {active ? 'Hoạt động' : 'Đã ẩn'}
        </Tag>
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: '15%',
      render: () => (
        <Space size="middle">
          <Button type="text" className="text-blue-600 hover:text-blue-800 hover:bg-blue-50" icon={<Edit2 className="w-4 h-4" />} />
          <Button type="text" danger className="hover:bg-red-50" icon={<Trash2 className="w-4 h-4" />} />
        </Space>
      ),
    },
  ];


  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <ShieldAlert className="w-16 h-16 mb-4 text-red-500" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">Không thể truy cập</h3>
        <p className="text-gray-500 text-center max-w-md mb-6">{error}</p>
        <Button onClick={() => { setError(""); fetchCategories(currentPage, pageSize); }} className="h-10 px-6 rounded-lg">
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Danh mục món ăn</h2>
          <p className="text-sm text-gray-500 mt-1">Quản lý các danh mục phân loại món ăn trong hệ thống.</p>
        </div>
        <Button
          type="primary"
          icon={<Plus className="w-4 h-4" />}
          className="bg-[#10B981] hover:bg-[#059669] h-10 px-6 rounded-lg font-medium shadow-md shadow-[#10B981]/20"
          onClick={() => setIsModalOpen(true)}
        >
          Thêm danh mục
        </Button>
      </div>

      <div className="flex mb-6">
        <Input
          placeholder="Tìm kiếm danh mục..."
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

      <Modal
        title="Thêm danh mục mới"
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        okButtonProps={{ className: "bg-[#10B981] hover:bg-[#059669]" }}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form layout="vertical" className="mt-4">
          <Form.Item label="Tên danh mục" required>
            <Input placeholder="VD: Ăn sáng" size="large" className="rounded-lg" />
          </Form.Item>
          <Form.Item label="Mô tả">
            <Input.TextArea placeholder="Mô tả ngắn gọn..." rows={4} className="rounded-lg" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

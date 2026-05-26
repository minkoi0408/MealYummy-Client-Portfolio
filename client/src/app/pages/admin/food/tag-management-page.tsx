import React, { useState, useEffect } from "react";
import { Table, Button, Input, Space, Tag, Modal, Form, message } from "antd";
import { Plus, Search, Edit2, Trash2, ShieldAlert } from "lucide-react";
import { tagApi, type Tag as TagType } from "../../../../apis/tag.api";

export function TagManagementPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState<TagType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchTags = async (page: number, size: number) => {
    setLoading(true);
    setError("");
    try {
      const response = await tagApi.getAll(page - 1, size);
      if (response.data?.data) {
        setData(response.data.data.content || []);
        setTotal(response.data.data.page?.totalElements || response.data.data.totalElements || 0);
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Lỗi khi tải danh sách thẻ";
      message.error({ content: errorMsg, key: 'fetch-error' });
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const columns = [
    { title: 'Tên thẻ (Tag)', dataIndex: 'name', key: 'name', width: '20%' },
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
        <Button onClick={() => { setError(""); fetchTags(currentPage, pageSize); }} className="h-10 px-6 rounded-lg">
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Thẻ món ăn (Tags)</h2>
          <p className="text-sm text-gray-500 mt-1">Quản lý các nhãn đặc tính của món ăn.</p>
        </div>
        <Button
          type="primary"
          icon={<Plus className="w-4 h-4" />}
          className="bg-[#10B981] hover:bg-[#059669] h-10 px-6 rounded-lg font-medium shadow-md shadow-[#10B981]/20"
          onClick={() => setIsModalOpen(true)}
        >
          Thêm thẻ
        </Button>
      </div>

      <div className="flex mb-6">
        <Input
          placeholder="Tìm kiếm thẻ..."
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
        title="Thêm thẻ mới"
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        okButtonProps={{ className: "bg-[#10B981] hover:bg-[#059669]" }}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form layout="vertical" className="mt-4">
          <Form.Item label="Tên thẻ" required>
            <Input placeholder="VD: Món nước" size="large" className="rounded-lg" />
          </Form.Item>
          <Form.Item label="Mô tả">
            <Input.TextArea placeholder="Mô tả ngắn gọn..." rows={4} className="rounded-lg" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

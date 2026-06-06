import React, { useState, useEffect } from "react";
import { Table, Button, Input, Space, Tag, Modal, Form, Select, InputNumber, message } from "antd";
import { Plus, Search, Edit2, Trash2, ShieldAlert } from "lucide-react";
import { mealApi } from "../../../../apis/meal.api";
import type { Meal } from "../../../../types/meal.type";

export function MealManagementPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchMeals = async (page: number, size: number) => {
    setLoading(true);
    setError("");
    try {
      const response = await mealApi.getAll(page - 1, size);
      if (response.data?.data) {
        setData(response.data.data.content || []);
        setTotal(response.data.data.page?.totalElements || response.data.data.totalElements || 0);
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Lỗi khi tải danh sách món ăn";
      message.error({ content: errorMsg, key: 'fetch-error' });
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const columns = [
    { title: 'Tên món ăn', dataIndex: 'name', key: 'name', width: '20%', render: (text: string) => <span className="font-semibold text-gray-800">{text}</span> },
    { title: 'Ngày tạo', dataIndex: 'createdAt', key: 'createdAt', width: '15%' },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price: { amount: number, currency: string }) => <span className="font-medium text-[#10B981]">{price?.amount?.toLocaleString()} {price?.currency || '₫'}</span>
    },
    {
      title: 'Danh mục (IDs)',
      dataIndex: 'categoryIds',
      key: 'categoryIds',
      render: (cats: string[]) => (
        <Space size={[0, 4]} wrap>
          {cats?.map((cat, i) => <Tag color="blue" key={i}>{cat}</Tag>)}
        </Space>
      )
    },
    {
      title: 'Thẻ (Tags IDs)',
      dataIndex: 'tagIds',
      key: 'tagIds',
      render: (tags: string[]) => (
        <Space size={[0, 4]} wrap>
          {tags?.map((tag, i) => <Tag color="orange" key={i}>{tag}</Tag>)}
        </Space>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'active',
      key: 'active',
      width: '10%',
      render: (active: boolean) => (
        <Tag color={active ? 'success' : 'default'} className="px-3 py-1 rounded-full font-medium border-0">
          {active ? 'Hiện' : 'Ẩn'}
        </Tag>
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: '10%',
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
        <Button onClick={() => { setError(""); fetchMeals(currentPage, pageSize); }} className="h-10 px-6 rounded-lg">
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Món ăn</h2>
          <p className="text-sm text-gray-500 mt-1">Quản lý danh sách món ăn, giá và thành phần nguyên liệu.</p>
        </div>
        <Button
          type="primary"
          icon={<Plus className="w-4 h-4" />}
          className="bg-[#10B981] hover:bg-[#059669] h-10 px-6 rounded-lg font-medium shadow-md shadow-[#10B981]/20"
          onClick={() => setIsModalOpen(true)}
        >
          Thêm món ăn
        </Button>
      </div>

      <div className="flex mb-6">
        <Input
          placeholder="Tìm kiếm món ăn..."
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
        title="Thêm món ăn mới"
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        width={700}
        okButtonProps={{ className: "bg-[#10B981] hover:bg-[#059669]" }}
        okText="Lưu món ăn"
        cancelText="Hủy"
      >
        <Form layout="vertical" className="mt-4 grid grid-cols-2 gap-x-6">
          <Form.Item label="Tên món ăn" required className="col-span-2">
            <Input placeholder="VD: Phở bò" size="large" className="rounded-lg" />
          </Form.Item>

          <Form.Item label="Giá (VNĐ)" required>
            <InputNumber
              className="w-full rounded-lg"
              size="large"
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              placeholder="0"
            />
          </Form.Item>

          <Form.Item label="Hình ảnh (URL)">
            <Input placeholder="https://..." size="large" className="rounded-lg" />
          </Form.Item>

          <Form.Item label="Danh mục" className="col-span-2">
            <Select mode="multiple" size="large" placeholder="Chọn danh mục" className="rounded-lg">
              <Select.Option value="cat1">Ăn sáng</Select.Option>
              <Select.Option value="cat2">Ăn trưa</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Thẻ (Tags)" className="col-span-2">
            <Select mode="multiple" size="large" placeholder="Chọn thẻ" className="rounded-lg">
              <Select.Option value="tag1">Bò</Select.Option>
              <Select.Option value="tag2">Gà</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Mô tả" className="col-span-2">
            <Input.TextArea placeholder="Mô tả món ăn..." rows={3} className="rounded-lg" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

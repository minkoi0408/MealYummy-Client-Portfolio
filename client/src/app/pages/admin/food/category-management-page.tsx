import React, { useState, useEffect } from "react";
import { Table, Button, Input, Space, Tag, Modal, Form, message, Upload, Select, Popconfirm } from "antd";
import { Plus, Search, Edit2, Trash2, ShieldAlert, Download, Upload as UploadIcon } from "lucide-react";
import { categoryApi, type Category } from "../../../../apis/category.api";
import { dataApi } from "../../../../apis/data.api";

export function CategoryManagementPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<{name: string, active: boolean, parentId?: string}>({name: "", active: true});
  const [bulkCategories, setBulkCategories] = useState<{ name: string, parentId?: string }[]>([{ name: '' }]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
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

  const fetchAllCategories = async () => {
    try {
      const response = await categoryApi.getAll(0, 1000);
      if (response.data?.data) {
        setAllCategories(response.data.data.content || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if ((isModalOpen || isEditModalOpen) && allCategories.length === 0) {
      fetchAllCategories();
    }
  }, [isModalOpen, isEditModalOpen]);

  const handleExport = async () => {
    try {
      await dataApi.exportCategories();
      message.success("Xuất dữ liệu thành công! File đã được lưu trên máy chủ (resources/json).");
    } catch (err) {
      message.error("Lỗi khi xuất dữ liệu.");
    }
  };

  const customUploadRequest = async (options: any) => {
    const { file, onSuccess, onError } = options;
    try {
      await dataApi.importCategories(file as File);
      message.success("Import dữ liệu thành công!");
      fetchCategories(currentPage, pageSize); // reload data
      onSuccess?.("ok");
    } catch (err: any) {
      message.error(err.response?.data?.message || "Lỗi khi import dữ liệu.");
      onError?.(err);
    }
  };

  const handleBulkSave = async () => {
    try {
      const validData = bulkCategories.filter(c => c.name.trim() !== '');
      if (validData.length === 0) {
        message.error("Vui lòng nhập ít nhất 1 danh mục hợp lệ.");
        return;
      }
      await dataApi.createNestedBulk(validData as any);
      message.success("Lưu dữ liệu thành công!");
      setIsModalOpen(false);
      setBulkCategories([{ name: '' }]);
      fetchCategories(currentPage, pageSize);
    } catch (err: any) {
      message.error(err.response?.data?.message || "Lỗi khi lưu dữ liệu.");
    }
  };

  const handleEditSave = async () => {
    if (!editingId) return;
    try {
      if (!editData.name.trim()) {
        message.error("Vui lòng nhập tên danh mục.");
        return;
      }
      await categoryApi.update(editingId, { 
        name: editData.name, 
        active: editData.active,
        parentId: editData.parentId
      });
      message.success("Cập nhật danh mục thành công!");
      setIsEditModalOpen(false);
      fetchCategories(currentPage, pageSize);
    } catch (err: any) {
      message.error(err.response?.data?.message || "Lỗi khi cập nhật.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await categoryApi.delete(id);
      message.success("Xóa danh mục thành công!");
      fetchCategories(currentPage, pageSize);
    } catch (err: any) {
      message.error(err.response?.data?.message || "Lỗi khi xóa.");
    }
  };

  const columns = [
    { title: 'Tên danh mục', dataIndex: 'name', key: 'name', width: '30%' },
    { title: 'Danh mục cha', dataIndex: 'parentName', key: 'parentName', width: '20%', render: (text: string) => text || '-' },
    { title: 'Ngày tạo', dataIndex: 'createdAt', key: 'createdAt', width: '20%' },
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
      render: (_, record: Category) => (
        <Space size="middle">
          <Button 
            type="text" 
            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50" 
            icon={<Edit2 className="w-4 h-4" />} 
            onClick={() => {
               setEditingId(record.id);
               setEditData({ 
                 name: record.name, 
                 active: record.active ?? true,
                 parentId: record.parentId
               });
               setIsEditModalOpen(true);
            }}
          />
          <Popconfirm
            title="Xóa danh mục này?"
            description="Bạn có chắc chắn muốn xóa danh mục này không? Hành động này không thể hoàn tác."
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" danger className="hover:bg-red-50" icon={<Trash2 className="w-4 h-4" />} />
          </Popconfirm>
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
        <div className="flex gap-2">
          <Button
            icon={<Download className="w-4 h-4" />}
            className="h-10 px-4 rounded-lg font-medium border-gray-200 text-gray-700 hover:text-blue-600 hover:border-blue-400"
            onClick={handleExport}
          >
            Export JSON
          </Button>
          <Upload customRequest={customUploadRequest} showUploadList={false} accept=".json">
            <Button
              icon={<UploadIcon className="w-4 h-4" />}
              className="h-10 px-4 rounded-lg font-medium border-gray-200 text-gray-700 hover:text-orange-600 hover:border-orange-400"
            >
              Import JSON
            </Button>
          </Upload>
          <Button
            type="primary"
            icon={<Plus className="w-4 h-4" />}
            className="bg-[#10B981] hover:bg-[#059669] h-10 px-6 rounded-lg font-medium shadow-md shadow-[#10B981]/20 ml-2"
            onClick={() => setIsModalOpen(true)}
          >
            Thêm danh mục
          </Button>
        </div>
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
        onOk={handleBulkSave}
        onCancel={() => {
          setIsModalOpen(false);
          setBulkCategories([{ name: '' }]);
        }}
        okButtonProps={{ className: "bg-[#10B981] hover:bg-[#059669]" }}
        okText="Lưu dữ liệu"
        cancelText="Hủy"
        width={700}
      >
        <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto p-1">
          {bulkCategories.map((item, index) => (
            <div key={index} className="flex gap-4 items-end border p-4 rounded-lg bg-gray-50">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên danh mục <span className="text-red-500">*</span></label>
                <Input
                  placeholder="VD: Đồ uống"
                  value={item.name}
                  onChange={(e) => {
                    const newArr = [...bulkCategories];
                    newArr[index].name = e.target.value;
                    setBulkCategories(newArr);
                  }}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục cha</label>
                <Select
                  className="w-full"
                  placeholder="Chọn danh mục cha"
                  allowClear
                  showSearch
                  optionFilterProp="label"
                  value={item.parentId}
                  onChange={(val) => {
                    const newArr = [...bulkCategories];
                    newArr[index].parentId = val;
                    setBulkCategories(newArr);
                  }}
                  options={allCategories.map(cat => ({ label: cat.name, value: cat.id }))}
                />
              </div>
              {bulkCategories.length > 1 && (
                <Button
                  danger
                  icon={<Trash2 className="w-4 h-4" />}
                  onClick={() => {
                    const newArr = bulkCategories.filter((_, i) => i !== index);
                    setBulkCategories(newArr);
                  }}
                />
              )}
            </div>
          ))}
          <Button
            type="dashed"
            className="w-full h-10 border-blue-400 text-blue-500 hover:text-blue-600 hover:border-blue-500 bg-blue-50 hover:bg-blue-100 mt-4"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setBulkCategories([...bulkCategories, { name: '' }])}
          >
            Thêm ô nhập
          </Button>
        </div>
      </Modal>

      <Modal
        title="Chỉnh sửa danh mục"
        open={isEditModalOpen}
        onOk={handleEditSave}
        onCancel={() => setIsEditModalOpen(false)}
        okButtonProps={{ className: "bg-[#10B981] hover:bg-[#059669]" }}
        okText="Lưu thay đổi"
        cancelText="Hủy"
      >
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên danh mục <span className="text-red-500">*</span></label>
            <Input 
              placeholder="VD: Đồ uống" 
              value={editData.name}
              onChange={(e) => setEditData({...editData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục cha</label>
            <Select
              className="w-full"
              placeholder="Chọn danh mục cha"
              allowClear
              showSearch
              optionFilterProp="label"
              value={editData.parentId}
              onChange={(val) => setEditData({...editData, parentId: val})}
              options={allCategories.map(cat => ({ label: cat.name, value: cat.id }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái hoạt động</label>
            <Select 
              className="w-full"
              value={editData.active}
              onChange={(val) => setEditData({...editData, active: val})}
              options={[
                { label: 'Hoạt động', value: true },
                { label: 'Đã ẩn', value: false }
              ]}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

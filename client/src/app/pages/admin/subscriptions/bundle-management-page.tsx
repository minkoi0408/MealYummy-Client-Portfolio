import React, { useState, useEffect } from "react";
import { Table, Button, Input, Space, Tag, Modal, Form, InputNumber, Switch, message, Popover, List } from "antd";
import { Plus, Search, Edit2, ShieldCheck, Zap, ShieldAlert } from "lucide-react";
import { bundleApi } from "../../../../apis/bundle.api";
import type { Bundle } from "../../../../types/bundle.types";

export function BundleManagementPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBundle, setEditingBundle] = useState<Bundle | null>(null);
  const [form] = Form.useForm();
  const [data, setData] = useState<Bundle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchBundles = async (page: number, size: number) => {
    setLoading(true);
    setError("");
    try {
      const response = await bundleApi.getAll(page - 1, size);
      if (response.data?.data) {
        setData(response.data.data.content || []);
        setTotal(response.data.data.page?.totalElements || response.data.data.totalElements || 0);
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Lỗi khi tải danh sách gói dịch vụ";
      message.error({ content: errorMsg, key: 'fetch-error' });
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      
      // Transform active to isActive for backend parsing
      const payload = {
        ...values,
        isActive: values.active
      };
      delete payload.active;

      setLoading(true);
      if (editingBundle?.id) {
        await bundleApi.update(editingBundle.id, payload);
        message.success('Cập nhật gói thành công');
      } else {
        await bundleApi.create(payload);
        message.success('Tạo gói mới thành công');
      }
      setIsModalOpen(false);
      fetchBundles(currentPage, pageSize);
    } catch (error: any) {
      if (error.errorFields) return; // Validation failed
      message.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBundles(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const columns = [
    {
      title: 'Tên gói',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Bundle) => (
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-500" />
          <span className="font-semibold text-gray-800">{text}</span>
        </div>
      )
    },
    {
      title: 'Các gói thời hạn',
      key: 'durations',
      render: (text: string, record: Bundle) => {
        const content = (
          <List
            size="small"
            dataSource={record.durations || []}
            renderItem={d => (
              <List.Item>
                <div className="flex justify-between w-full gap-4">
                  <span className="font-semibold text-gray-700">{d.durationCode.replace('_', ' ')} ({d.durationInDays} ngày)</span>
                  <span className="text-[#10B981] font-bold">{d.price?.toLocaleString()} ₫</span>
                </div>
              </List.Item>
            )}
            className="min-w-[200px]"
          />
        );
        return (
          <Popover content={content} title="Danh sách thời hạn" trigger="click" placement="bottom">
            <Button size="small" className="text-blue-600 border-blue-200 hover:bg-blue-50">
              Xem chi tiết ({record.durations?.length || 0})
            </Button>
          </Popover>
        );
      }
    },
    { 
      title: 'Đặc quyền', 
      key: 'features', 
      render: (text: string, record: Bundle) => {
        const content = (
          <List
            size="small"
            dataSource={record.features || []}
            renderItem={(item, index) => (
              <List.Item>
                <span className="text-gray-700">{index + 1}. {item}</span>
              </List.Item>
            )}
            className="min-w-[250px] max-h-[300px] overflow-y-auto"
          />
        );
        return (
          <Popover content={content} title="Các tính năng đặc quyền" trigger="click" placement="bottom">
            <Button size="small" className="text-purple-600 border-purple-200 hover:bg-purple-50">
               Xem {record.features?.length || 0} tính năng
            </Button>
          </Popover>
        );
      }
    },
    { title: 'Mô tả', dataIndex: 'description', key: 'description', width: '20%' },
    {
      title: 'Trạng thái',
      dataIndex: 'active',
      key: 'active',
      render: (active: boolean) => (
        <Tag color={active ? 'success' : 'default'} className="px-3 py-1 rounded-full font-medium">
          {active ? 'Đang bán' : 'Ngừng bán'}
        </Tag>
      )
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => <span className="text-gray-500">{new Date(text).toLocaleDateString('vi-VN')}</span>
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record: Bundle) => (
        <Space size="middle">
          <Button 
            type="text" 
            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50" 
            icon={<Edit2 className="w-4 h-4" />} 
            onClick={() => {
              setEditingBundle(record);
              form.setFieldsValue(record);
              setIsModalOpen(true);
            }}
          />
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
        <Button onClick={() => { setError(""); fetchBundles(currentPage, pageSize); }} className="h-10 px-6 rounded-lg">
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Gói Dịch Vụ (Bundles)</h2>
          <p className="text-sm text-gray-500 mt-1">Quản lý các gói đăng ký trả phí cho người dùng.</p>
        </div>
        <Button
          type="primary"
          icon={<Plus className="w-4 h-4" />}
          className="bg-[#10B981] hover:bg-[#059669] h-10 px-6 rounded-lg font-medium shadow-md shadow-[#10B981]/20"
          onClick={() => {
            setEditingBundle(null);
            form.resetFields();
            setIsModalOpen(true);
          }}
        >
          Tạo gói mới
        </Button>
      </div>

      <div className="flex mb-6">
        <Input
          placeholder="Tìm kiếm gói..."
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
        title={editingBundle ? "Cập nhật gói dịch vụ" : "Tạo gói dịch vụ mới"}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
        width={700}
        confirmLoading={loading}
        okButtonProps={{ className: "bg-[#10B981] hover:bg-[#059669]" }}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" className="mt-4" initialValues={{ active: true, durations: [{}], features: [''] }}>
          <Form.Item label="Tên gói" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên gói' }]}>
            <Input placeholder="VD: Gói Premium" size="large" className="rounded-lg" />
          </Form.Item>

          <Form.Item label="Mô tả" name="description">
            <Input.TextArea placeholder="Mô tả ngắn gọn..." rows={2} className="rounded-lg" />
          </Form.Item>

          <div className="mb-4 font-semibold text-gray-700">Các gói thời hạn</div>
          <Form.List name="durations">
            {(fields, { add, remove }) => (
              <div className="flex flex-col gap-2 mb-4">
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} className="flex gap-2 items-start">
                    <Form.Item {...restField} name={[name, 'durationCode']} rules={[{ required: true, message: 'Thiếu mã' }]} className="mb-0 flex-1">
                      <Input placeholder="Mã (VD: 1_MONTH)" />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, 'durationInDays']} rules={[{ required: true, message: 'Thiếu số ngày' }]} className="mb-0 flex-1">
                      <InputNumber placeholder="Số ngày" className="w-full" />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, 'price']} rules={[{ required: true, message: 'Thiếu giá' }]} className="mb-0 flex-1">
                      <InputNumber 
                        placeholder="Giá (VNĐ)" 
                        className="w-full" 
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} 
                        parser={(value) => value!.replace(/\$\s?|(,*)/g, '') as unknown as number}
                      />
                    </Form.Item>
                    <Button danger onClick={() => remove(name)} icon={<Zap className="w-4 h-4" />} />
                  </div>
                ))}
                <Button type="dashed" onClick={() => add()} block icon={<Plus className="w-4 h-4" />}>
                  Thêm thời hạn
                </Button>
              </div>
            )}
          </Form.List>

          <div className="mb-4 font-semibold text-gray-700">Các tính năng (Đặc quyền)</div>
          <Form.List name="features">
            {(fields, { add, remove }) => (
              <div className="flex flex-col gap-2 mb-4">
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} className="flex gap-2 items-start">
                    <Form.Item {...restField} name={[name]} rules={[{ required: true, message: 'Nhập tính năng' }]} className="mb-0 flex-1">
                      <Input placeholder="Tính năng..." />
                    </Form.Item>
                    <Button danger onClick={() => remove(name)} icon={<Zap className="w-4 h-4" />} />
                  </div>
                ))}
                <Button type="dashed" onClick={() => add()} block icon={<Plus className="w-4 h-4" />}>
                  Thêm tính năng
                </Button>
              </div>
            )}
          </Form.List>

          <Form.Item label="Kích hoạt ngay" name="active" valuePropName="checked">
            <Switch className="bg-gray-300 [&.ant-switch-checked]:bg-[#10B981]" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

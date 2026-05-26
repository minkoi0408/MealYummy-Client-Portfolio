import React, { useState, useEffect } from "react";
import { Table, Input, Tag, message, Button } from "antd";
import { Search, ShieldAlert } from "lucide-react";
import { subscriptionApi, type UserSubscription } from "../../../../apis/subscription.api";

export function UserSubscriptionPage() {
  const [data, setData] = useState<UserSubscription[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchSubscriptions = async (page: number, size: number) => {
    setLoading(true);
    setError("");
    try {
      const response = await subscriptionApi.getAll(page - 1, size);
      if (response.data?.data) {
        setData(response.data.data.content || []);
        setTotal(response.data.data.page?.totalElements || response.data.data.totalElements || 0);
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Lỗi khi tải danh sách đăng ký";
      message.error({ content: errorMsg, key: 'fetch-error' });
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const columns = [
    { title: 'Tài khoản (ID)', dataIndex: 'userId', key: 'userId', render: (text: string) => <span className="font-medium text-gray-800">{text}</span> },
    { title: 'Gói đã đăng ký (ID)', dataIndex: 'bundleId', key: 'bundleId', render: (text: string) => <Tag color="blue" className="font-medium">{text}</Tag> },
    { title: 'Ngày bắt đầu', dataIndex: 'startDate', key: 'startDate', className: "text-gray-500" },
    { title: 'Ngày kết thúc', dataIndex: 'endDate', key: 'endDate', render: (text: string) => <span className="font-medium">{text}</span> },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'ACTIVE' ? 'success' : 'error'} className="px-3 py-1 rounded-full font-medium">
          {status === 'ACTIVE' ? 'Đang hiệu lực' : 'Đã hết hạn'}
        </Tag>
      )
    },
  ];


  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <ShieldAlert className="w-16 h-16 mb-4 text-red-500" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">Không thể truy cập</h3>
        <p className="text-gray-500 text-center max-w-md mb-6">{error}</p>
        <Button onClick={() => { setError(""); fetchSubscriptions(currentPage, pageSize); }} className="h-10 px-6 rounded-lg">
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Đăng ký của User</h2>
          <p className="text-sm text-gray-500 mt-1">Quản lý và xem hạn sử dụng gói dịch vụ của người dùng.</p>
        </div>
      </div>

      <div className="flex mb-6">
        <Input
          placeholder="Tìm kiếm..."
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

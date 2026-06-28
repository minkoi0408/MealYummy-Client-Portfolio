import React, { useState, useEffect } from "react";
import { Table, Input, Tag, message, Button } from "antd";
import { Search, ExternalLink, ShieldAlert } from "lucide-react";
import { paymentApi, type PaymentHistory } from "../../../../apis/payment.api";

export function PaymentHistoryPage() {
  const [data, setData] = useState<PaymentHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchPayments = async (page: number, size: number) => {
    setLoading(true);
    setError("");
    try {
      const response = await paymentApi.getAll(page - 1, size);
      if (response.data?.data) {
        setData(response.data.data.content || []);
        setTotal(response.data.data.page?.totalElements || response.data.data.totalElements || 0);
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Lỗi khi tải danh sách giao dịch";
      message.error({ content: errorMsg, key: 'fetch-error' });
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const columns = [
    {
      title: 'Mã GD (TxID)',
      dataIndex: 'txId',
      key: 'txId',
      render: (id: string) => <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{id}</span>
    },
    { title: 'Tài khoản (ID)', dataIndex: 'userId', key: 'userId', render: (text: string) => <span className="font-medium text-gray-700">{text}</span> },
    { title: 'Gói (ID)', dataIndex: 'bundleId', key: 'bundleId' },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => <span className="font-bold">{amount?.toLocaleString()} ₫</span>
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'default';
        let text = 'Khởi tạo';
        if (status === 'SUCCESS') { color = 'success'; text = 'Thành công'; }
        if (status === 'PENDING') { color = 'warning'; text = 'Đang xử lý'; }
        if (status === 'FAILED') { color = 'error'; text = 'Thất bại'; }

        return <Tag color={color} className="font-medium">{text}</Tag>
      }
    },
    { title: 'Thời gian', dataIndex: 'createdAt', key: 'createdAt', className: "text-gray-500" },
    {
      title: 'Chi tiết',
      key: 'action',
      render: () => (
        <button className="text-gray-400 hover:text-blue-500 transition-colors">
          <ExternalLink className="w-4 h-4" />
        </button>
      ),
    },
  ];


  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <ShieldAlert className="w-16 h-16 mb-4 text-red-500" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">Không thể truy cập</h3>
        <p className="text-gray-500 text-center max-w-md mb-6">{error}</p>
        <Button onClick={() => { setError(""); fetchPayments(currentPage, pageSize); }} className="h-10 px-6 rounded-lg">
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Lịch sử thanh toán</h2>
          <p className="text-sm text-gray-500 mt-1">Theo dõi các giao dịch mua gói dịch vụ của người dùng.</p>
        </div>
      </div>

      <div className="flex mb-6">
        <Input
          placeholder="Tìm kiếm theo mã giao dịch..."
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

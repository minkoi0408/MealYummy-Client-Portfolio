import React, { useState, useEffect } from "react";
import { Table, Input, Tag, message, Button, Modal } from "antd";
import { Search, ExternalLink, ShieldAlert, ReceiptText, Calendar, Clock, CreditCard, User, Package, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { paymentApi, type PaymentHistory } from "../../../../apis/payment.api";

export function PaymentHistoryPage() {
  const [data, setData] = useState<PaymentHistory[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<PaymentHistory | null>(null);
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
    { 
      title: 'Tài khoản', 
      dataIndex: 'username', 
      key: 'userId', 
      render: (text: string, record: PaymentHistory) => <span className="font-medium text-gray-700">{text || record.userId}</span> 
    },
    { 
      title: 'Gói dịch vụ', 
      dataIndex: 'bundleName', 
      key: 'bundleId',
      render: (text: string, record: PaymentHistory) => <span className="font-medium text-[#10B981]">{text || record.bundleId}</span>
    },
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
    { 
      title: 'Thời gian', 
      dataIndex: 'createdAt', 
      key: 'createdAt', 
      className: "text-gray-500",
      render: (createdAt: string) => {
        if (!createdAt) return "";
        const date = new Date(createdAt);
        return `${date.toLocaleDateString('vi-VN')} ${date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;
      }
    },
    {
      title: 'Chi tiết',
      key: 'action',
      render: (_, record: PaymentHistory) => (
        <button 
          className="text-gray-400 hover:text-blue-500 transition-colors"
          onClick={() => setSelectedPayment(record)}
        >
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

      <Modal
        title={
          <div className="flex items-center gap-2">
            <div className="w-2 h-6 bg-[#10B981] rounded-full"></div>
            <span className="text-lg font-bold">Chi tiết giao dịch</span>
          </div>
        }
        open={!!selectedPayment}
        onCancel={() => setSelectedPayment(null)}
        footer={null}
        width={700}
        centered
        className="[&_.ant-modal-content]:rounded-2xl [&_.ant-modal-content]:p-0 [&_.ant-modal-header]:px-6 [&_.ant-modal-header]:pt-6 [&_.ant-modal-header]:pb-4 [&_.ant-modal-header]:border-b [&_.ant-modal-header]:border-gray-100 [&_.ant-modal-body]:p-6 [&_.ant-modal-close]:top-6"
      >
        {selectedPayment && (
          <div className="flex flex-col gap-6">
            {/* Header / Amount */}
            <div className="bg-gradient-to-br from-[#10B981]/10 to-[#10B981]/5 rounded-2xl p-6 flex flex-col items-center justify-center border border-[#10B981]/20">
              <div className="bg-white p-3 rounded-full shadow-sm mb-3">
                <ReceiptText className="w-8 h-8 text-[#10B981]" />
              </div>
              <h3 className="text-gray-500 text-sm mb-1 font-medium">Tổng thanh toán</h3>
              <div className="text-4xl font-black text-gray-800 tracking-tight">
                {selectedPayment.amount?.toLocaleString()} <span className="text-xl text-gray-400 font-bold">VNĐ</span>
              </div>
              <div className="mt-4">
                {selectedPayment.status === 'SUCCESS' && <div className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 shadow-sm shadow-emerald-100"><CheckCircle2 className="w-4 h-4"/> Giao dịch Thành công</div>}
                {selectedPayment.status === 'PENDING' && <div className="bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 shadow-sm shadow-amber-100"><AlertCircle className="w-4 h-4"/> Đang xử lý</div>}
                {selectedPayment.status === 'FAILED' && <div className="bg-rose-100 text-rose-700 px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 shadow-sm shadow-rose-100"><XCircle className="w-4 h-4"/> Giao dịch Thất bại</div>}
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="bg-gray-50/50 rounded-xl p-5 border border-gray-100">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-5 flex items-center gap-2"><User className="w-4 h-4 text-gray-400"/> Thông tin dịch vụ</h4>
                
                <div className="space-y-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Khách hàng</div>
                    <div className="font-semibold text-gray-800 text-base">{selectedPayment.username || selectedPayment.userId}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Gói đăng ký</div>
                    <div className="font-bold text-[#10B981] flex items-center gap-1.5 text-base">
                      <Package className="w-4 h-4"/> {selectedPayment.bundleName || selectedPayment.bundleId}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Thời hạn</div>
                    <div className="font-semibold text-gray-700 bg-gray-200/50 inline-block px-3 py-1 rounded-md text-sm">{selectedPayment.durationCode?.replace('_', ' ') || 'N/A'}</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50/50 rounded-xl p-5 border border-gray-100">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-5 flex items-center gap-2"><CreditCard className="w-4 h-4 text-gray-400"/> Chi tiết giao dịch</h4>
                
                <div className="space-y-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Mã tham chiếu (TxID)</div>
                    <div className="font-mono text-xs bg-white border border-gray-200 p-2 rounded-lg text-gray-600 break-all shadow-sm">
                      {selectedPayment.txId}
                    </div>
                  </div>
                  <div className="flex gap-4 bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                    <div className="flex-1 border-r border-gray-100 pr-2">
                      <div className="text-[11px] text-gray-400 mb-1 flex items-center gap-1 uppercase font-semibold tracking-wider"><Calendar className="w-3 h-3"/> Ngày tạo</div>
                      <div className="font-bold text-sm text-gray-700">{new Date(selectedPayment.createdAt).toLocaleDateString('vi-VN')}</div>
                      <div className="text-xs text-gray-500 font-medium">{new Date(selectedPayment.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                    <div className="flex-1 pl-2">
                      <div className="text-[11px] text-gray-400 mb-1 flex items-center gap-1 uppercase font-semibold tracking-wider"><Clock className="w-3 h-3"/> Cập nhật</div>
                      <div className="font-bold text-sm text-gray-700">{new Date(selectedPayment.updatedAt).toLocaleDateString('vi-VN')}</div>
                      <div className="text-xs text-gray-500 font-medium">{new Date(selectedPayment.updatedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
            
            <div className="flex justify-end pt-2">
              <Button size="large" className="rounded-xl px-8" onClick={() => setSelectedPayment(null)}>
                Đóng
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { Search, Loader2, ArrowLeft, ArrowRight, ShieldAlert, Monitor, Globe, Activity } from "lucide-react";
import { accessLogApi, type AccessLog } from "../../../apis/access-log.api";

export function AccessLogsPage() {
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchLogs();
  }, [page, debouncedSearch]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await accessLogApi.getLogs(page, 15, debouncedSearch);
      if (res.data.data) {
        setLogs(res.data.data.content);
        setTotalPages(res.data.data.totalPages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "bg-green-100 text-green-700";
    if (status >= 400 && status < 500) return "bg-orange-100 text-orange-700";
    if (status >= 500) return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  const getMethodColor = (method: string) => {
    switch(method) {
      case 'GET': return "text-blue-600 bg-blue-50";
      case 'POST': return "text-green-600 bg-green-50";
      case 'PUT': return "text-orange-600 bg-orange-50";
      case 'DELETE': return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString('vi-VN');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Nhật ký Truy cập</h2>
          <p className="text-muted-foreground text-gray-500">
            Theo dõi, giám sát các API request và hoạt động của người dùng
          </p>
        </div>
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Tìm theo Username hoặc IP..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg w-full sm:w-64 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50/80 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 font-medium">Thời gian</th>
                <th className="px-4 py-3 font-medium">User / IP</th>
                <th className="px-4 py-3 font-medium">Request</th>
                <th className="px-4 py-3 font-medium">Status / Time</th>
                <th className="px-4 py-3 font-medium hidden md:table-cell">Client</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading && logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-emerald-500 mx-auto" />
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    Không tìm thấy dữ liệu truy cập nào
                  </td>
                </tr>
              ) : logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-600 font-medium whitespace-nowrap">
                    {formatDate(log.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900">{log.username !== 'ANONYMOUS' ? log.username : 'Khách vãng lai'}</span>
                      <span className="text-xs text-gray-500 font-mono mt-0.5 flex items-center gap-1">
                        <Globe className="w-3 h-3" /> {log.ipAddress}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 max-w-xs">
                    <div className="flex items-center gap-2">
                      <span className={"px-2 py-0.5 rounded text-[10px] font-bold " + getMethodColor(log.method)}>
                        {log.method}
                      </span>
                      <span className="truncate text-gray-700 font-mono text-xs" title={log.endpoint}>
                        {log.endpoint}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col items-start gap-1">
                      <span className={"px-2 py-0.5 rounded-full text-xs font-bold " + getStatusColor(log.status)}>
                        {log.status}
                      </span>
                      <span className="text-[10px] text-gray-500 flex items-center gap-1">
                        <Activity className="w-3 h-3" /> {log.durationMs} ms
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell max-w-[200px]">
                    <div className="text-xs text-gray-500 truncate" title={log.userAgent}>
                      {log.userAgent}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
            <span className="text-sm text-gray-500">
              Trang <span className="font-medium text-gray-900">{page + 1}</span> / <span className="font-medium text-gray-900">{totalPages}</span>
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="p-1 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1}
                className="p-1 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
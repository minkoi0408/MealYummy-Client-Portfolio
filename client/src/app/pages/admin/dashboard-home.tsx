import React, { useEffect, useState } from "react";
import { Users, Utensils, CreditCard, Package, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { analyticsApi } from "../../../apis/analytics.api";
import type { DashboardOverviewDTO } from "../../../apis/analytics.api";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function DashboardHomePage() {
  const [data, setData] = useState<DashboardOverviewDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsApi.getOverview()
      .then(res => {
        if (res.data.data) setData(res.data.data);
      })
      .catch(err => console.error("Failed to load analytics", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (!data) return <div className="text-gray-500 text-center py-8">Không thể tải dữ liệu</div>;

  const stats = [
    {
      title: "Tổng Người Dùng",
      value: data.totalUsers.toLocaleString(),
      change: data.userChangeStr,
      trend: data.userChangeStr.startsWith("-") ? "down" : "up",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Tổng Doanh Thu",
      value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data.totalRevenue),
      change: data.revenueChangeStr,
      trend: data.revenueChangeStr.startsWith("-") ? "down" : "up",
      icon: CreditCard,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Gói Dịch Vụ Đang Kích Hoạt",
      value: data.activeSubscriptions.toLocaleString(),
      change: data.subscriptionChangeStr,
      trend: data.subscriptionChangeStr.startsWith("-") ? "down" : "up",
      icon: Package,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      title: "Món Ăn Hệ Thống",
      value: data.totalMeals.toLocaleString(),
      change: data.mealChangeStr,
      trend: data.mealChangeStr.startsWith("-") ? "down" : "up",
      icon: Utensils,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Tổng quan</h2>
        <p className="text-muted-foreground text-gray-500">
          Xem thông tin chung về hoạt động của MealYummy theo thời gian thực
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown;
          const trendColor = stat.trend === "up" ? "text-green-600" : "text-red-600";

          return (
            <div key={idx} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium text-gray-500">
                  {stat.title}
                </h3>
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </div>
              <div className="flex flex-col gap-1 mt-2">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendIcon className={`w-3 h-3 mr-1 ${trendColor}`} />
                  <span className={`${trendColor} font-medium`}>{stat.change}</span>
                  <span className="text-gray-400 ml-1">so với tháng trước</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-6">
        <div className="col-span-4 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="font-semibold text-lg">Biểu đồ doanh thu</h3>
            <p className="text-sm text-gray-500">Doanh thu trong 6 tháng qua (VNĐ)</p>
          </div>
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.revenueChart}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#6B7280', fontSize: 12}}
                  tickFormatter={(val) => `${val / 1000000}M`}
                />
                <Tooltip 
                  formatter={(value: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} 
                  activeDot={{ r: 6, fill: '#10B981', stroke: '#fff', strokeWidth: 2 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="col-span-3 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="font-semibold text-lg">Đăng ký mới gần đây</h3>
            <p className="text-sm text-gray-500">Danh sách user vừa nâng cấp tài khoản</p>
          </div>
          <div className="space-y-4 mt-6 h-[300px] overflow-auto pr-2">
            {data.recentTransactions.length === 0 ? (
              <p className="text-gray-400 text-center py-8">Chưa có giao dịch nào</p>
            ) : data.recentTransactions.map((tx, i) => (
              <div key={i} className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-700 overflow-hidden shrink-0">
                  {tx.avatarUrl ? (
                    <img src={tx.avatarUrl} alt={tx.username} className="w-full h-full object-cover" />
                  ) : tx.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{tx.username}</p>
                  <p className="text-xs text-gray-500 truncate">{tx.email}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{tx.date}</p>
                </div>
                <div className="text-sm font-bold text-[#10B981] whitespace-nowrap">
                  +{new Intl.NumberFormat('vi-VN').format(tx.amount)}₫
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

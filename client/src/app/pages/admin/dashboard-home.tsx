import React, { useEffect, useState } from "react";
import { Users, Utensils, CreditCard, Package, TrendingUp, TrendingDown, Loader2, Activity } from "lucide-react";
import { analyticsApi } from "../../../apis/analytics.api";
import type { DashboardOverviewDTO } from "../../../apis/analytics.api";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function DashboardHomePage() {
  const [data, setData] = useState<DashboardOverviewDTO | null>(null);
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      analyticsApi.getOverview(),
      analyticsApi.getActiveUsers().catch(() => ({ data: { data: [] } }))
    ])
      .then(([overviewRes, activeUsersRes]) => {
        if (overviewRes.data.data) setData(overviewRes.data.data);
        if (activeUsersRes.data.data) setActiveUsers(activeUsersRes.data.data);
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
      title: "Đang Hoạt Động (Online)",
      value: activeUsers.length.toLocaleString(),
      change: "Người dùng có phiên hiện tại",
      trend: "up",
      icon: Activity,
      color: "text-rose-600",
      bg: "bg-rose-100",
    },
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
      title: "Doanh Thu Tháng Này",
      value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data.thisMonthRevenue),
      change: "Tổng: " + new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data.totalRevenue),
      trend: "up",
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
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
                <div className={"p-2 rounded-lg " + stat.bg}>
                  <Icon className={"w-4 h-4 " + stat.color} />
                </div>
              </div>
              <div className="flex flex-col gap-1 mt-2">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex flex-col text-xs text-muted-foreground mt-1">
                  {stat.title === "Doanh Thu Tháng Này" || stat.title === "Đang Hoạt Động (Online)" ? (
                    <span className="font-medium text-gray-500">{stat.change}</span>
                  ) : (
                    <div className="flex items-center">
                      <TrendIcon className={"w-3 h-3 mr-1 " + trendColor} />
                      <span className={trendColor + " font-medium"}>{stat.change}</span>
                      <span className="text-gray-400 ml-1">so với tháng trước</span>
                    </div>
                  )}
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
                  tickFormatter={(val) => val / 1000000 + "M"}
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
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">User Đang Online</h3>
              <p className="text-sm text-gray-500">Danh sách người dùng đang hoạt động ({activeUsers.length})</p>
            </div>
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </div>
          </div>
          <div className="space-y-4 mt-6 h-[300px] overflow-auto pr-2">
            {activeUsers.length === 0 ? (
              <p className="text-gray-400 text-center py-8">Không có user nào đang online</p>
            ) : activeUsers.map((username, i) => (
              <div key={i} className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center font-bold text-rose-700 overflow-hidden shrink-0">
                  {username.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{username}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Session Active</p>
                </div>
                <div className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-full whitespace-nowrap">
                  Online
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
import React from "react";
import { Users, Utensils, CreditCard, Package, TrendingUp, TrendingDown } from "lucide-react";

export function DashboardHomePage() {
  const stats = [
    {
      title: "Tổng Người Dùng",
      value: "1,245",
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Tổng Doanh Thu",
      value: "45.2M ₫",
      change: "+8.4%",
      trend: "up",
      icon: CreditCard,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Gói Dịch Vụ Đang Kích Hoạt",
      value: "342",
      change: "-2%",
      trend: "down",
      icon: Package,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      title: "Món Ăn",
      value: "156",
      change: "+24",
      trend: "up",
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
          Xem thông tin chung về hoạt động của MealYummy
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
            <p className="text-sm text-gray-500">Doanh thu trong 6 tháng qua</p>
          </div>
          <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-gray-100 rounded-lg">
            <p className="text-gray-400 font-medium">Khu vực hiển thị biểu đồ</p>
          </div>
        </div>
        <div className="col-span-3 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="font-semibold text-lg">Đăng ký mới gần đây</h3>
            <p className="text-sm text-gray-500">Danh sách user vừa mua gói</p>
          </div>
          <div className="space-y-4 mt-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-semibold text-gray-500">
                  U{i}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium leading-none">user{i}@example.com</p>
                  <p className="text-xs text-gray-500 mt-1">Đã mua Gói Premium</p>
                </div>
                <div className="text-sm font-medium text-[#10B981]">
                  +250.000₫
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

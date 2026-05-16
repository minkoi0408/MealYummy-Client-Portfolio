import { Link, useLocation } from "react-router-dom";
import { Lock } from "lucide-react";

export function RequireLoginPage() {
  const location = useLocation();

  return (
    <div className="min-h-screen w-full bg-stitch-background flex items-center justify-center p-6 text-stitch-on-background font-lexend relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-stitch-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-stitch-secondary/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-md w-full text-center">
        {/* Lock Icon */}
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-8 shadow-lg"
          style={{
            background: "linear-gradient(135deg, rgba(26,31,46,0.9), rgba(15,17,23,0.9))",
            border: "1px solid rgba(163,230,53,0.2)",
            boxShadow: "0 0 40px rgba(163,230,53,0.15)",
          }}
        >
          <Lock className="w-12 h-12 text-stitch-primary" />
        </div>

        {/* Text Content */}
        <h1 className="text-3xl font-black text-white mb-4">
          Cần Đăng nhập để sử dụng chức năng này
        </h1>
        <p className="text-slate-400 text-sm mb-8 leading-relaxed">
          Nội dung này được bảo vệ. Vui lòng đăng nhập hoặc tạo tài khoản để tiếp tục trải nghiệm toàn bộ các tính năng cao cấp của MealYummy.
        </p>

        {/* CTA Button */}
        <Link 
          to="/login"
          state={{ from: location }}
          className="inline-flex items-center justify-center h-14 px-10 gap-2 rounded-xl font-bold text-gray-900 transition-all hover:scale-105"
          style={{
            background: "linear-gradient(135deg, #a3e635, #4ade80)",
            boxShadow: "0 0 24px rgba(163,230,53,0.4)",
          }}
        >
          Đăng nhập ngay
        </Link>
      </div>
    </div>
  );
}

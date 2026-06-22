import { Link } from "react-router-dom";
import { Crown, Lock, Sparkles, Route, Dumbbell, Calendar, ArrowRight, Check } from "lucide-react";

export function RequirePremiumPage() {
  const FEATURES = [
    { icon: <Route className="w-4 h-4" />, label: "Lộ trình cá nhân hoá AI" },
    { icon: <Dumbbell className="w-4 h-4" />, label: "Kế hoạch tập gym tùy chỉnh" },
    { icon: <Calendar className="w-4 h-4" />, label: "Thực đơn dinh dưỡng hàng ngày" },
    { icon: <Sparkles className="w-4 h-4" />, label: "Lượt AI không giới hạn" },
  ];

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-6 relative overflow-hidden"
      style={{ background: "#0f1117" }}
    >
      {/* Ambient glows */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(163,230,53,0.12) 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(74,222,128,0.07) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-lg w-full">
        {/* Lock badge */}
        <div className="flex justify-center mb-8">
          <div
            className="relative inline-flex items-center justify-center w-28 h-28 rounded-full"
            style={{
              background: "linear-gradient(135deg, rgba(26,31,46,0.95), rgba(15,17,23,0.95))",
              border: "1px solid rgba(163,230,53,0.25)",
              boxShadow: "0 0 60px rgba(163,230,53,0.15), 0 0 20px rgba(163,230,53,0.08)",
            }}
          >
            <Lock className="w-12 h-12" style={{ color: "#a3e635" }} />
            {/* Crown overlay */}
            <div
              className="absolute -top-2 -right-2 w-9 h-9 rounded-full flex items-center justify-center shadow-lg"
              style={{ background: "linear-gradient(135deg, #a3e635, #4ade80)" }}
            >
              <Crown className="w-4 h-4 text-gray-900" />
            </div>
          </div>
        </div>

        {/* Main card */}
        <div
          className="rounded-3xl p-8 text-center"
          style={{
            background: "rgba(26,31,46,0.85)",
            border: "1px solid rgba(163,230,53,0.15)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
          }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest mb-5"
            style={{ background: "rgba(163,230,53,0.1)", border: "1px solid rgba(163,230,53,0.25)", color: "#a3e635" }}
          >
            <Crown className="w-3 h-3" /> Tính năng Premium
          </div>

          <h1 className="text-3xl font-black text-white mb-3 leading-tight">
            Nâng cấp để mở khoá<br />
            <span style={{ color: "#a3e635" }}>Lộ Trình AI</span>
          </h1>

          <p className="text-sm mb-8 leading-relaxed" style={{ color: "#94a3b8" }}>
            Tính năng <strong style={{ color: "#e2e8f0" }}>Lộ trình</strong> chỉ dành riêng cho thành viên
            <strong style={{ color: "#a3e635" }}> Membership</strong>. Đăng ký ngay để AI thiết kế kế hoạch
            dinh dưỡng & luyện tập hoàn toàn cá nhân hoá cho bạn.
          </p>

          {/* Feature list */}
          <div className="grid grid-cols-2 gap-3 mb-8 text-left">
            {FEATURES.map((f) => (
              <div
                key={f.label}
                className="flex items-center gap-2.5 p-3 rounded-xl"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(163,230,53,0.12)", color: "#a3e635" }}
                >
                  {f.icon}
                </div>
                <span className="text-xs font-semibold" style={{ color: "#cbd5e1" }}>{f.label}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/membership"
              className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl font-black text-sm transition-all hover:scale-105 active:scale-95"
              style={{
                background: "linear-gradient(135deg, #a3e635, #4ade80)",
                color: "#0f1117",
                boxShadow: "0 4px 20px rgba(163,230,53,0.35)",
              }}
            >
              <Crown className="w-4 h-4" /> Nâng cấp Membership <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/app"
              className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl font-bold text-sm transition-all hover:opacity-90"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#94a3b8",
              }}
            >
              Quay về trang chủ
            </Link>
          </div>

          {/* Free plan note */}
          <div className="mt-6 pt-5" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-[11px]" style={{ color: "#475569" }}>
              Bạn đang dùng gói <strong style={{ color: "#64748b" }}>Free</strong> ·
              Gói Membership chỉ từ{" "}
              <strong style={{ color: "#a3e635" }}>39.000đ/tháng</strong>
            </p>
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex justify-center gap-6 mt-6">
          {["Huỷ bất cứ lúc nào", "Không ràng buộc", "Hỗ trợ 24/7"].map((t) => (
            <div key={t} className="flex items-center gap-1.5 text-[11px]" style={{ color: "#475569" }}>
              <Check className="w-3 h-3" style={{ color: "#4ade80" }} /> {t}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

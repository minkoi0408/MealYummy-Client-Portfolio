
import { Check, X, Settings, Lock, Bell, Shield, LogOut, Edit2, Mail, Calendar, Sparkles, ArrowRight, Trophy, Rocket, User, Crown, Star } from "lucide-react";
import { AppHeader } from "../components/app-header";

const plans = [
  {
    id: "free", name: "Free", icon: "🥉", price: "0đ", priceDetail: "/tháng",
    subtitle: "Gói miễn phí", description: "Phù hợp để trải nghiệm", popular: false,
    accentColor: "rgba(100,116,139,0.2)", borderColor: "rgba(100,116,139,0.3)", textColor: "#94a3b8",
    features: [
      { text: "Thực đơn 1 ngày", available: true },
      { text: "3 lượt AI/ngày", available: true },
      { text: "Lưu 5 món", available: true },
      { text: "AI không giới hạn", available: false },
      { text: "Danh sách đi chợ", available: false },
    ],
  },
  {
    id: "plus", name: "Plus", icon: "🥈", price: "99.000đ", priceDetail: "/tháng",
    subtitle: "Gói phổ biến", description: "Cho người dùng thường xuyên", popular: true,
    accentColor: "rgba(163,230,53,0.08)", borderColor: "rgba(163,230,53,0.3)", textColor: "#a3e635",
    features: [
      { text: "Thực đơn 7 ngày", available: true },
      { text: "AI không giới hạn", available: true },
      { text: "Danh sách đi chợ", available: true },
      { text: "Thống kê tuần", available: true },
      { text: "Phân tích dinh dưỡng", available: false },
    ],
  },
  {
    id: "pro", name: "Pro", icon: "🥇", price: "199.000đ", priceDetail: "/tháng",
    subtitle: "Gói chuyên nghiệp", description: "Tối ưu sức khỏe toàn diện", popular: false,
    accentColor: "rgba(251,191,36,0.08)", borderColor: "rgba(251,191,36,0.3)", textColor: "#fbbf24",
    features: [
      { text: "Thực đơn 30 ngày", available: true },
      { text: "Phân tích dinh dưỡng", available: true },
      { text: "Giới hạn ngân sách", available: true },
      { text: "Xuất PDF", available: true },
      { text: "Hỗ trợ ưu tiên", available: true },
    ],
  },
];

const SETTINGS_MENU = [
  { icon: <User className="w-4 h-4 text-lime-400" />, label: "Chỉnh sửa hồ sơ" },
  { icon: <Lock className="w-4 h-4 text-blue-400" />, label: "Thay đổi mật khẩu" },
  { icon: <Bell className="w-4 h-4 text-purple-400" />, label: "Thông báo" },
  { icon: <Shield className="w-4 h-4 text-amber-400" />, label: "Bảo mật" },
];

export function ProfilePage() {
  return (
    <div className="min-h-screen">
      <AppHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── LEFT: Profile + Settings ─────────────────────────────── */}
          <div className="lg:col-span-1 space-y-4">

            {/* Profile Card */}
            <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(26,31,46,0.9)", border: "1px solid rgba(255,255,255,0.06)" }}>
              {/* Header gradient */}
              <div className="h-20 relative" style={{ background: "linear-gradient(135deg, #a3e635, #4ade80, #22d3ee)" }}>
                <div className="absolute inset-0 opacity-20"
                  style={{ backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.3) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
              </div>

              <div className="px-5 pb-5 relative">
                {/* Avatar */}
                <div className="flex justify-center -mt-10 mb-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center border-4 shadow-xl"
                      style={{ background: "linear-gradient(135deg, #a3e635, #4ade80)", borderColor: "#0f1117" }}>
                      <User className="w-10 h-10 text-gray-900" />
                    </div>
                    <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center border-2 shadow-md transition-all hover:scale-110"
                      style={{ background: "#1a1f2e", borderColor: "rgba(163,230,53,0.4)" }}>
                      <Edit2 className="w-3.5 h-3.5 text-lime-400" />
                    </button>
                  </div>
                </div>

                {/* User info */}
                <div className="text-center mb-5">
                  <h2 className="text-lg font-black text-white mb-1">Nguyễn Văn A</h2>
                  <p className="text-sm mb-3" style={{ color: "#64748b" }}>user@mealyummy.com</p>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                    style={{ background: "rgba(163,230,53,0.1)", border: "1px solid rgba(163,230,53,0.25)", color: "#a3e635" }}>
                    <Crown className="w-3 h-3" /> Gói Free
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-5">
                  {[
                    { val: "12", label: "Món đã lưu", color: "#a3e635" },
                    { val: "47", label: "Lượt AI", color: "#4ade80" },
                    { val: "8", label: "Ngày dùng", color: "#22d3ee" },
                  ].map((s) => (
                    <div key={s.label} className="text-center p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
                      <div className="text-xl font-black mb-0.5" style={{ color: s.color }}>{s.val}</div>
                      <div className="text-[10px]" style={{ color: "#64748b" }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Contact info */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2" style={{ color: "#64748b" }}>
                    <Mail className="w-3.5 h-3.5 text-lime-400 flex-shrink-0" />
                    <span className="truncate">user@mealyummy.com</span>
                  </div>
                  <div className="flex items-center gap-2" style={{ color: "#64748b" }}>
                    <Calendar className="w-3.5 h-3.5 text-lime-400 flex-shrink-0" />
                    <span>Tham gia: 15/02/2026</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Settings Card */}
            <div className="rounded-2xl p-5" style={{ background: "rgba(26,31,46,0.9)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <h3 className="font-bold text-white text-base mb-3 flex items-center gap-2">
                <Settings className="w-4 h-4 text-lime-400" /> Cài đặt tài khoản
              </h3>
              <div className="space-y-1">
                {SETTINGS_MENU.map((item) => (
                  <button key={item.label}
                    className="w-full flex items-center gap-3 text-sm px-3 py-2.5 rounded-xl transition-all text-left"
                    style={{ color: "#94a3b8" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)";
                      (e.currentTarget as HTMLButtonElement).style.color = "#f1f5f9";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                      (e.currentTarget as HTMLButtonElement).style.color = "#94a3b8";
                    }}
                  >
                    {item.icon} {item.label}
                  </button>
                ))}
                <div className="pt-2 mt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <button className="w-full flex items-center gap-3 text-sm px-3 py-2.5 rounded-xl transition-all"
                    style={{ color: "#f87171" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(248,113,113,0.08)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                  >
                    <LogOut className="w-4 h-4" /> Đăng xuất
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Pricing Plans ─────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Section header */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3 text-xs font-bold uppercase tracking-widest"
                style={{ background: "rgba(163,230,53,0.08)", border: "1px solid rgba(163,230,53,0.2)", color: "#a3e635" }}>
                <Rocket className="w-3.5 h-3.5" /> Nâng cấp tài khoản
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-1">Chọn gói phù hợp</h2>
              <p className="text-sm" style={{ color: "#64748b" }}>Nâng cấp để mở khóa toàn bộ tính năng</p>
            </div>

            {/* Pricing cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {plans.map((plan) => (
                <div key={plan.id} className={`relative ${plan.popular ? "sm:-translate-y-2" : ""}`}>
                  {plan.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                      <div className="px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 text-gray-900"
                        style={{ background: "linear-gradient(135deg, #a3e635, #4ade80)" }}>
                        <Star className="w-3 h-3 fill-current" /> Phổ biến nhất
                      </div>
                    </div>
                  )}
                  <div className="relative rounded-2xl p-5 h-full flex flex-col transition-all hover:scale-[1.02]"
                    style={{ background: plan.accentColor, border: `1px solid ${plan.borderColor}` }}>
                    {/* Icon + name */}
                    <div className="text-center mb-4">
                      <div className="text-4xl mb-2">{plan.icon}</div>
                      <h3 className="text-xl font-black text-white">{plan.name}</h3>
                      <p className="text-xs uppercase tracking-wide mt-0.5" style={{ color: "#64748b" }}>{plan.subtitle}</p>
                    </div>

                    {/* Price */}
                    <div className="text-center mb-5">
                      <span className="text-3xl font-black" style={{ color: plan.textColor }}>
                        {plan.price.replace("đ", "")}
                      </span>
                      <span className="text-lg font-bold" style={{ color: "#64748b" }}>đ</span>
                      <p className="text-[10px]" style={{ color: "#64748b" }}>{plan.priceDetail}</p>
                    </div>

                    {/* Features */}
                    <div className="space-y-2 flex-1 mb-5">
                      {plan.features.map((feature, i) => (
                        <div key={i} className={`flex items-center gap-2 ${!feature.available ? "opacity-35" : ""}`}>
                          {feature.available ? (
                            <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                              style={{ background: plan.textColor }}>
                              <Check className="w-2.5 h-2.5 text-gray-900" strokeWidth={3} />
                            </div>
                          ) : (
                            <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                              style={{ background: "rgba(255,255,255,0.08)" }}>
                              <X className="w-2.5 h-2.5" style={{ color: "#475569" }} strokeWidth={2.5} />
                            </div>
                          )}
                          <span className="text-xs" style={{ color: "#cbd5e1" }}>{feature.text}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <button
                      disabled={plan.id === "free"}
                      className="w-full h-10 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-default"
                      style={plan.id === "free"
                        ? { background: "rgba(255,255,255,0.06)", color: "#64748b" }
                        : { background: `linear-gradient(135deg, ${plan.textColor}, ${plan.id === "plus" ? "#4ade80" : "#f59e0b"})`, color: "#0f1117", fontWeight: 700 }
                      }
                    >
                      {plan.id === "free" ? <><Check className="w-4 h-4" /> Gói hiện tại</> : <><Sparkles className="w-4 h-4" /> Nâng cấp ngay <ArrowRight className="w-4 h-4" /></>}
                    </button>
                    <p className="text-[10px] text-center mt-2" style={{ color: "#64748b" }}>{plan.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Guarantee */}
            <div className="rounded-2xl p-5" style={{ background: "rgba(163,230,53,0.04)", border: "1px solid rgba(163,230,53,0.15)" }}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg"
                  style={{ background: "linear-gradient(135deg, #a3e635, #4ade80)" }}>
                  <Trophy className="w-6 h-6 text-gray-900" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">Đảm bảo hoàn tiền trong 7 ngày</h3>
                  <p className="text-sm mb-3" style={{ color: "#64748b" }}>Không hài lòng? Chúng tôi hoàn lại 100% chi phí, không cần lý do.</p>
                  <div className="flex flex-wrap gap-2">
                    {["Thanh toán an toàn", "Hủy bất kỳ lúc nào", "Không ràng buộc"].map((b) => (
                      <span key={b} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                        style={{ background: "rgba(163,230,53,0.08)", border: "1px solid rgba(163,230,53,0.15)", color: "#a3e635" }}>
                        <Check className="w-3 h-3" /> {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
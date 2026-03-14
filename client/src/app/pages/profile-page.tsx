

import { Check, Settings, Lock, Bell, Shield, LogOut, Edit2, Mail, Calendar, Trophy, Rocket, User, Crown, Star, Sparkles, ArrowRight } from "lucide-react";
import { useState } from "react";
import { AppHeader } from "../components/app-header";

const PROFILE_TIERS = [
  { id: "monthly", label: "1 Tháng", price: "89.000đ", saving: null as null | string },
  { id: "quarterly", label: "3 Tháng", price: "249.000đ", saving: "Tiết kiệm 18k" },
  { id: "yearly", label: "1 Năm", price: "999.000đ", saving: "Siêu ưu đãi" },
];

const FREE_PERKS = ["AI gợi ý món ăn theo khẩu vị", "Thư viện 500+ món Fitness", "Xếp hạng & yêu thích"];
const MEM_PERKS  = ["Tính chỉ số BMI & sức khoẻ", "Thực đơn cá nhân hoá từng ngày", "Dinh dưỡng tự động", "Danh sách nguyên liệu AI", "Mua sắm thực phẩm online"];

function PricingCards() {
  const [tier, setTier] = useState("monthly");
  const active = PROFILE_TIERS.find((t) => t.id === tier)!;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Free card */}
      <div className="rounded-2xl p-5 flex flex-col"
        style={{ background: "rgba(26,31,46,0.9)", border: "1px solid rgba(100,116,139,0.25)" }}>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-3xl">🥉</span>
          <div>
            <div className="font-black text-white text-lg">Free</div>
            <div className="text-[10px] uppercase tracking-widest" style={{ color: "#64748b" }}>Người trải nghiệm</div>
          </div>
          <div className="ml-auto text-sm font-black" style={{ color: "#94a3b8" }}>0đ</div>
        </div>
        <ul className="space-y-2 flex-1 mb-4">
          {FREE_PERKS.map((p) => (
            <li key={p} className="flex items-center gap-2 text-xs" style={{ color: "#94a3b8" }}>
              <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#64748b" }} />{p}
            </li>
          ))}
        </ul>
        <button disabled className="w-full h-9 rounded-xl text-xs font-bold cursor-default"
          style={{ background: "rgba(255,255,255,0.05)", color: "#64748b" }}>
          <Check className="w-3.5 h-3.5 inline mr-1" />Gói hiện tại
        </button>
      </div>

      {/* Membership card */}
      <div className="relative rounded-2xl p-5 flex flex-col"
        style={{ background: "rgba(163,230,53,0.05)", border: "2px solid rgba(163,230,53,0.3)", boxShadow: "0 0 28px rgba(163,230,53,0.1)" }}>
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <div className="px-3 py-0.5 rounded-full text-[10px] font-black flex items-center gap-1 text-gray-900"
            style={{ background: "linear-gradient(135deg,#a3e635,#4ade80)" }}>
            <Star className="w-2.5 h-2.5 fill-current" /> Phổ biến
          </div>
        </div>
        <div className="flex items-center gap-2 mb-3 mt-1">
          <span className="text-3xl">🥇</span>
          <div>
            <div className="font-black text-white text-lg">Membership</div>
            <div className="text-[10px] uppercase tracking-widest" style={{ color: "#a3e635" }}>Gymer Pro</div>
          </div>
          <div className="ml-auto text-right">
            <div className="text-base font-black" style={{ color: "#a3e635" }}>{active.price}</div>
            <div className="text-[10px]" style={{ color: "#64748b" }}>{active.label.toLowerCase()}</div>
          </div>
        </div>
        {/* Tier pills */}
        <div className="flex gap-1.5 mb-3">
          {PROFILE_TIERS.map((t) => (
            <button key={t.id} onClick={() => setTier(t.id)}
              className="flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all"
              style={{
                background: tier === t.id ? "rgba(163,230,53,0.15)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${tier === t.id ? "rgba(163,230,53,0.4)" : "rgba(255,255,255,0.07)"}`,
                color: tier === t.id ? "#a3e635" : "#64748b",
              }}>
              {t.label}
              {t.saving && <div className="text-[8px]" style={{ color: "#a3e635" }}>{t.saving}</div>}
            </button>
          ))}
        </div>
        <ul className="space-y-2 flex-1 mb-4">
          {MEM_PERKS.map((p) => (
            <li key={p} className="flex items-center gap-2 text-xs" style={{ color: "#cbd5e1" }}>
              <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(163,230,53,0.2)" }}>
                <Check className="w-2 h-2" style={{ color: "#a3e635" }} />
              </div>{p}
            </li>
          ))}
        </ul>
        <button className="w-full h-9 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all hover:opacity-90"
          style={{ background: "linear-gradient(135deg,#a3e635,#4ade80)", color: "#0f1117", boxShadow: "0 4px 16px rgba(163,230,53,0.3)" }}>
          <Sparkles className="w-3.5 h-3.5" /> Đăng ký ngay <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}


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
          <div className="lg:col-span-2 space-y-5">

            {/* Section header */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3 text-xs font-bold uppercase tracking-widest"
                style={{ background: "rgba(163,230,53,0.08)", border: "1px solid rgba(163,230,53,0.2)", color: "#a3e635" }}>
                <Rocket className="w-3.5 h-3.5" /> Đăng ký thành viên
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-1">Nâng cấp tài khoản</h2>
              <p className="text-sm" style={{ color: "#64748b" }}>Mở khoá đầy đủ tính năng AI — ăn đúng, tập đúng</p>
            </div>

            {/* Free vs Membership cards */}
            <PricingCards />

            {/* Guarantee */}
            <div className="rounded-2xl p-5" style={{ background: "rgba(163,230,53,0.04)", border: "1px solid rgba(163,230,53,0.15)" }}>
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg"
                  style={{ background: "linear-gradient(135deg, #a3e635, #4ade80)" }}>
                  <Trophy className="w-5 h-5 text-gray-900" />
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
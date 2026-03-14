import { useState } from "react";
import {
  Check,
  X,
  Star,
  Sparkles,
  ArrowRight,
  Trophy,
  Shield,
  Zap,
  Crown,
  Rocket,
  HeartHandshake,
  ChevronDown,
  Dumbbell,
  ShoppingCart,
  Calculator,
  Utensils,
  UtensilsCrossed,
} from "lucide-react";
import { AppHeader } from "../components/app-header";

/* ── Plan feature lists ─────────────────────────────────────────────────── */
const FREE_FEATURES = [
  { icon: <Sparkles className="w-4 h-4" />, text: "AI gợi ý món ăn theo khẩu vị" },
  { icon: <Utensils className="w-4 h-4" />, text: "Thư viện 500+ món ăn Fitness cơ bản" },
  { icon: <Trophy className="w-4 h-4" />, text: "Truy cập trang xếp hạng món ăn" },
  { icon: <Star className="w-4 h-4" />, text: "Thêm món vào danh sách yêu thích" },
];

const MEMBER_FEATURES = [
  { icon: <Check className="w-4 h-4" />, text: "Toàn bộ tính năng Free" },
  { icon: <Calculator className="w-4 h-4" />, text: "Tính toán chỉ số BMI & sức khoẻ cá nhân" },
  { icon: <UtensilsCrossed className="w-4 h-4" />, text: "Lên thực đơn cá nhân hoá từng ngày" },
  { icon: <Dumbbell className="w-4 h-4" />, text: "Tự động tính chỉ số dinh dưỡng theo thực đơn" },
  { icon: <ShoppingCart className="w-4 h-4" />, text: "AI tự lên danh sách nguyên liệu cần mua" },
  { icon: <Check className="w-4 h-4" />, text: "Check list nguyên liệu thông minh" },
  { icon: <Rocket className="w-4 h-4" />, text: "Liên kết cửa hàng thực phẩm mua online" },
];

/* ── Membership pricing tiers ───────────────────────────────────────────── */
const TIERS = [
  { id: "monthly", label: "1 Tháng", price: 89000, badge: null, saving: null },
  { id: "quarterly", label: "3 Tháng", price: 249000, perMonth: 83000, badge: "Tiết kiệm nhất", saving: "Tiết kiệm 18.000đ" },
  { id: "yearly", label: "1 Năm", price: 999000, perMonth: 83250, badge: "Siêu ưu đãi", saving: "Tiết kiệm 69.000đ" },
];

/* ── FAQ ─────────────────────────────────────────────────────────────────── */
const FAQS = [
  { q: "Tôi có thể hủy gói bất kỳ lúc nào không?", a: "Có, bạn có thể hủy gói thành viên bất kỳ lúc nào. Gói hiện tại vẫn hoạt động đến hết chu kỳ thanh toán đã mua." },
  { q: "Gói Membership có khác nhau tính năng theo mức giá không?", a: "Không — 3 mức giá (1 tháng / 3 tháng / 1 năm) có tính năng hoàn toàn giống nhau. Bạn chỉ tiết kiệm hơn khi chọn gói dài hạn hơn." },
  { q: "Thanh toán có an toàn không?", a: "Hoàn toàn an toàn. Chúng tôi sử dụng cổng thanh toán được mã hóa SSL, không lưu trữ thông tin thẻ ngân hàng của bạn." },
  { q: "Có bảo lưu tiền nếu không hài lòng không?", a: "Chúng tôi cam kết hoàn tiền 100% trong vòng 7 ngày đầu nếu bạn không hài lòng, không cần giải thích lý do." },
];

/* ── Highlight features ─────────────────────────────────────────────────── */
const HIGHLIGHTS = [
  { icon: <Zap className="w-5 h-5" style={{ color: "#a3e635" }} />, title: "AI Gợi Ý Thông Minh", desc: "Phân tích khẩu vị & mục tiêu để đề xuất bữa ăn tối ưu cho từng người." },
  { icon: <Shield className="w-5 h-5" style={{ color: "#22d3ee" }} />, title: "Bảo Mật Tuyệt Đối", desc: "Dữ liệu sức khoẻ của bạn được mã hóa và bảo vệ theo chuẩn quốc tế." },
  { icon: <HeartHandshake className="w-5 h-5" style={{ color: "#f472b6" }} />, title: "Hỗ Trợ Tận Tâm", desc: "Đội ngũ luôn sẵn sàng giúp bạn đạt mục tiêu sức khoẻ mỗi ngày." },
];

/* ── Format VND ──────────────────────────────────────────────────────────── */
function vnd(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

/* ── FAQ Item ────────────────────────────────────────────────────────────── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl overflow-hidden transition-all"
      style={{ background: "rgba(26,31,46,0.9)", border: "1px solid rgba(255,255,255,0.06)" }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left gap-4 group"
      >
        <span className="text-sm font-semibold text-white group-hover:text-lime-300 transition-colors">{q}</span>
        <ChevronDown className="w-4 h-4 flex-shrink-0 transition-transform"
          style={{ color: "#a3e635", transform: open ? "rotate(180deg)" : "rotate(0deg)" }} />
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm" style={{ color: "#94a3b8", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <p className="pt-3">{a}</p>
        </div>
      )}
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────────────────── */
export function MembershipPage() {
  const [selectedTier, setSelectedTier] = useState("monthly");

  return (
    <div className="min-h-screen" style={{ background: "#0f1117" }}>
      <AppHeader />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-16">

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
            style={{ background: "rgba(163,230,53,0.08)", border: "1px solid rgba(163,230,53,0.2)", color: "#a3e635" }}>
            <Crown className="w-3.5 h-3.5" /> Đăng ký thành viên
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            Ăn uống thông minh hơn{" "}
            <span style={{
              background: "linear-gradient(90deg,#a3e635,#4ade80)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>cùng AI</span>
          </h1>
          <p className="text-base sm:text-lg max-w-xl mx-auto" style={{ color: "#64748b" }}>
            Giải quyết sự nhàm chán trong ăn uống — AI cá nhân hóa thực đơn, tính dinh dưỡng và hỗ trợ mua sắm cho Gymer bận rộn.
          </p>
        </section>

        {/* ── Plans ────────────────────────────────────────────────────── */}
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

            {/* ── Card FREE ────────────────────────── */}
            <div className="rounded-2xl p-6 flex flex-col h-full"
              style={{
                background: "rgba(26,31,46,0.9)",
                border: "1px solid rgba(100,116,139,0.25)",
              }}>
              {/* Header */}
              <div className="flex items-center gap-3 mb-5">
                <div className="text-4xl">🥉</div>
                <div>
                  <h2 className="text-2xl font-black text-white">Free</h2>
                  <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: "#64748b" }}>Người trải nghiệm</p>
                </div>
                <div className="ml-auto px-3 py-1 rounded-full text-xs font-bold" style={{ background: "rgba(100,116,139,0.15)", color: "#94a3b8", border: "1px solid rgba(100,116,139,0.25)" }}>
                  Miễn phí
                </div>
              </div>

              {/* Price */}
              <div className="text-4xl font-black mb-1" style={{ color: "#94a3b8" }}>0đ</div>
              <p className="text-xs mb-6" style={{ color: "#475569" }}>Không cần thẻ tín dụng</p>

              {/* Features */}
              <ul className="space-y-3 flex-1 mb-6">
                {FREE_FEATURES.map((f, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(100,116,139,0.15)", color: "#94a3b8" }}>
                      {f.icon}
                    </div>
                    <span className="text-sm" style={{ color: "#cbd5e1" }}>{f.text}</span>
                  </li>
                ))}
              </ul>

              {/* Limited note */}
              <div className="rounded-xl p-3 mb-5 text-xs" style={{ background: "rgba(100,116,139,0.08)", border: "1px solid rgba(100,116,139,0.15)", color: "#64748b" }}>
                <span className="font-semibold text-slate-400">Không bao gồm:</span> Thực đơn cá nhân hoá, tính toán dinh dưỡng, danh sách nguyên liệu & mua sắm online.
              </div>

              <button disabled
                className="w-full h-11 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-default"
                style={{ background: "rgba(255,255,255,0.05)", color: "#64748b" }}>
                <Check className="w-4 h-4" /> Gói cơ bản — miễn phí mãi
              </button>
            </div>

            {/* ── Card MEMBERSHIP ──────────────────── */}
            <div className="relative rounded-2xl p-6 flex flex-col h-full"
              style={{
                background: "rgba(163,230,53,0.05)",
                border: "2px solid rgba(163,230,53,0.3)",
                boxShadow: "0 0 40px rgba(163,230,53,0.12)",
              }}>
              {/* Popular badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <div className="px-4 py-1 rounded-full text-xs font-black flex items-center gap-1.5 text-gray-900 shadow-lg"
                  style={{ background: "linear-gradient(135deg,#a3e635,#4ade80)" }}>
                  <Star className="w-3 h-3 fill-current" /> Được chọn nhiều nhất
                </div>
              </div>

              {/* Header */}
              <div className="flex items-center gap-3 mb-5 mt-2">
                <div className="text-4xl">🥇</div>
                <div>
                  <h2 className="text-2xl font-black text-white">Membership</h2>
                  <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: "#a3e635" }}>Gymer Pro</p>
                </div>
              </div>

              {/* Tier selector */}
              <div className="flex gap-2 mb-5">
                {TIERS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTier(t.id)}
                    className="flex-1 relative rounded-xl py-2.5 px-1 text-center transition-all"
                    style={{
                      background: selectedTier === t.id ? "rgba(163,230,53,0.12)" : "rgba(255,255,255,0.04)",
                      border: `1px solid ${selectedTier === t.id ? "rgba(163,230,53,0.4)" : "rgba(255,255,255,0.08)"}`,
                    }}
                  >
                    {t.badge && (
                      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[9px] font-black whitespace-nowrap"
                        style={{ background: "linear-gradient(135deg,#a3e635,#4ade80)", color: "#0f1117" }}>
                        {t.badge}
                      </div>
                    )}
                    <div className={`text-xs font-bold ${selectedTier === t.id ? "text-lime-300" : "text-slate-400"}`}>{t.label}</div>
                    <div className={`text-sm font-black mt-0.5 ${selectedTier === t.id ? "text-white" : "text-slate-300"}`}>
                      {vnd(t.price)}
                    </div>
                    {t.saving && (
                      <div className="text-[10px] mt-0.5" style={{ color: "#a3e635" }}>{t.saving}</div>
                    )}
                  </button>
                ))}
              </div>

              {/* Active price display */}
              {(() => {
                const tier = TIERS.find((t) => t.id === selectedTier)!;
                return (
                  <div className="flex items-end gap-2 mb-1">
                    <span className="text-4xl font-black" style={{ color: "#a3e635" }}>{vnd(tier.price)}</span>
                    <span className="text-sm mb-1.5" style={{ color: "#64748b" }}>/ {tier.label.toLowerCase()}</span>
                  </div>
                );
              })()}
              {TIERS.find((t) => t.id === selectedTier)?.perMonth && (
                <p className="text-xs mb-6" style={{ color: "#64748b" }}>
                  ≈ {vnd(TIERS.find((t) => t.id === selectedTier)!.perMonth!)}/tháng
                </p>
              )}
              {!TIERS.find((t) => t.id === selectedTier)?.perMonth && (
                <p className="text-xs mb-6" style={{ color: "#64748b" }}>Gia hạn hàng tháng</p>
              )}

              {/* Features */}
              <ul className="space-y-3 flex-1 mb-6">
                {MEMBER_FEATURES.map((f, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(163,230,53,0.15)", color: "#a3e635" }}>
                      {f.icon}
                    </div>
                    <span className="text-sm" style={{ color: "#cbd5e1" }}>{f.text}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button className="w-full h-12 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg,#a3e635,#4ade80)",
                  color: "#0f1117",
                  boxShadow: "0 4px 24px rgba(163,230,53,0.35)",
                }}>
                <Sparkles className="w-4 h-4" /> Đăng ký Membership <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[11px] text-center mt-2.5" style={{ color: "#475569" }}>Hoàn tiền 100% trong 7 ngày nếu không hài lòng</p>
            </div>
          </div>

          {/* Feature comparison table */}
          <div className="mt-6 rounded-2xl overflow-hidden"
            style={{ background: "rgba(26,31,46,0.9)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="grid grid-cols-3 text-xs font-bold uppercase tracking-widest px-5 py-3"
              style={{ color: "#64748b", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="col-span-1">Tính năng</div>
              <div className="text-center">Free</div>
              <div className="text-center" style={{ color: "#a3e635" }}>Membership</div>
            </div>
            {[
              { label: "AI gợi ý món ăn", free: true, member: true },
              { label: "Thư viện 500+ món Fitness", free: true, member: true },
              { label: "Xếp hạng & yêu thích", free: true, member: true },
              { label: "Tính chỉ số BMI", free: false, member: true },
              { label: "Thực đơn cá nhân hoá", free: false, member: true },
              { label: "Tính dinh dưỡng tự động", free: false, member: true },
              { label: "Danh sách nguyên liệu AI", free: false, member: true },
              { label: "Mua sắm thực phẩm online", free: false, member: true },
            ].map((row, i) => (
              <div key={i} className={`grid grid-cols-3 px-5 py-3 text-sm ${i % 2 === 0 ? "" : ""}`}
                style={{ borderBottom: i < 7 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                <div style={{ color: "#94a3b8" }}>{row.label}</div>
                <div className="flex justify-center">
                  {row.free
                    ? <Check className="w-4 h-4" style={{ color: "#94a3b8" }} />
                    : <X className="w-4 h-4" style={{ color: "#334155" }} />}
                </div>
                <div className="flex justify-center">
                  {row.member
                    ? <Check className="w-4 h-4" style={{ color: "#a3e635" }} />
                    : <X className="w-4 h-4" style={{ color: "#334155" }} />}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Why MealYummy ────────────────────────────────────────────── */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">Tại sao chọn MealYummy?</h2>
            <p className="text-sm" style={{ color: "#64748b" }}>Được thiết kế dành riêng cho Gymer bận rộn</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {HIGHLIGHTS.map((h, i) => (
              <div key={i} className="rounded-2xl p-5 text-center space-y-3 transition-all hover:scale-[1.02]"
                style={{ background: "rgba(26,31,46,0.9)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto"
                  style={{ background: "rgba(255,255,255,0.05)" }}>
                  {h.icon}
                </div>
                <h3 className="font-bold text-white text-sm">{h.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "#64748b" }}>{h.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Guarantee ────────────────────────────────────────────────── */}
        <section>
          <div className="rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6"
            style={{ background: "rgba(163,230,53,0.05)", border: "1px solid rgba(163,230,53,0.15)" }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl"
              style={{ background: "linear-gradient(135deg,#a3e635,#4ade80)", boxShadow: "0 0 24px rgba(163,230,53,0.3)" }}>
              <Trophy className="w-8 h-8 text-gray-900" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-xl font-black text-white mb-1">Đảm bảo hoàn tiền trong 7 ngày</h3>
              <p className="text-sm mb-4" style={{ color: "#64748b" }}>
                Không hài lòng? Chúng tôi hoàn lại 100% chi phí, không cần lý do.
              </p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                {["Thanh toán an toàn 🔒", "Hủy bất kỳ lúc nào", "Không ràng buộc hợp đồng"].map((b) => (
                  <span key={b} className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ background: "rgba(163,230,53,0.1)", border: "1px solid rgba(163,230,53,0.2)", color: "#a3e635" }}>
                    <Check className="w-3 h-3" /> {b}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────── */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">Câu hỏi thường gặp</h2>
            <p className="text-sm" style={{ color: "#64748b" }}>Mọi thắc mắc đều có câu trả lời tại đây</p>
          </div>
          <div className="max-w-2xl mx-auto space-y-3">
            {FAQS.map((faq, i) => <FaqItem key={i} q={faq.q} a={faq.a} />)}
          </div>
        </section>

      </main>
    </div>
  );
}

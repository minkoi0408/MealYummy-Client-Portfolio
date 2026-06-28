import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppHeader } from "../components/app-header";
import {
  Crown,
  Sparkles,
  Calendar,
  ShoppingCart,
  Calculator,
  Dumbbell,
  UtensilsCrossed,
  ArrowRight,
  Check,
  Zap,
  Star,
  ChevronRight,
  Lock,
  Brain,
  Target,
  TrendingUp,
  Package,
  MapPin,
} from "lucide-react";

/* ── Feature cards ─────────────────────────────────────────── */
const PREMIUM_FEATURES = [
  {
    icon: Calendar,
    title: "Thực Đơn 7 Ngày",
    desc: "AI tự động lên meal plan cả tuần, cân bằng macro và calo theo mục tiêu thể hình của bạn.",
    gradient: "linear-gradient(135deg, #60a5fa, #818cf8)",
    glow: "rgba(96,165,250,0.2)",
    badge: "HOT",
  },
  {
    icon: Calculator,
    title: "Tính BMI & Dinh Dưỡng",
    desc: "Tự động tính chỉ số BMI, TDEE, tỷ lệ macro lý tưởng cho từng mục tiêu: giảm mỡ, tăng cơ hay duy trì.",
    gradient: "linear-gradient(135deg, #a3e635, #4ade80)",
    glow: "rgba(163,230,53,0.2)",
    badge: null,
  },
  {
    icon: UtensilsCrossed,
    title: "Cá Nhân Hoá Thực Đơn",
    desc: "Điều chỉnh thực đơn theo dị ứng thực phẩm, khẩu vị, ngân sách và lịch tập luyện riêng của bạn.",
    gradient: "linear-gradient(135deg, #f472b6, #ec4899)",
    glow: "rgba(244,114,182,0.2)",
    badge: null,
  },
  {
    icon: ShoppingCart,
    title: "Danh Sách Đi Chợ AI",
    desc: "AI tự tổng hợp danh sách nguyên liệu cần mua từ toàn bộ thực đơn tuần. Không bỏ sót gì cả.",
    gradient: "linear-gradient(135deg, #a78bfa, #c084fc)",
    glow: "rgba(167,139,250,0.2)",
    badge: "NEW",
  },
  {
    icon: MapPin,
    title: "Liên Kết Cửa Hàng",
    desc: "Gợi ý siêu thị, cửa hàng thực phẩm gần nhất để mua nguyên liệu tươi với giá tốt nhất.",
    gradient: "linear-gradient(135deg, #fb923c, #f97316)",
    glow: "rgba(251,146,60,0.2)",
    badge: null,
  },
  {
    icon: TrendingUp,
    title: "Theo Dõi Tiến Trình",
    desc: "Dashboard trực quan theo dõi calo, macro hàng ngày và sự thay đổi cân nặng theo từng tuần.",
    gradient: "linear-gradient(135deg, #22d3ee, #06b6d4)",
    glow: "rgba(34,211,238,0.2)",
    badge: null,
  },
];

const COMPARISON = [
  { feature: "Thư viện 500+ món ăn Fitness", free: true, premium: true },
  { feature: "AI gợi ý món theo khẩu vị", free: true, premium: true },
  { feature: "Lưu món yêu thích", free: true, premium: true },
  { feature: "Thực đơn 7 ngày cá nhân hoá", free: false, premium: true },
  { feature: "Tính BMI & chỉ số dinh dưỡng", free: false, premium: true },
  { feature: "Danh sách đi chợ tự động", free: false, premium: true },
  { feature: "Liên kết cửa hàng thực phẩm", free: false, premium: true },
  { feature: "Theo dõi tiến trình sức khoẻ", free: false, premium: true },
];

/* ── Animated counter ───────────────────────────────────────── */
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const duration = 1500;
          const step = Math.ceil(target / (duration / 16));
          const timer = setInterval(() => {
            start += step;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(start);
            }
          }, 16);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ── Floating badge ─────────────────────────────────────────── */
function FloatingCard({ children, style, className = "" }: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <div
      className={`absolute backdrop-blur-md rounded-2xl px-4 py-3 shadow-2xl ${className}`}
      style={{
        background: "rgba(26,31,46,0.9)",
        border: "1px solid rgba(255,255,255,0.1)",
        animation: "float 3s ease-in-out infinite",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function MealPlanPage() {
  return (
    <div className="min-h-screen" style={{ background: "#0f1117" }}>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes floatDelay {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 40px rgba(163,230,53,0.3); }
          50% { box-shadow: 0 0 80px rgba(163,230,53,0.6), 0 0 120px rgba(163,230,53,0.2); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .shimmer-text {
          background: linear-gradient(90deg, #a3e635, #4ade80, #22d3ee, #a3e635);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }
        .feature-card:hover {
          transform: translateY(-6px);
        }
        .glow-button {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>

      <AppHeader />

      {/* ── HERO SECTION ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-20 px-6">
        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full"
            style={{ background: "radial-gradient(ellipse, rgba(163,230,53,0.08) 0%, transparent 65%)" }} />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(96,165,250,0.06) 0%, transparent 70%)" }} />
          <div className="absolute top-1/3 left-0 w-64 h-64 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(244,114,182,0.05) 0%, transparent 70%)" }} />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left */}
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                style={{
                  background: "rgba(163,230,53,0.08)",
                  border: "1px solid rgba(163,230,53,0.25)",
                }}>
                <Crown className="w-4 h-4" style={{ color: "#a3e635" }} />
                <span className="text-xs font-black uppercase tracking-widest" style={{ color: "#a3e635" }}>
                  Membership Exclusive
                </span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-black text-white leading-none mb-6">
                MEAL PLAN
                <br />
                <span className="shimmer-text">THÔNG MINH</span>
                <br />
                <span className="text-white">CÙNG AI</span>
              </h1>

              <p className="text-lg leading-relaxed mb-8" style={{ color: "#94a3b8" }}>
                Không còn loay hoay "hôm nay ăn gì". AI của MealYummy tự động lên{" "}
                <strong style={{ color: "#e2e8f0" }}>thực đơn 7 ngày</strong> cá nhân hoá,
                tính toán dinh dưỡng chính xác và tạo{" "}
                <strong style={{ color: "#a3e635" }}>danh sách đi chợ</strong> tự động.
              </p>

              {/* Feature pills */}
              <div className="flex flex-wrap gap-2 mb-10">
                {["7-Day Meal Plan", "Auto Shopping List", "BMI Calculator", "Macro Tracker", "Store Finder"].map(tag => (
                  <span key={tag}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#94a3b8",
                    }}>
                    ✦ {tag}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/membership"
                  className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-xl font-black text-base transition-all hover:scale-105 active:scale-95 glow-button"
                  style={{
                    background: "linear-gradient(135deg, #a3e635, #4ade80)",
                    color: "#0f1117",
                  }}
                >
                  <Crown className="w-5 h-5" />
                  Nâng cấp Membership
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/app"
                  className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-xl font-semibold text-base transition-all hover:bg-white/10"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#94a3b8",
                  }}
                >
                  Dùng bản Free
                </Link>
              </div>

              {/* Trust */}
              <div className="flex gap-6 mt-6">
                {["Huỷ bất cứ lúc nào", "Hoàn tiền 7 ngày", "Từ 39.000đ/tháng"].map(t => (
                  <div key={t} className="flex items-center gap-1.5 text-xs" style={{ color: "#475569" }}>
                    <Check className="w-3 h-3" style={{ color: "#4ade80" }} />
                    {t}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Visual mock */}
            <div className="relative flex items-center justify-center" style={{ minHeight: 480 }}>
              {/* Center: Meal plan card */}
              <div className="relative w-72 rounded-3xl p-6 shadow-2xl"
                style={{
                  background: "linear-gradient(145deg, rgba(26,31,46,0.98), rgba(16,21,36,0.98))",
                  border: "1px solid rgba(163,230,53,0.25)",
                  boxShadow: "0 20px 80px rgba(0,0,0,0.5), 0 0 60px rgba(163,230,53,0.1)",
                }}>
                {/* Top accent */}
                <div className="absolute top-0 left-0 w-full h-1 rounded-t-3xl"
                  style={{ background: "linear-gradient(90deg,#a3e635,#4ade80,#22d3ee)" }} />

                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg,#a3e635,#4ade80)" }}>
                    <Calendar className="w-5 h-5 text-gray-900" />
                  </div>
                  <div>
                    <p className="text-white font-black text-sm">Meal Plan Tuần này</p>
                    <p className="text-xs" style={{ color: "#64748b" }}>AI · Cá nhân hoá</p>
                  </div>
                  <div className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-black"
                    style={{ background: "rgba(163,230,53,0.15)", color: "#a3e635" }}>
                    LIVE
                  </div>
                </div>

                {/* Days */}
                {[
                  { day: "Thứ 2", meals: "Yến mạch · Ức gà · Salad", cal: "1.820 kcal", color: "#a3e635" },
                  { day: "Thứ 3", meals: "Trứng · Cá ngừ · Bông cải", cal: "1.750 kcal", color: "#60a5fa" },
                  { day: "Thứ 4", meals: "Granola · Beef · Rau xào", cal: "1.900 kcal", color: "#f472b6" },
                  { day: "Thứ 5", meals: "Yến mạch · Tôm · Salad", cal: "1.680 kcal", color: "#a78bfa" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 py-2.5"
                    style={{ borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                    <div className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: item.color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white">{item.day}</p>
                      <p className="text-[10px] truncate" style={{ color: "#475569" }}>{item.meals}</p>
                    </div>
                    <span className="text-[10px] font-semibold flex-shrink-0" style={{ color: item.color }}>
                      {item.cal}
                    </span>
                  </div>
                ))}

                {/* Blur overlay - locked */}
                <div className="absolute inset-x-0 bottom-0 rounded-b-3xl flex flex-col items-center justify-center pb-6"
                  style={{
                    height: "45%",
                    background: "linear-gradient(to bottom, transparent, rgba(16,21,36,0.97) 40%)",
                  }}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 shadow-xl"
                    style={{
                      background: "rgba(163,230,53,0.1)",
                      border: "1px solid rgba(163,230,53,0.3)",
                    }}>
                    <Lock className="w-6 h-6" style={{ color: "#a3e635" }} />
                  </div>
                  <p className="text-xs font-black text-white mb-1">Mở khoá với Membership</p>
                  <p className="text-[10px]" style={{ color: "#64748b" }}>3 ngày còn lại bị ẩn</p>
                </div>
              </div>

              {/* Floating cards */}
              <FloatingCard
                className="hidden lg:block"
                style={{ top: "5%", right: "-5%", animationDelay: "0s" }}>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(163,230,53,0.15)" }}>
                    <Sparkles className="w-4 h-4" style={{ color: "#a3e635" }} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-white">AI Gợi Ý</p>
                    <p className="text-[10px]" style={{ color: "#4ade80" }}>+48 món mới</p>
                  </div>
                </div>
              </FloatingCard>

              <FloatingCard
                className="hidden lg:block"
                style={{ bottom: "15%", left: "-8%", animationDelay: "1s", animationDuration: "3.5s" }}>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(167,139,250,0.15)" }}>
                    <ShoppingCart className="w-4 h-4" style={{ color: "#a78bfa" }} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-white">Đi chợ AI</p>
                    <p className="text-[10px]" style={{ color: "#94a3b8" }}>12 nguyên liệu</p>
                  </div>
                </div>
              </FloatingCard>

              <FloatingCard
                className="hidden lg:block"
                style={{ top: "40%", right: "-12%", animationDelay: "0.7s", animationDuration: "4s" }}>
                <div className="flex items-center gap-2">
                  <Star className="w-3.5 h-3.5 fill-current" style={{ color: "#fbbf24" }} />
                  <Star className="w-3.5 h-3.5 fill-current" style={{ color: "#fbbf24" }} />
                  <Star className="w-3.5 h-3.5 fill-current" style={{ color: "#fbbf24" }} />
                  <Star className="w-3.5 h-3.5 fill-current" style={{ color: "#fbbf24" }} />
                  <Star className="w-3.5 h-3.5 fill-current" style={{ color: "#fbbf24" }} />
                  <span className="text-xs font-bold text-white ml-1">4.9</span>
                </div>
                <p className="text-[10px] mt-1" style={{ color: "#64748b" }}>10,000+ Gymer hài lòng</p>
              </FloatingCard>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
              style={{ background: "rgba(163,230,53,0.08)", border: "1px solid rgba(163,230,53,0.2)" }}>
              <Zap className="w-3.5 h-3.5" style={{ color: "#a3e635" }} />
              <span className="text-xs font-black uppercase tracking-widest" style={{ color: "#a3e635" }}>
                6 Tính Năng Độc Quyền
              </span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
              MỌI THỨ BẠN CẦN
            </h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: "#64748b" }}>
              Từ lên kế hoạch, tính toán dinh dưỡng đến mua sắm nguyên liệu — tất cả trong một nơi.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PREMIUM_FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="feature-card relative rounded-2xl p-6 transition-all duration-300 cursor-default"
                  style={{
                    background: "rgba(26,31,46,0.8)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.border = `1px solid ${f.glow.replace("0.2", "0.4")}`;
                    (e.currentTarget as HTMLDivElement).style.boxShadow = `0 16px 48px rgba(0,0,0,0.4), 0 0 32px ${f.glow}`;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.border = "1px solid rgba(255,255,255,0.06)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                  }}
                >
                  {f.badge && (
                    <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase"
                      style={{ background: f.gradient, color: "#0f1117" }}>
                      {f.badge}
                    </div>
                  )}

                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 shadow-lg"
                    style={{ background: f.gradient, boxShadow: `0 8px 24px ${f.glow}` }}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  <h3 className="text-white font-black text-lg mb-2">{f.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>{f.desc}</p>

                  {/* Lock badge */}
                  <div className="flex items-center gap-1.5 mt-5"
                    style={{ color: "#475569" }}>
                    <Lock className="w-3 h-3" />
                    <span className="text-xs">Chỉ dành cho Membership</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
      <section className="py-20 px-6" style={{ background: "rgba(26,31,46,0.3)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black text-white mb-3">CHỈ 3 BƯỚC ĐƠN GIẢN</h2>
            <p style={{ color: "#64748b" }}>Từ đăng ký đến có meal plan đầu tiên trong vòng 2 phút</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                icon: Crown,
                title: "Đăng Ký Membership",
                desc: "Chọn gói phù hợp từ 1 tháng đến 1 năm. Thanh toán an toàn qua PayOS.",
                color: "#a3e635",
              },
              {
                step: "02",
                icon: Brain,
                title: "Nhập Thông Tin",
                desc: "AI hỏi về mục tiêu, cân nặng, chiều cao và lịch tập luyện của bạn.",
                color: "#60a5fa",
              },
              {
                step: "03",
                icon: Sparkles,
                title: "Nhận Meal Plan",
                desc: "AI tạo thực đơn 7 ngày hoàn chỉnh kèm danh sách đi chợ trong vài giây.",
                color: "#f472b6",
              },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="relative">
                  {i < 2 && (
                    <div className="hidden md:flex absolute top-10 -right-3 z-10 items-center">
                      <ChevronRight className="w-6 h-6" style={{ color: "#334155" }} />
                    </div>
                  )}
                  <div className="rounded-2xl p-6 h-full text-center"
                    style={{
                      background: "rgba(15,17,23,0.8)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}>
                    <div className="text-5xl font-black mb-4 leading-none"
                      style={{
                        background: `linear-gradient(135deg, ${s.color}, ${s.color}60)`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}>
                      {s.step}
                    </div>
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                      style={{ background: `${s.color}15`, border: `1px solid ${s.color}30` }}>
                      <Icon className="w-6 h-6" style={{ color: s.color }} />
                    </div>
                    <h3 className="text-white font-black mb-2">{s.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ─────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-white mb-3">FREE vs MEMBERSHIP</h2>
            <p style={{ color: "#64748b" }}>Xem bạn đang bỏ lỡ những gì</p>
          </div>

          <div className="rounded-3xl overflow-hidden shadow-2xl"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
            {/* Header */}
            <div className="grid grid-cols-3 px-6 py-4"
              style={{ background: "rgba(26,31,46,0.95)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="text-sm font-bold" style={{ color: "#64748b" }}>Tính năng</div>
              <div className="text-center text-sm font-bold" style={{ color: "#64748b" }}>Free</div>
              <div className="text-center">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black"
                  style={{ background: "rgba(163,230,53,0.15)", color: "#a3e635" }}>
                  <Crown className="w-3 h-3" /> Membership
                </span>
              </div>
            </div>

            {COMPARISON.map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-3 px-6 py-4 items-center"
                style={{
                  background: i % 2 === 0 ? "rgba(15,17,23,0.6)" : "rgba(26,31,46,0.4)",
                  borderBottom: i < COMPARISON.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                }}
              >
                <div className="text-sm font-medium" style={{ color: "#cbd5e1" }}>{row.feature}</div>
                <div className="flex justify-center">
                  {row.free ? (
                    <div className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(100,116,139,0.15)" }}>
                      <Check className="w-3.5 h-3.5" style={{ color: "#94a3b8" }} />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(239,68,68,0.1)" }}>
                      <span className="text-xs font-bold" style={{ color: "#ef4444" }}>✕</span>
                    </div>
                  )}
                </div>
                <div className="flex justify-center">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center shadow-lg"
                    style={{ background: "rgba(163,230,53,0.15)", border: "1px solid rgba(163,230,53,0.3)" }}>
                    <Check className="w-3.5 h-3.5" style={{ color: "#a3e635" }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="relative rounded-3xl p-10 text-center overflow-hidden"
            style={{
              background: "linear-gradient(145deg, rgba(26,31,46,0.98), rgba(16,21,36,0.98))",
              border: "1px solid rgba(163,230,53,0.25)",
              boxShadow: "0 0 80px rgba(163,230,53,0.08)",
            }}>
            {/* Glow top */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-32 rounded-full"
              style={{ background: "radial-gradient(ellipse, rgba(163,230,53,0.15) 0%, transparent 70%)" }} />

            {/* Top accent line */}
            <div className="absolute top-0 left-0 w-full h-1 rounded-t-3xl"
              style={{ background: "linear-gradient(90deg, #a3e635, #4ade80, #22d3ee, #a3e635)", backgroundSize: "200% auto", animation: "shimmer 3s linear infinite" }} />

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 shadow-xl"
                style={{
                  background: "linear-gradient(135deg, #a3e635, #4ade80)",
                  boxShadow: "0 0 40px rgba(163,230,53,0.4)",
                }}>
                <Package className="w-10 h-10 text-gray-900" />
              </div>

              <h2 className="text-4xl font-black text-white mb-4">
                SẴN SÀNG BẮT ĐẦU?
              </h2>
              <p className="text-lg mb-2" style={{ color: "#94a3b8" }}>
                Chỉ từ <strong style={{ color: "#a3e635" }}>39.000đ/tháng</strong> — ít hơn 1 tô phở.
              </p>
              <p className="text-sm mb-10" style={{ color: "#475569" }}>
                Hoàn tiền 100% trong 7 ngày nếu không hài lòng. Không cần giải thích lý do.
              </p>

              <Link
                to="/membership"
                className="inline-flex items-center justify-center gap-3 h-16 px-12 rounded-2xl font-black text-lg transition-all hover:scale-105 active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #a3e635, #4ade80)",
                  color: "#0f1117",
                  boxShadow: "0 0 40px rgba(163,230,53,0.4)",
                }}
              >
                <Crown className="w-6 h-6" />
                Đăng Ký Membership Ngay
                <ArrowRight className="w-6 h-6" />
              </Link>

              <div className="flex justify-center gap-8 mt-8">
                {[
                  { icon: TrendingUp, text: "Kết quả trong 30 ngày" },
                  { icon: Zap, text: "Thiết lập trong 2 phút" },
                  { icon: Star, text: "4.9★ từ 10K+ người dùng" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs" style={{ color: "#475569" }}>
                    <item.icon className="w-3.5 h-3.5" style={{ color: "#64748b" }} />
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────── */}
      <footer className="py-8 px-6"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(15,17,23,0.8)" }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#a3e635,#4ade80)" }}>
              <Dumbbell className="w-4 h-4 text-gray-900" />
            </div>
            <span className="font-black text-white" style={{ letterSpacing: "0.05em" }}>MEALYUMMY</span>
          </div>
          <p className="text-xs" style={{ color: "#334155" }}>© 2026 MealYummy. Eat Right. Train Hard.</p>
          <Link to="/membership"
            className="text-xs font-semibold transition-colors hover:text-lime-300"
            style={{ color: "#a3e635" }}>
            Xem gói Membership →
          </Link>
        </div>
      </footer>
    </div>
  );
}

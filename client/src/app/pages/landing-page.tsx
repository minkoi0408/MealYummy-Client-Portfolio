import { Link } from "react-router";
import { useState, useEffect, useRef } from "react";
import {
  UtensilsCrossed, Sparkles, Clock, Heart, ChefHat,
  ShoppingCart, Calendar, Trophy, ArrowRight, Star,
  Zap, Users, BookOpen, MapPin, Mail, Phone,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { AppHeader } from "../components/app-header";
import { mockRecipes } from "../data/mock-recipes";

// ─── animated counter hook ────────────────────────────────────────────────────
function useCounter(target: number, duration = 1800, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return value;
}

// ─── constants ────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: Sparkles, label: "AI Gợi ý", title: "Gợi ý món ăn bằng AI",
    desc: "Chỉ cần nói sở thích, AI lập tức tìm món ăn hoàn hảo cho bạn.",
    link: "/app", color: "from-amber-400 to-orange-500", bg: "bg-amber-50", border: "border-amber-200/60",
    img: "https://images.unsplash.com/photo-1756361629888-90596c86fd79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxpY2lvdXMlMjBmb29kJTIwcGxhdGUlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NzI0NDE5MTJ8MA&ixlib=rb-4.1.0&q=80&w=400",
    span: "col-span-2",
  },
  {
    icon: Trophy, label: "Xếp hạng", title: "Top món ăn được yêu thích",
    desc: "Khám phá những công thức hot nhất tuần này.",
    link: "/results", color: "from-green-400 to-emerald-500", bg: "bg-green-50", border: "border-green-200/60",
    img: "https://images.unsplash.com/photo-1765448856945-481569592cf3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVmJTIwY29va2luZyUyMHdvayUyMGZpcmUlMjByZXN0YXVyYW50JTIwa2l0Y2hlbnxlbnwxfHx8fDE3NzI1NTIwOTB8MA&ixlib=rb-4.1.0&q=80&w=400",
    span: "col-span-1",
  },
  {
    icon: Calendar, label: "Thực đơn", title: "Lên thực đơn 3 ngày",
    desc: "Lập kế hoạch bữa ăn cho cả tuần, AI tính calo giúp bạn.",
    link: "/meal-plan", color: "from-blue-400 to-cyan-500", bg: "bg-blue-50", border: "border-blue-200/60",
    img: "https://images.unsplash.com/photo-1692158961713-73690ef06e6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWFsJTIwcGxhbm5pbmclMjByZWNpcGUlMjBub3RlYm9vayUyMGhlYWx0aHl8ZW58MXx8fHwxNzcyNTUyMDkzfDA&ixlib=rb-4.1.0&q=80&w=400",
    span: "col-span-1",
  },
  {
    icon: ShoppingCart, label: "Đi chợ", title: "Danh sách đi chợ thông minh",
    desc: "Tự động tổng hợp nguyên liệu từ thực đơn, không sót thứ gì.",
    link: "/shopping", color: "from-purple-400 to-violet-500", bg: "bg-purple-50", border: "border-purple-200/60",
    img: "https://images.unsplash.com/photo-1767114648647-0c2f3f6cff49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm9jZXJ5JTIwc2hvcHBpbmclMjBiYXNrZXQlMjBmcmVzaCUyMGluZ3JlZGllbnRzfGVufDF8fHx8MTc3MjU1MjA5M3ww&ixlib=rb-4.1.0&q=80&w=400",
    span: "col-span-1",
  },
  {
    icon: Heart, label: "Yêu thích", title: "Lưu món bạn mê",
    desc: "Bộ sưu tập món ăn yêu thích, xem lại bất cứ lúc nào.",
    link: "/dashboard", color: "from-pink-400 to-rose-500", bg: "bg-pink-50", border: "border-pink-200/60",
    img: "https://images.unsplash.com/photo-1638720772346-b745bcd72f5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwZnJlc2glMjBtZWFsfGVufDF8fHx8MTc3MjQ0MTkxM3ww&ixlib=rb-4.1.0&q=80&w=400",
    span: "col-span-1",
  },
];

const STEPS = [
  { n: "01", icon: "💬", title: "Nói sở thích", desc: "Nhập mô tả hoặc chọn tag theo khẩu vị, ngân sách, chế độ ăn..." },
  { n: "02", icon: "✨", title: "AI phân tích", desc: "Hệ thống lọc qua hàng nghìn công thức, tìm ra những món hoàn hảo nhất." },
  { n: "03", icon: "🍽️", title: "Nấu & thưởng thức", desc: "Theo công thức chi tiết, lên thực đơn, rồi đi chợ ngay trong app!" },
];

const STATS = [
  { value: 1000, suffix: "+", label: "Công thức", icon: BookOpen },
  { value: 10,   suffix: "K+", label: "Người dùng", icon: Users },
  { value: 50,   suffix: "K+", label: "Gợi ý / ngày", icon: Zap },
  { value: 49,   suffix: "★", label: "Đánh giá", icon: Star, divisor: 10 },
];

// ─── component ────────────────────────────────────────────────────────────────

export function LandingPage() {
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const c1 = useCounter(1000, 1600, statsVisible);
  const c2 = useCounter(10,   1400, statsVisible);
  const c3 = useCounter(50,   1800, statsVisible);
  const c4 = useCounter(49,   1500, statsVisible);

  const counterValues = [c1, c2, c3, c4];
  const featuredRecipes = mockRecipes.slice(0, 6);

  return (
    <div className="min-h-screen bg-transparent overflow-x-hidden">

      {/* ──────────────────── HEADER ───────────────────────────── */}
      <AppHeader />

      {/* ──────────────────── HERO ─────────────────────────────── */}
      <section className="relative min-h-[calc(100vh-64px)] flex items-center overflow-hidden px-6 py-16">
        {/* Ambient blobs */}
        <div className="absolute top-[-80px] right-[-80px] w-[500px] h-[500px] bg-gradient-to-br from-amber-300/25 to-orange-300/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-40px] left-[-60px] w-[400px] h-[400px] bg-gradient-to-tr from-yellow-200/20 to-amber-200/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* ── Left: copy ───────────────────────────────────────── */}
          <div className="space-y-8 relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200/70 text-amber-600 px-3.5 py-1.5 rounded-full text-sm font-semibold shadow-sm">
              <Sparkles className="w-4 h-4" />
              AI gợi ý món ăn thông minh ✨
            </div>

            {/* Headline */}
            <div>
              <h1 className="text-6xl font-black leading-[1.05] tracking-tight mb-4">
                <span className="block text-foreground">Ăn ngon</span>
                <span className="block bg-gradient-to-r from-amber-500 via-orange-500 to-red-400 bg-clip-text text-transparent">
                  mỗi ngày
                </span>
                <span className="block text-foreground/80">không lo nghĩ</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
                MealYummy dùng AI để gợi ý món ăn theo <strong className="text-foreground">khẩu vị, ngân sách</strong> và <strong className="text-foreground">chế độ dinh dưỡng</strong> của bạn — chỉ trong vài giây.
              </p>
            </div>

            {/* CTA group */}
            <div className="flex flex-wrap gap-3">
              <Link to="/app">
                <button className="flex items-center gap-2 h-12 px-6 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-semibold rounded-2xl shadow-lg shadow-amber-200/60 transition-all active:scale-[0.98] text-sm">
                  <Sparkles className="w-4 h-4" />
                  Gợi ý món ngay
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <Link to="/results">
                <button className="flex items-center gap-2 h-12 px-6 bg-white/80 backdrop-blur-sm border border-amber-200/60 hover:border-amber-300 hover:bg-amber-50/50 text-foreground font-semibold rounded-2xl transition-all text-sm">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  Xem top món ăn
                </button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {[
                { emoji: "⚡", text: "Gợi ý trong 3 giây" },
                { emoji: "🧑‍🍳", text: "1000+ công thức" },
                { emoji: "🌟", text: "Đánh giá 4.9★" },
              ].map(({ emoji, text }) => (
                <div key={text} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <span>{emoji}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: food mosaic ───────────────────────────────── */}
          <div className="hidden lg:grid grid-cols-3 grid-rows-3 gap-3 h-[520px] relative">
            {/* Floating badge 1 */}
            <div className="absolute -top-4 -left-6 z-20 bg-white/90 backdrop-blur-sm border border-amber-200/60 rounded-2xl px-3.5 py-2.5 shadow-xl flex items-center gap-2 animate-float-slow">
              <span className="text-xl">🔥</span>
              <div>
                <p className="text-xs font-bold text-foreground leading-none">Phở bò Hà Nội</p>
                <p className="text-[10px] text-amber-500 mt-0.5">⭐ Phổ biến nhất</p>
              </div>
            </div>
            {/* Floating badge 2 */}
            <div className="absolute -bottom-3 -right-4 z-20 bg-white/90 backdrop-blur-sm border border-green-200/60 rounded-2xl px-3.5 py-2.5 shadow-xl flex items-center gap-2 animate-float-medium">
              <span className="text-xl">✅</span>
              <div>
                <p className="text-xs font-bold text-foreground leading-none">AI tìm ra ngay!</p>
                <p className="text-[10px] text-green-500 mt-0.5">Dưới 3 giây</p>
              </div>
            </div>
            {/* Floating badge 3 */}
            <div className="absolute top-1/2 -right-8 z-20 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl px-3 py-2 shadow-xl text-white animate-float-fast">
              <p className="text-xs font-bold leading-none">10K+ người dùng</p>
              <p className="text-[10px] opacity-80 mt-0.5">Hài lòng 😋</p>
            </div>

            {/* Image cells */}
            <div className="col-span-2 row-span-2 rounded-3xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1757715377459-92ce5a081789?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwZm9vZCUyMHNwcmVhZCUyMGNvbG9yZnVsJTIwb3ZlcmhlYWR8ZW58MXx8fHwxNzcyNTUyMDg4fDA&ixlib=rb-4.1.0&q=80&w=800"
                alt="Vietnamese food spread"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="col-span-1 row-span-1 rounded-2xl overflow-hidden shadow-xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1648912500365-e0930ea34924?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG8lMjBib3dsJTIwdmlldG5hbWVzZSUyMG5vb2RsZSUyMHNvdXAlMjBzdGVhbXxlbnwxfHx8fDE3NzI1NTIwODl8MA&ixlib=rb-4.1.0&q=80&w=400"
                alt="Pho bowl"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="col-span-1 row-span-1 rounded-2xl overflow-hidden shadow-xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1765448856945-481569592cf3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVmJTIwY29va2luZyUyMHdvayUyMGZpcmUlMjByZXN0YXVyYW50JTIwa2l0Y2hlbnxlbnwxfHx8fDE3NzI1NTIwOTB8MA&ixlib=rb-4.1.0&q=80&w=400"
                alt="Chef cooking"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="col-span-2 row-span-1 rounded-2xl overflow-hidden shadow-xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1609811159533-72e7ab01f13c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMGZvb2QlMjBtYXJrZXQlMjBmcmVzaCUyMHZlZ2V0YWJsZXMlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NzI1NTIwODl8MA&ixlib=rb-4.1.0&q=80&w=800"
                alt="Asian food market"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 animate-bounce-slow opacity-60">
          <div className="w-5 h-8 border-2 border-muted-foreground/40 rounded-full flex justify-center pt-1.5">
            <div className="w-1 h-2 bg-muted-foreground/50 rounded-full animate-scroll-dot" />
          </div>
          <span className="text-[10px] text-muted-foreground/50 tracking-widest uppercase">Cuộn xuống</span>
        </div>
      </section>

      {/* ──────────────────── HOW IT WORKS ─────────────────────── */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent via-amber-50/30 to-transparent">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block px-3.5 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full mb-3">Siêu đơn giản</span>
            <h2 className="text-4xl font-black text-foreground mb-3">Chỉ 3 bước thôi</h2>
            <p className="text-muted-foreground">Từ ý tưởng đến bàn ăn — nhanh hơn bạn nghĩ</p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-10 left-[16.5%] right-[16.5%] h-px bg-gradient-to-r from-amber-200 via-orange-300 to-amber-200 z-0" />

            {STEPS.map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center group">
                {/* Number bubble */}
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex flex-col items-center justify-center shadow-lg shadow-amber-200/60 mb-5 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
                  <span className="text-2xl">{step.icon}</span>
                  <span className="text-white/70 text-[10px] font-bold tracking-widest">{step.n}</span>
                </div>
                <h3 className="font-bold text-base text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-[200px]">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/app">
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-semibold rounded-2xl shadow-lg shadow-amber-200/50 transition-all text-sm">
                <Sparkles className="w-4 h-4" />
                Bắt đầu ngay — miễn phí
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ──────────────────── FEATURES BENTO ──────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-3.5 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full mb-3">Đầy đủ tính năng</span>
            <h2 className="text-4xl font-black text-foreground mb-3">5 tính năng của MealYummy</h2>
            <p className="text-muted-foreground">Mọi thứ bạn cần cho bữa ăn hoàn hảo, trong một app duy nhất</p>
          </div>

          {/* Bento grid — row 1: big + small, row 2: small + big */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              const isWide = i === 0;
              return (
                <Link
                  key={f.label}
                  to={f.link}
                  className={`group relative rounded-3xl border overflow-hidden bg-white/70 backdrop-blur-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ${f.border} ${isWide ? "md:col-span-2" : "col-span-1"}`}
                >
                  {/* Image */}
                  <div className="relative overflow-hidden h-48">
                    <ImageWithFallback
                      src={f.img}
                      alt={f.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    {/* Feature badge */}
                    <div className={`absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r ${f.color} text-white text-xs font-semibold shadow-md`}>
                      <Icon className="w-3.5 h-3.5" />
                      {f.label}
                    </div>
                    {i === 0 && (
                      <span className="absolute top-3 right-3 px-2 py-1 bg-white/90 text-amber-700 text-[10px] font-bold rounded-full shadow-sm">
                        ⭐ Chính
                      </span>
                    )}
                  </div>

                  {/* Text */}
                  <div className="p-5">
                    <h3 className="font-bold text-base text-foreground mb-1.5 group-hover:text-amber-700 transition-colors">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                    <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-amber-600 group-hover:gap-2 transition-all">
                      Khám phá <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ──────────────────── STATS & CTA COMBO ────────────────── */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent via-amber-50/20 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            
            {/* ══════════════════ Left: Stats Card ══════════════════ */}
            <div ref={statsRef} className="relative group">
              {/* Glass morphism card */}
              <div className="relative bg-white/80 backdrop-blur-xl rounded-[32px] p-10 border border-amber-200/40 shadow-2xl shadow-amber-500/5 overflow-hidden h-full">
                {/* Gradient accent on top */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400" />
                
                {/* Subtle background pattern */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
                
                {/* Floating gradient orb */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-amber-400/20 to-orange-400/10 rounded-full blur-3xl opacity-60 group-hover:opacity-80 transition-opacity duration-700" />

                <div className="relative">
                  {/* Header */}
                  <div className="mb-10">
                    <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-full border border-amber-200/50">
                      <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 animate-pulse" />
                      <span className="text-xs font-semibold text-amber-700 tracking-wide uppercase">Trusted Platform</span>
                    </div>
                    <h2 className="text-3xl font-black text-foreground mb-2 tracking-tight">
                      Được tin tưởng bởi<br />hàng nghìn người dùng
                    </h2>
                    <p className="text-sm text-muted-foreground">Những con số nói lên chất lượng dịch vụ</p>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {STATS.map((s, i) => {
                      const Icon = s.icon;
                      const raw = counterValues[i];
                      const display = s.divisor ? (raw / s.divisor).toFixed(1) : raw.toLocaleString();
                      return (
                        <div 
                          key={s.label} 
                          className="group/card relative bg-gradient-to-br from-amber-50/80 to-orange-50/60 hover:from-amber-50 hover:to-orange-50 rounded-2xl p-6 border border-amber-200/40 hover:border-amber-300/60 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10 hover:-translate-y-0.5"
                        >
                          {/* Accent line */}
                          <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
                          
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-11 h-11 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-md shadow-amber-500/20 group-hover/card:scale-110 group-hover/card:rotate-3 transition-transform duration-300">
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-3xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-1 leading-none">
                                {display}{s.suffix}
                              </div>
                              <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Trust indicators */}
                  <div className="mt-8 pt-6 border-t border-amber-200/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-300 to-orange-400 border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-md">
                            {["😋", "🤩", "❤️"][i - 1]}
                          </div>
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">Người dùng hài lòng</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ══════════════════ Right: CTA Card ══════════════════ */}
            <div className="relative group">
              {/* Main gradient card */}
              <div className="relative bg-gradient-to-br from-amber-500 via-orange-500 to-orange-600 rounded-[32px] p-10 overflow-hidden shadow-2xl shadow-amber-500/30 h-full flex flex-col justify-center">
                
                {/* Animated background pattern */}
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40" />
                </div>

                {/* Decorative shapes */}
                <div className="absolute -top-16 -right-16 w-56 h-56 bg-white/10 rounded-full blur-3xl animate-pulse-slow" />
                <div className="absolute -bottom-12 -left-12 w-44 h-44 bg-orange-400/20 rounded-full blur-2xl" />
                <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-white/40 rounded-full animate-ping" />
                <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-white/30 rounded-full animate-ping" style={{ animationDelay: "1s" }} />

                <div className="relative z-10 text-center">
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl mb-6 shadow-xl border border-white/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                    <div className="text-5xl">🍜</div>
                  </div>

                  {/* Heading */}
                  <h2 className="text-4xl font-black text-white mb-4 tracking-tight leading-tight">
                    Bắt đầu ăn ngon<br />hôm nay!
                  </h2>
                  
                  {/* Description */}
                  <p className="text-white/90 text-base leading-relaxed max-w-md mx-auto mb-8">
                    Hàng nghìn công thức ngon đang chờ bạn.<br />
                    Để AI tìm ra món hoàn hảo cho bữa ăn tiếp theo.
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                    <Link to="/app" className="w-full sm:w-auto">
                      <button className="w-full sm:w-auto group/btn flex items-center justify-center gap-2.5 px-7 py-4 bg-white hover:bg-white/95 text-amber-600 font-bold rounded-2xl shadow-2xl shadow-black/20 transition-all hover:scale-105 active:scale-100">
                        <Sparkles className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" />
                        <span>Gợi ý món ngay</span>
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </Link>
                    <Link to="/meal-plan" className="w-full sm:w-auto">
                      <button className="w-full sm:w-auto group/btn flex items-center justify-center gap-2 px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl border-2 border-white/30 hover:border-white/50 backdrop-blur-sm transition-all">
                        <Calendar className="w-5 h-5" />
                        <span>Lên thực đơn</span>
                      </button>
                    </Link>
                  </div>

                  {/* Bottom feature tags */}
                  <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                    {[
                      { icon: "⚡", text: "Miễn phí" },
                      { icon: "🔒", text: "Bảo mật" },
                      { icon: "📱", text: "Mọi thiết bị" },
                    ].map(({ icon, text }) => (
                      <div key={text} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/15 backdrop-blur-sm rounded-full border border-white/20 text-white/90 text-xs font-medium">
                        <span>{icon}</span>
                        <span>{text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ──────────────────── RECIPE SHOWCASE ─────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="inline-block px-3.5 py-1 bg-pink-100 text-pink-700 text-xs font-semibold rounded-full mb-3">Công thức nổi bật</span>
              <h2 className="text-4xl font-black text-foreground">Món hot tuần này 🔥</h2>
            </div>
            <Link to="/results" className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors">
              Xem tất cả <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredRecipes.map((recipe, i) => (
              <Link key={recipe.id} to={`/recipe/${recipe.id}`}>
                <div className="group bg-white/70 backdrop-blur-sm border border-amber-100/60 rounded-2xl overflow-hidden hover:shadow-xl hover:border-amber-300/60 hover:-translate-y-1 transition-all duration-300">
                  <div className="relative h-48 overflow-hidden">
                    <ImageWithFallback
                      src={recipe.image}
                      alt={recipe.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    {i < 3 && (
                      <div className="absolute top-3 left-3 w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
                        <span className="text-white font-black text-xs">#{i + 1}</span>
                      </div>
                    )}
                    <span className="absolute top-3 right-3 px-2 py-0.5 bg-white/90 text-xs font-semibold rounded-full shadow-sm text-foreground">
                      {recipe.cuisine}
                    </span>
                    <p className="absolute bottom-3 left-3 right-3 text-white font-bold text-base line-clamp-1 drop-shadow">
                      {recipe.name}
                    </p>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">{recipe.description}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-amber-400" />{recipe.cookTime}</span>
                      <span className="flex items-center gap-1"><ChefHat className="w-3.5 h-3.5 text-muted-foreground/50" />{recipe.difficulty}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────── FOOTER ───────────────────────────── */}
      <footer className="relative bg-gradient-to-br from-amber-50/80 via-orange-50/60 to-amber-50/80 border-t border-amber-200/50 py-12 px-6 backdrop-blur-sm overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-200/20 to-orange-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-yellow-200/15 to-amber-200/15 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative">
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            
            {/* Brand column */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
                  <UtensilsCrossed className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="font-bold text-base text-foreground">MealYummy</span>
                  <span className="text-[10px] text-amber-500/70 tracking-wide italic">Ăn Ngon Mê Ly</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Ứng dụng gợi ý món ăn thông minh với AI, giúp bạn lên thực đơn và đi chợ dễ dàng.
              </p>
              <div className="flex gap-2">
                {["🔥", "✨", "🍜"].map((emoji, i) => (
                  <div key={i} className="w-9 h-9 bg-white/80 border border-amber-200/60 rounded-xl flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
                    <span className="text-lg">{emoji}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tính năng */}
            <div>
              <h3 className="font-bold text-sm text-foreground mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Tính năng
              </h3>
              <ul className="space-y-2.5">
                {[
                  { label: "Gợi ý AI", to: "/app" },
                  { label: "Xếp hạng món", to: "/results" },
                  { label: "Món yêu thích", to: "/dashboard" },
                  { label: "Lên thực đơn", to: "/meal-plan" },
                  { label: "Danh sách đi chợ", to: "/shopping" },
                ].map(({ label, to }) => (
                  <li key={to}>
                    <Link to={to} className="text-sm text-muted-foreground hover:text-amber-600 hover:translate-x-1 inline-block transition-all">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Hỗ trợ */}
            <div>
              <h3 className="font-bold text-sm text-foreground mb-4 flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-500" />
                Hỗ trợ
              </h3>
              <ul className="space-y-2.5">
                {[
                  { label: "Trung tâm trợ giúp", to: "#" },
                  { label: "Hướng dẫn sử dụng", to: "#" },
                  { label: "Câu hỏi thường gặp", to: "#" },
                  { label: "Liên hệ", to: "#" },
                  { label: "Báo cáo lỗi", to: "#" },
                ].map(({ label, to }) => (
                  <li key={label}>
                    <a href={to} className="text-sm text-muted-foreground hover:text-amber-600 hover:translate-x-1 inline-block transition-all">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Liên hệ */}
            <div>
              <h3 className="font-bold text-sm text-foreground mb-4 flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-500" />
                Liên hệ
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>support@mealyummy.vn</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>1900 1234</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>Hà Nội, Việt Nam</span>
                </li>
              </ul>
              <div className="mt-4 pt-4 border-t border-amber-200/50">
                <p className="text-xs text-muted-foreground mb-2">Tải app ngay:</p>
                <div className="flex gap-2">
                  <div className="px-3 py-1.5 bg-white border border-amber-200/60 rounded-lg text-xs font-semibold text-foreground hover:shadow-md transition-shadow cursor-pointer">
                    📱 iOS
                  </div>
                  <div className="px-3 py-1.5 bg-white border border-amber-200/60 rounded-lg text-xs font-semibold text-foreground hover:shadow-md transition-shadow cursor-pointer">
                    🤖 Android
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-amber-200/50 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <a href="#" className="hover:text-amber-600 transition-colors">Điều khoản dịch vụ</a>
              <span>•</span>
              <a href="#" className="hover:text-amber-600 transition-colors">Chính sách bảo mật</a>
              <span>•</span>
              <a href="#" className="hover:text-amber-600 transition-colors">Cookie</a>
            </div>
            <p className="text-xs text-muted-foreground">
              © 2026 MealYummy. Tất cả quyền được bảo lưu. Made with <span className="text-red-500">❤️</span> in Vietnam
            </p>
          </div>
        </div>
      </footer>

      {/* CSS Animations */}
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(1deg); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(-1deg); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(6px); }
        }
        @keyframes scroll-dot {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(8px); opacity: 0; }
        }
        .animate-float-slow { animation: float-slow 5s ease-in-out infinite; }
        .animate-float-medium { animation: float-medium 4s ease-in-out infinite 0.8s; }
        .animate-float-fast { animation: float-fast 3.5s ease-in-out infinite 0.4s; }
        .animate-bounce-slow { animation: bounce-slow 2.5s ease-in-out infinite; }
        .animate-scroll-dot { animation: scroll-dot 1.5s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
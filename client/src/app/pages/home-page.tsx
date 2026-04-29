import { Link } from "react-router";
import { useCallback, useRef, lazy, Suspense } from "react";
import { Button } from "../components/ui/button";
import {
  Sparkles,
  BookOpen,
  Heart,
  Calendar,
  ShoppingCart,
  Zap,
  Target,
  Flame,
  Dumbbell,
  Apple,
  ChevronRight,
  Star,
} from "lucide-react";
import { AppHeader } from "../components/app-header";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useInView,
} from "motion/react";
import { useVisibility } from "../../hooks/useVisibility";

// Lazy load heavy Three.js components
const ThreeRobotScene = lazy(() => import("../components/three-robot-scene").then(m => ({ default: m.ThreeRobotScene })));
const ThreeHeroBg = lazy(() => import("../components/three-hero-bg").then(m => ({ default: m.ThreeHeroBg })));
const ThreeFoodOrbit = lazy(() => import("../components/three-food-orbit").then(m => ({ default: m.ThreeFoodOrbit })));

// ─── 3D tilt hook ─────────────────────────────────────────────────────────────
function useTilt3D(strength = 14) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [strength, -strength]), { stiffness: 280, damping: 28 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-strength, strength]), { stiffness: 280, damping: 28 });
  const scale = useSpring(1, { stiffness: 280, damping: 24 });
  const glowX = useTransform(x, [-0.5, 0.5], [0, 100]);
  const glowY = useTransform(y, [-0.5, 0.5], [0, 100]);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
    scale.set(1.04);
  }, [x, y, scale]);

  const onMouseLeave = useCallback(() => {
    x.set(0); y.set(0); scale.set(1);
  }, [x, y, scale]);

  return { rotateX, rotateY, scale, glowX, glowY, onMouseMove, onMouseLeave };
}

// ─── FadeUp scroll-reveal ──────────────────────────────────────────────────────
function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, filter: "blur(6px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Visibility-aware Three.js wrapper (only render when on-screen) ───────────
function VisibleThreeFoodOrbit() {
  const { ref, isVisible } = useVisibility();
  return (
    <div ref={ref} style={{ minHeight: 460 }}>
      {isVisible ? <ThreeFoodOrbit className="w-full" /> : (
        <div className="w-full flex items-center justify-center" style={{ height: 460 }}>
          <div className="text-4xl animate-pulse">🍲</div>
        </div>
      )}
    </div>
  );
}

const features = [
  {
    id: 1,
    icon: Sparkles,
    title: "Gợi ý bằng AI",
    description: "AI phân tích mục tiêu fitness và gợi ý lịch ăn phù hợp với chế độ tập luyện của bạn.",
    gradient: "linear-gradient(135deg, #a3e635, #4ade80)",
    glowColor: "rgba(163,230,53,0.25)",
    link: "/app",
    badge: "Chính",
  },
  {
    id: 2,
    icon: BookOpen,
    title: "Chi tiết món ăn",
    description: "Thành phần, macro dinh dưỡng (Protein / Carb / Fat) và calo chi tiết từng món.",
    gradient: "linear-gradient(135deg, #22d3ee, #6366f1)",
    glowColor: "rgba(34,211,238,0.25)",
    link: "/results",
  },
  {
    id: 3,
    icon: Heart,
    title: "Món yêu thích",
    description: "Lưu lại các món ăn sạch phù hợp với thể trạng và lưu vào danh sách cá nhân.",
    gradient: "linear-gradient(135deg, #f472b6, #ec4899)",
    glowColor: "rgba(244,114,182,0.25)",
    link: "/dashboard",
  },
  {
    id: 4,
    icon: Calendar,
    title: "Thực đơn tuần",
    description: "Tạo meal plan tự động 7 ngày. AI cân bằng calo và macro theo mục tiêu thể hình.",
    gradient: "linear-gradient(135deg, #60a5fa, #818cf8)",
    glowColor: "rgba(96,165,250,0.25)",
    link: "/meal-plan",
  },
  {
    id: 5,
    icon: ShoppingCart,
    title: "Danh sách đi chợ",
    description: "Tự động tổng hợp nguyên liệu từ thực đơn. Biết chính xác cần mua gì.",
    gradient: "linear-gradient(135deg, #a78bfa, #c084fc)",
    glowColor: "rgba(167,139,250,0.25)",
    link: "/shopping",
  },
];

const stats = [
  { value: "500+", label: "Công thức High-Protein", icon: Dumbbell },
  { value: "98%", label: "Calo chính xác", icon: Flame },
  { value: "7-Day", label: "Meal Prep Plan", icon: Calendar },
  { value: "4.9★", label: "Đánh giá từ VĐV", icon: Star },
];


const testimonials = [
  {
    name: "Minh Hiếu",
    role: "Powerlifter · 3 năm",
    text: "MealYummy giúp mình track macro cực kỳ dễ. Tăng 8kg cơ sau 6 tháng dùng app.",
    avatar: "MH",
    rating: 5,
  },
  {
    name: "Thu Hà",
    role: "CrossFit Athlete · 2 năm",
    text: "Meal plan tự động tiết kiệm cả tiếng mỗi tuần. Chế độ ăn khoa học hơn hẳn.",
    avatar: "TH",
    rating: 5,
  },
  {
    name: "Bảo Long",
    role: "Runner · Marathon",
    text: "AI gợi ý đúng nhu cầu carb trước race và protein phục hồi sau chạy. Tuyệt vời!",
    avatar: "BL",
    rating: 5,
  },
];

// ─── Star Marquee (infinite scrolling star conveyor belt) ─────────────────────
function StarMarquee({ direction = "left", speed = 30 }: { direction?: "left" | "right"; speed?: number }) {
  const stars = Array.from({ length: 20 }, (_, i) => i);
  return (
    <div className="relative w-full overflow-hidden py-3" style={{ maskImage: "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)" }}>
      <motion.div
        className="flex gap-2 w-max"
        animate={{ x: direction === "left" ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        {[...stars, ...stars].map((_, i) => {
          const colors = ["#a3e635", "#fbbf24", "#fb923c", "#4ade80", "#60a5fa", "#f472b6", "#a78bfa"];
          const color = colors[i % colors.length];
          const size = 10 + (i % 4) * 4;
          return (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.3, 1],
                rotate: [0, 15, -15, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2 + (i % 3) * 0.5,
                repeat: Infinity,
                delay: (i % 7) * 0.3,
                ease: "easeInOut",
              }}
              className="flex-shrink-0"
            >
              <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z" />
              </svg>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

// ─── Rainbow Border Button ────────────────────────────────────────────────────
function RainbowButton({ children, className = "", ...props }: React.ComponentProps<typeof Link>) {
  return (
    <Link {...props} className={`group relative inline-block ${className}`}>
      {/* Rotating rainbow border */}
      <div
        className="absolute -inset-[2px] rounded-2xl opacity-80 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: "conic-gradient(from var(--rainbow-angle, 0deg), #ff0000, #ff8800, #ffff00, #00ff00, #0088ff, #8800ff, #ff00ff, #ff0000)",
          animation: "rainbowSpin 3s linear infinite",
          filter: "blur(1px)",
        }}
      />
      {/* Glow layer */}
      <div
        className="absolute -inset-[2px] rounded-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-300"
        style={{
          background: "conic-gradient(from var(--rainbow-angle, 0deg), #ff0000, #ff8800, #ffff00, #00ff00, #0088ff, #8800ff, #ff00ff, #ff0000)",
          animation: "rainbowSpin 3s linear infinite",
          filter: "blur(12px)",
        }}
      />
      {/* Inner button */}
      <div
        className="relative h-14 px-10 flex items-center justify-center gap-2 rounded-xl font-black text-gray-900 transition-all group-hover:scale-[1.02]"
        style={{
          background: "linear-gradient(135deg, #a3e635, #4ade80)",
          fontSize: "1.1rem",
          letterSpacing: "0.05em",
        }}
      >
        {children}
      </div>
    </Link>
  );
}

// ─── TestimonialCard with 3D tilt ─────────────────────────────────────────────
function TestimonialCard({ t, delay }: { t: typeof testimonials[0]; delay: number }) {
  const tilt = useTilt3D(12);
  return (
    <FadeUp delay={delay}>
      <motion.div
        style={{
          perspective: 1000,
          rotateX: tilt.rotateX,
          rotateY: tilt.rotateY,
          scale: tilt.scale,
          transformStyle: "preserve-3d",
          background: "rgba(26,31,46,0.9)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
        onMouseMove={tilt.onMouseMove}
        onMouseLeave={tilt.onMouseLeave}
        whileHover={{ borderColor: "rgba(163,230,53,0.25)", boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(163,230,53,0.08)" }}
        className="rounded-2xl p-6 relative overflow-hidden cursor-default"
      >
        {/* Animated Stars */}
        <div className="flex gap-0.5 mb-4">
          {Array.from({ length: t.rating }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: delay + i * 0.1, type: "spring", stiffness: 400, damping: 10 }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.25, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              >
                <Star className="w-4 h-4 text-lime-400 fill-lime-400 drop-shadow-[0_0_4px_rgba(163,230,53,0.6)]" />
              </motion.div>
            </motion.div>
          ))}
        </div>
        <p className="text-slate-300 text-sm leading-relaxed mb-5">"{t.text}"</p>
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.2, rotate: 8 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-black text-gray-900 flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #a3e635, #4ade80)" }}
          >
            {t.avatar}
          </motion.div>
          <div>
            <p className="text-white font-semibold text-sm">{t.name}</p>
            <p className="text-slate-500 text-xs">{t.role}</p>
          </div>
        </div>
      </motion.div>
    </FadeUp>
  );
}

export function HomePage() {
  return (
    <div className="min-h-screen bg-transparent">
      <AppHeader />

      {/* ── HERO SECTION ──────────────────────────────────── */}
      <section className="relative py-20 px-6 overflow-hidden">
        {/* Three.js animated background */}
        <Suspense fallback={null}>
          <ThreeHeroBg />
        </Suspense>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="relative z-10"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                style={{
                  background: "rgba(163,230,53,0.1)",
                  border: "1px solid rgba(163,230,53,0.3)",
                }}
              >
                <Zap className="w-4 h-4 text-lime-400" />
                <span className="text-lime-400 text-sm font-semibold tracking-wide">AI-POWERED NUTRITION</span>
              </div>

              {/* Heading */}
              <h1
                className="text-6xl lg:text-7xl font-black leading-none mb-6"
              >
                <span className="text-white">ĂN ĐÚNG.</span>
                <br />
                <span className="text-lime-400">
                  TẬP HIỆU QUẢ.
                </span>
              </h1>

              <p className="text-lg text-slate-400 mb-8 leading-relaxed max-w-lg">
                Nền tảng dinh dưỡng thông minh dành riêng cho người tập thể thao. AI của chúng tôi lập thực đơn phù hợp với mục tiêu thể hình và lịch tập của bạn.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4">
                <Link to="/app">
                  <Button
                    size="lg"
                    className="h-14 px-8 text-base font-bold rounded-xl text-gray-900 border-0 shadow-lg hover:scale-105 transition-all"
                    style={{
                      background: "linear-gradient(135deg, #a3e635, #4ade80)",
                      boxShadow: "0 0 30px rgba(163,230,53,0.4)",
                    }}
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Bắt đầu ngay
                  </Button>
                </Link>
                <Link to="/meal-plan">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 px-8 text-base font-semibold rounded-xl border-slate-600 text-slate-300 hover:bg-white/5 hover:text-white transition-all"
                  >
                    <Target className="w-5 h-5 mr-2 text-lime-400" />
                    Tạo Meal Plan
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Right — Three.js Robot Chef Scene */}
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.85, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative hidden lg:flex items-center justify-center"
              style={{ minHeight: 460 }}
            >
              <Suspense fallback={
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full" style={{ background: "radial-gradient(circle, rgba(163,230,53,0.15) 0%, transparent 70%)" }}>
                    <div className="w-full h-full flex items-center justify-center text-4xl animate-pulse">🍔</div>
                  </div>
                </div>
              }>
                <ThreeRobotScene className="w-full h-full" />
              </Suspense>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── STATS SECTION ──────────────────────────────────── */}
      <section className="py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl overflow-hidden"
            style={{ background: "rgba(163,230,53,0.08)", border: "1px solid rgba(163,230,53,0.12)" }}
          >
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center gap-2 py-8 px-4 text-center"
                  style={{ background: "#0f1117" }}
                >
                  <Icon className="w-6 h-6 text-lime-400 mb-1" />
                  <p
                    className="text-3xl font-black"
                    style={{
                      background: "linear-gradient(90deg, #a3e635, #4ade80)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-sm text-slate-400 font-medium">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FEATURES SECTION ──────────────────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
              style={{ background: "rgba(163,230,53,0.08)", border: "1px solid rgba(163,230,53,0.2)" }}>
              <Apple className="w-4 h-4 text-lime-400" />
              <span className="text-lime-400 text-xs font-bold uppercase tracking-widest">5 Tính Năng</span>
            </div>
            <h2
              className="text-4xl lg:text-5xl font-black text-white mb-3"
            >
              CÔNG CỤ DINH DƯỠNG
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Tất cả công cụ bạn cần để tối ưu chế độ ăn, hỗ trợ quá trình tập luyện và phục hồi.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                >
                  <Link to={feature.link}>
                    <div
                      className="group relative rounded-2xl p-6 h-full cursor-pointer transition-all duration-300 hover:-translate-y-1"
                      style={{
                        background: "rgba(26,31,46,0.8)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLDivElement).style.border = `1px solid ${feature.glowColor.replace("0.25", "0.5")}`;
                        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 32px rgba(0,0,0,0.4), 0 0 24px ${feature.glowColor}`;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLDivElement).style.border = "1px solid rgba(255,255,255,0.06)";
                        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 24px rgba(0,0,0,0.3)";
                      }}
                    >
                      {feature.badge && (
                        <span
                          className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-gray-900 uppercase tracking-wide"
                          style={{ background: "linear-gradient(135deg, #a3e635, #4ade80)" }}
                        >
                          {feature.badge}
                        </span>
                      )}

                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300"
                        style={{ background: feature.gradient, boxShadow: `0 8px 20px ${feature.glowColor}` }}
                      >
                        <Icon className="w-7 h-7 text-white" />
                      </div>

                      <h3 className="text-white font-bold text-base mb-2 leading-tight">{feature.title}</h3>
                      <p className="text-slate-500 text-xs leading-relaxed">{feature.description}</p>

                      <div className="mt-4 flex items-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: "#a3e635" }}>
                        <span>Khám phá</span>
                        <ChevronRight className="w-3 h-3" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

          {/* Three.js Food Orbit Scene */}
          <div className="mt-16">
            <div className="text-center mb-6">
              <span
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
                style={{ background: "rgba(251,146,60,0.1)", border: "1px solid rgba(251,146,60,0.25)", color: "#fb923c" }}
              >
                🍲 3D Food Universe
              </span>
            </div>
            <Suspense fallback={
              <div className="w-full flex items-center justify-center" style={{ height: 460 }}>
                <div className="text-4xl animate-pulse">🍲</div>
              </div>
            }>
              <VisibleThreeFoodOrbit />
            </Suspense>
          </div>
      </section>

      {/* ── MACRO TRACKER BANNER ──────────────────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div
            className="rounded-3xl p-10 lg:p-14 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(26,31,46,0.95) 0%, rgba(15,17,23,0.95) 100%)",
              border: "1px solid rgba(163,230,53,0.2)",
              boxShadow: "0 0 80px rgba(163,230,53,0.08)",
            }}
          >
            {/* Decorative glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 rounded-full"
              style={{ background: "radial-gradient(ellipse, rgba(163,230,53,0.08) 0%, transparent 70%)" }}
            />

            <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5"
                  style={{ background: "rgba(163,230,53,0.1)", border: "1px solid rgba(163,230,53,0.25)" }}>
                  <Target className="w-3.5 h-3.5 text-lime-400" />
                  <span className="text-lime-400 text-xs font-bold uppercase tracking-widest">Macro Tracker</span>
                </div>
                <h2
                  className="text-4xl lg:text-5xl font-black text-white mb-4"
                >
                  TRACK MACRO<br />
                  <span className="text-lime-400">
                    THÔNG MINH HƠN
                  </span>
                </h2>
                <p className="text-slate-400 text-base mb-8 leading-relaxed">
                  Không chỉ đếm calo — MealYummy phân tích chi tiết Protein, Carbohydrate và Fat để bạn đạt mục tiêu thể hình nhanh nhất.
                </p>
                <Link to="/app">
                  <Button
                    className="h-12 px-7 font-bold rounded-xl text-gray-900 border-0 hover:scale-105 transition-all"
                    style={{
                      background: "linear-gradient(135deg, #a3e635, #4ade80)",
                      boxShadow: "0 0 24px rgba(163,230,53,0.35)",
                    }}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Thử ngay miễn phí
                  </Button>
                </Link>
              </div>

              {/* Macro visual */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Protein", pct: 35, color: "#a3e635", desc: "Phục hồi cơ", icon: "💪" },
                  { label: "Carbs", pct: 45, color: "#60a5fa", desc: "Năng lượng tập", icon: "⚡" },
                  { label: "Fat", pct: 20, color: "#f472b6", desc: "Nội tiết tố", icon: "🫀" },
                ].map((m) => (
                  <div key={m.label}
                    className="rounded-2xl p-5 flex flex-col items-center text-center"
                    style={{
                      background: `${m.color}0d`,
                      border: `1px solid ${m.color}30`,
                    }}
                  >
                    <span className="text-2xl mb-2">{m.icon}</span>
                    <p className="text-2xl font-black" style={{ color: m.color }}>
                      {m.pct}%
                    </p>
                    <p className="text-white font-bold text-sm mt-1">{m.label}</p>
                    <p className="text-slate-500 text-xs mt-1">{m.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS SECTION ──────────────────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-4">
            <h2
              className="text-4xl font-black text-white mb-2"
            >
              VĐV NÓI GÌ VỀ CHÚNG TÔI?
            </h2>
            <p className="text-slate-500">Hơn 10,000+ người tập hài lòng</p>
          </div>

          {/* Star marquee conveyor belt */}
          <StarMarquee direction="left" speed={25} />

          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <TestimonialCard key={i} t={t} delay={i * 0.12} />
            ))}
          </div>

          {/* Second star marquee going opposite direction */}
          <StarMarquee direction="right" speed={30} />
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 shadow-lg"
            style={{
              background: "linear-gradient(135deg, #a3e635, #4ade80)",
              boxShadow: "0 0 40px rgba(163,230,53,0.4)",
            }}
          >
            <Dumbbell className="w-8 h-8 text-gray-900" />
          </div>
          <h2
            className="text-5xl font-black text-white mb-4"
          >
            SẴN SÀNG BẮT ĐẦU?
          </h2>
          <p className="text-slate-400 text-lg mb-8">
            Tham gia cùng hàng ngàn VĐV đang tối ưu hóa chế độ dinh dưỡng với MealYummy.
          </p>
          <RainbowButton to="/app">
            <Sparkles className="w-5 h-5" />
            BẮT ĐẦU MIỄN PHÍ
          </RainbowButton>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────── */}
      <footer
        className="py-8 px-6"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(15,17,23,0.8)",
        }}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #a3e635, #4ade80)" }}
            >
              <Dumbbell className="w-4 h-4 text-gray-900" />
            </div>
            <span
              className="font-black text-white"
              style={{ letterSpacing: "0.05em" }}
            >
              MEALYUMMY
            </span>
          </div>
          <p className="text-slate-600 text-sm">© 2026 MealYummy. Eat Right. Train Hard.</p>
        </div>
      </footer>
    </div>
  );
}
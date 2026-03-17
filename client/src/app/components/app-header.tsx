import { Link, useLocation } from "react-router";
import { useEffect, useState } from "react";
import {
  Sparkles,
  Trophy,
  Heart,
  Calendar,
  History,
  Dumbbell,
  ShoppingCart,
  User,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Gợi ý", icon: Sparkles, link: "/app", activeColor: "text-lime-400", activeBg: "bg-lime-950/60", dot: "bg-lime-400" },
  { label: "Xếp hạng", icon: Trophy, link: "/results", activeColor: "text-amber-400", activeBg: "bg-amber-950/60", dot: "bg-amber-400" },
  { label: "Yêu thích", icon: Heart, link: "/dashboard", activeColor: "text-pink-400", activeBg: "bg-pink-950/60", dot: "bg-pink-400" },
  { label: "Gym", icon: Dumbbell, link: "/gym", activeColor: "text-lime-300", activeBg: "bg-lime-950/60", dot: "bg-lime-300" },
  { label: "Thực đơn", icon: Calendar, link: "/meal-plan", activeColor: "text-cyan-400", activeBg: "bg-cyan-950/60", dot: "bg-cyan-400" },
  { label: "Lịch sử", icon: History, link: "/history", activeColor: "text-slate-200", activeBg: "bg-slate-800/60", dot: "bg-slate-200" },
  { label: "Đi chợ", icon: ShoppingCart, link: "/shopping", activeColor: "text-violet-400", activeBg: "bg-violet-950/60", dot: "bg-violet-400" },
];

export function AppHeader() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("mealyummy-theme");
    const dark = saved ? saved === "dark" : true;
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  function toggleTheme() {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem("mealyummy-theme", next ? "dark" : "light");
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  }

  return (
    <>
      <header
        className="sticky top-0 z-50"
        style={{
          background: isDark ? "rgba(15,17,23,0.85)" : "rgba(255,254,249,0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: isDark ? "1px solid rgba(163,230,53,0.12)" : "1px solid rgba(0,0,0,0.08)",
          boxShadow: isDark ? "0 4px 24px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.10)",
          transition: "background-color 220ms ease, border-color 220ms ease, box-shadow 220ms ease",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center gap-2 sm:gap-4">

          {/* ── Logo ─────────────────────────────────────── */}
          <Link to="/home" className="flex items-center gap-2 sm:gap-2.5 group flex-shrink-0">
            <img
              src="/logo.svg"
              alt="MealYummy Logo"
              className="w-8 h-8 sm:w-9 sm:h-9 object-contain group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col leading-none">
              <span
                className="font-bold text-sm sm:text-base leading-tight"
                style={{
                  background: isDark
                    ? "linear-gradient(90deg, #a3e635, #4ade80)"
                    : "linear-gradient(90deg, #fbbf24, #fb923c)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: "0.02em",
                }}
              >
                MealYummy
              </span>
              <span
                className="hidden sm:block text-[10px] tracking-widest italic"
                style={{ color: isDark ? "rgba(163,230,53,0.6)" : "rgba(245,158,11,0.55)" }}
              >
                EAT RIGHT. TRAIN HARD.
              </span>
            </div>
          </Link>

          {/* ── Divider (desktop only) ──────────────────────────────────── */}
          <div className="hidden lg:block w-px h-7 flex-shrink-0 mx-1" style={{ background: "rgba(163,230,53,0.15)" }} />

          {/* ── Nav items (desktop) ────────────────────────────────── */}
          <nav className="hidden lg:flex items-center gap-1 flex-1">
            {NAV_ITEMS.map(({ label, icon: Icon, link, activeColor, activeBg, dot }) => {
              const isActive = location.pathname === link;
              return (
                <Link
                  key={link}
                  to={link}
                  className={`
                    relative flex items-center gap-2 px-3.5 py-2 rounded-xl
                    text-sm font-medium transition-all select-none
                    ${isActive
                      ? `${activeColor} ${activeBg} shadow-sm`
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                    }
                  `}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "scale-110" : ""} transition-transform`} />
                  <span>{label}</span>
                  {/* Active dot indicator */}
                  {isActive && (
                    <span className={`absolute -bottom-[9px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${dot}`} />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ── User profile & Mobile menu toggle ─────────────────────────────── */}
          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all hover:scale-105"
              aria-label="Toggle theme"
              title={isDark ? "Chuyển sang sáng" : "Chuyển sang tối"}
              style={{
                background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                border: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(0,0,0,0.08)",
                transition: "background-color 220ms ease, border-color 220ms ease, transform 150ms ease",
              }}
            >
              {isDark ? (
                <Moon className="w-4 h-4" style={{ color: "rgba(226,232,240,0.9)" }} />
              ) : (
                <Sun className="w-4 h-4" style={{ color: "#f59e0b" }} />
              )}
            </button>

            <Link to="/profile" className="flex-shrink-0">
              <div
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center hover:scale-105 transition-all cursor-pointer"
                style={{
                  background: isDark
                    ? "linear-gradient(135deg, rgba(163,230,53,0.15), rgba(74,222,128,0.15))"
                    : "linear-gradient(135deg, rgba(251,191,36,0.18), rgba(251,146,60,0.14))",
                  border: isDark ? "1px solid rgba(163,230,53,0.3)" : "1px solid rgba(251,191,36,0.40)",
                }}
              >
                <User className="w-4 h-4" style={{ color: isDark ? "#a3e635" : "#f59e0b" }} />
              </div>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
              aria-label="Toggle menu"
              style={{ background: mobileMenuOpen ? (isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)") : "transparent" }}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" style={{ color: isDark ? "#cbd5e1" : "#334155" }} />
              ) : (
                <Menu className="w-5 h-5" style={{ color: isDark ? "#cbd5e1" : "#334155" }} />
              )}
            </button>
          </div>

        </div>

        {/* ── Mobile Navigation Menu ────────────────────────────────── */}
        {mobileMenuOpen && (
          <div
            className="lg:hidden"
            style={{
              borderTop: isDark ? "1px solid rgba(163,230,53,0.12)" : "1px solid rgba(0,0,0,0.08)",
              background: isDark ? "rgba(15,17,23,0.97)" : "rgba(255,254,249,0.97)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            <nav className="max-w-7xl mx-auto px-4 py-3 space-y-1">
              {NAV_ITEMS.map(({ label, icon: Icon, link, activeColor, activeBg }) => {
                const isActive = location.pathname === link;
                return (
                  <Link
                    key={link}
                    to={link}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl
                      text-sm font-medium transition-all
                      ${isActive
                        ? `${activeColor} ${activeBg} shadow-sm`
                        : isDark
                          ? "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                          : "text-slate-600 hover:text-slate-900 hover:bg-black/5"
                      }
                    `}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "scale-110" : ""} transition-transform`} />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}

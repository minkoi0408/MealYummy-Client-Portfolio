import { Link, useLocation } from "react-router";
import { useState } from "react";
import {
  Dumbbell,
  Sparkles,
  Trophy,
  Heart,
  Calendar,
  ShoppingCart,
  User,
  Menu,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Gợi ý", icon: Sparkles, link: "/app", activeColor: "text-lime-400", activeBg: "bg-lime-950/60", dot: "bg-lime-400" },
  { label: "Xếp hạng", icon: Trophy, link: "/results", activeColor: "text-amber-400", activeBg: "bg-amber-950/60", dot: "bg-amber-400" },
  { label: "Yêu thích", icon: Heart, link: "/dashboard", activeColor: "text-pink-400", activeBg: "bg-pink-950/60", dot: "bg-pink-400" },
  { label: "Thực đơn", icon: Calendar, link: "/meal-plan", activeColor: "text-cyan-400", activeBg: "bg-cyan-950/60", dot: "bg-cyan-400" },
  { label: "Đi chợ", icon: ShoppingCart, link: "/shopping", activeColor: "text-violet-400", activeBg: "bg-violet-950/60", dot: "bg-violet-400" },
];

export function AppHeader() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header
        className="sticky top-0 z-50"
        style={{
          background: "rgba(15,17,23,0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(163,230,53,0.12)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center gap-2 sm:gap-4">

          {/* ── Logo ─────────────────────────────────────── */}
          <Link to="/home" className="flex items-center gap-2 sm:gap-2.5 group flex-shrink-0">
            <div
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform"
              style={{
                background: "linear-gradient(135deg, #a3e635, #4ade80)",
                boxShadow: "0 0 16px rgba(163,230,53,0.4)",
              }}
            >
              <Dumbbell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-900" />
            </div>
            <div className="flex flex-col leading-none">
              <span
                className="font-bold text-sm sm:text-base leading-tight"
                style={{
                  background: "linear-gradient(90deg, #a3e635, #4ade80)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: "0.02em",
                }}
              >
                MealYummy
              </span>
              <span className="hidden sm:block text-[10px] text-lime-500/60 tracking-widest italic">
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
            <Link to="/profile" className="flex-shrink-0">
              <div
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center hover:scale-105 transition-all cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, rgba(163,230,53,0.15), rgba(74,222,128,0.15))",
                  border: "1px solid rgba(163,230,53,0.3)",
                }}
              >
                <User className="w-4 h-4 text-lime-400" />
              </div>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-slate-300" />
              ) : (
                <Menu className="w-5 h-5 text-slate-300" />
              )}
            </button>
          </div>

        </div>

        {/* ── Mobile Navigation Menu ────────────────────────────────── */}
        {mobileMenuOpen && (
          <div
            className="lg:hidden"
            style={{
              borderTop: "1px solid rgba(163,230,53,0.12)",
              background: "rgba(15,17,23,0.97)",
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
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
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

import { Link, useLocation } from "react-router";
import { useState } from "react";
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
  Lightbulb
} from "lucide-react";
import { useBrightness } from "../contexts/brightness-context";

const NAV_ITEMS = [
  { label: "Gợi ý", icon: Sparkles, link: "/app", activeColor: "text-lime-400", activeBg: "bg-lime-950/60", dot: "bg-lime-400", activeColorBright: "text-lime-700", activeBgBright: "bg-lime-100" },
  { label: "Xếp hạng", icon: Trophy, link: "/results", activeColor: "text-amber-400", activeBg: "bg-amber-950/60", dot: "bg-amber-400", activeColorBright: "text-amber-700", activeBgBright: "bg-amber-100" },
  { label: "Yêu thích", icon: Heart, link: "/dashboard", activeColor: "text-pink-400", activeBg: "bg-pink-950/60", dot: "bg-pink-400", activeColorBright: "text-pink-700", activeBgBright: "bg-pink-100" },
  { label: "Gym", icon: Dumbbell, link: "/gym", activeColor: "text-lime-300", activeBg: "bg-lime-950/60", dot: "bg-lime-300", activeColorBright: "text-lime-700", activeBgBright: "bg-lime-100" },
  { label: "Thực đơn", icon: Calendar, link: "/meal-plan", activeColor: "text-cyan-400", activeBg: "bg-cyan-950/60", dot: "bg-cyan-400", activeColorBright: "text-cyan-700", activeBgBright: "bg-cyan-100" },
  { label: "Lịch sử", icon: History, link: "/history", activeColor: "text-slate-200", activeBg: "bg-slate-800/60", dot: "bg-slate-200", activeColorBright: "text-slate-700", activeBgBright: "bg-slate-200" },
  { label: "Đi chợ", icon: ShoppingCart, link: "/shopping", activeColor: "text-violet-400", activeBg: "bg-violet-950/60", dot: "bg-violet-400", activeColorBright: "text-violet-700", activeBgBright: "bg-violet-100" },
];

export function AppHeader() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isBright, toggleBrightness } = useBrightness();

  return (
    <>
      <header
        className="sticky top-0 z-50"
        style={{
          background: isBright
            ? "rgba(236,253,245,0.92)"
            : "rgba(15,17,23,0.85)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderBottom: isBright
            ? "1px solid rgba(132,204,22,0.5)"
            : "1px solid rgba(163,230,53,0.12)",
          boxShadow: isBright
            ? "0 4px 32px rgba(132,204,22,0.22), 0 1px 0 rgba(163,230,53,0.3), inset 0 1px 0 rgba(255,255,255,0.6)"
            : "0 4px 24px rgba(0,0,0,0.4)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center gap-2 sm:gap-4">

          {/* ── Logo ─────────────────────────────────────── */}
          <Link to="/home" className="flex items-center gap-2 sm:gap-2.5 group flex-shrink-0">
            <img
              src="/logo.svg"
              alt="MealYummy Logo"
              className="w-8 h-8 sm:w-9 sm:h-9 object-contain group-hover:scale-105 transition-transform"
              style={{
                filter: isBright
                  ? "drop-shadow(0 2px 8px rgba(132,204,22,0.5))"
                  : "none",
                transition: "filter 0.8s ease",
              }}
            />
            <div className="flex flex-col leading-none">
              {/* Dark mode logo text */}
              <span
                className="font-bold text-sm sm:text-base leading-tight"
                style={{
                  background: "linear-gradient(90deg, #a3e635, #4ade80)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: "0.02em",
                  position: "absolute",
                  opacity: isBright ? 0 : 1,
                }}
              >
                MealYummy
              </span>
              {/* Bright mode logo text */}
              <span
                className="font-bold text-sm sm:text-base leading-tight"
                style={{
                  background: "linear-gradient(90deg, #4d7c0f, #15803d)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: "0.02em",
                  opacity: isBright ? 1 : 0,
                }}
              >
                MealYummy
              </span>
              <span
                className="hidden sm:block text-[10px] tracking-widest italic"
                style={{
                  color: isBright ? "rgba(77,124,15,0.7)" : "rgba(163,230,53,0.6)",
                }}
              >
                Eat Smarter, Train Harder
              </span>
            </div>
          </Link>

          {/* ── Divider (desktop only) ──────────────────────────────────── */}
          <div
            className="hidden lg:block w-px h-7 flex-shrink-0 mx-1"
            style={{
              background: isBright ? "rgba(132,204,22,0.4)" : "rgba(163,230,53,0.15)",
              transition: "background 0.8s ease",
            }}
          />

          {/* ── Nav items (desktop) ────────────────────────────────── */}
          <nav className="hidden lg:flex items-center gap-1 flex-1">
            {NAV_ITEMS.map(({ label, icon: Icon, link, activeColor, activeBg, dot, activeColorBright, activeBgBright }) => {
              const isActive = location.pathname === link;
              return (
                <Link
                  key={link}
                  to={link}
                  className={`
                    relative flex items-center gap-2 px-3.5 py-2 rounded-xl
                    text-sm font-medium transition-all select-none
                    ${isActive
                      ? isBright
                        ? `${activeColorBright} ${activeBgBright} shadow-sm`
                        : `${activeColor} ${activeBg} shadow-sm`
                      : isBright
                        ? "text-slate-600 hover:text-slate-800 hover:bg-lime-100/80"
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                    }
                  `}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "scale-110" : ""} transition-transform`} />
                  <span>{label}</span>
                  {isActive && (
                    <span
                      className={`absolute -bottom-[9px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${dot}`}
                      style={{
                        filter: isBright ? "brightness(0.7)" : "none",
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ── Lightbulb + User profile & Mobile menu toggle ─────────────────────────────── */}
          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            {/* Lightbulb brightness toggle */}
            <button
              onClick={toggleBrightness}
              title={isBright ? "Tắt đèn" : "Bật đèn"}
              className="relative flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-300"
              style={{
                background: isBright
                  ? "linear-gradient(135deg, rgba(250,204,21,0.5), rgba(163,230,53,0.45))"
                  : "linear-gradient(135deg, rgba(163,230,53,0.08), rgba(250,204,21,0.08))",
                border: isBright
                  ? "1.5px solid rgba(202,138,4,0.7)"
                  : "1px solid rgba(163,230,53,0.2)",
                boxShadow: isBright
                  ? "0 0 20px rgba(250,204,21,0.6), 0 0 40px rgba(163,230,53,0.3)"
                  : "none",
                transition: "background 0.8s ease, border 0.8s ease, box-shadow 0.8s ease",
              }}
            >
              {/* Glow ring khi bật đèn */}
              {isBright && (
                <span
                  className="absolute inset-0 rounded-full animate-ping"
                  style={{
                    background: "rgba(250,204,21,0.25)",
                    animationDuration: "1.8s",
                  }}
                />
              )}
              <Lightbulb
                className="w-4 h-4 transition-all duration-300"
                style={{
                  color: isBright ? "#92400e" : "#a3e635",
                  filter: isBright ? "drop-shadow(0 0 8px rgba(250,204,21,1))" : "none",
                  transform: isBright ? "scale(1.2)" : "scale(1)",
                }}
              />
            </button>

            {/* Profile */}
            <Link to="/profile" className="flex-shrink-0">
              <div
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center hover:scale-105 transition-all cursor-pointer"
                style={{
                  background: isBright
                    ? "linear-gradient(135deg, rgba(132,204,22,0.3), rgba(34,197,94,0.3))"
                    : "linear-gradient(135deg, rgba(163,230,53,0.15), rgba(74,222,128,0.15))",
                  border: isBright
                    ? "1.5px solid rgba(132,204,22,0.6)"
                    : "1px solid rgba(163,230,53,0.3)",
                  boxShadow: isBright ? "0 2px 12px rgba(132,204,22,0.25)" : "none",
                  transition: "all 0.8s ease",
                }}
              >
                <User
                  className="w-4 h-4"
                  style={{
                    color: isBright ? "#15803d" : "#a3e635",
                    transition: "color 0.8s ease",
                  }}
                />
              </div>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
              style={{
                background: "transparent",
              }}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" style={{ color: isBright ? "#374151" : "#cbd5e1" }} />
              ) : (
                <Menu className="w-5 h-5" style={{ color: isBright ? "#374151" : "#cbd5e1" }} />
              )}
            </button>
          </div>

        </div>

        {/* ── Mobile Navigation Menu ────────────────────────────────── */}
        {mobileMenuOpen && (
          <div
            className="lg:hidden"
            style={{
              borderTop: isBright ? "1px solid rgba(132,204,22,0.4)" : "1px solid rgba(163,230,53,0.12)",
              background: isBright ? "rgba(236,253,245,0.97)" : "rgba(15,17,23,0.97)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              transition: "all 0.8s ease",
            }}
          >
            <nav className="max-w-7xl mx-auto px-4 py-3 space-y-1">
              {NAV_ITEMS.map(({ label, icon: Icon, link, activeColor, activeBg, activeColorBright, activeBgBright }) => {
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
                        ? isBright
                          ? `${activeColorBright} ${activeBgBright} shadow-sm`
                          : `${activeColor} ${activeBg} shadow-sm`
                        : isBright
                          ? "text-slate-600 hover:text-slate-800 hover:bg-lime-100/80"
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

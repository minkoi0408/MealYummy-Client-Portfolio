import { Link, useLocation } from "react-router";
import { useState } from "react";
import {
  UtensilsCrossed,
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
  { label: "Gợi ý",    icon: Sparkles,     link: "/app",       activeColor: "text-amber-500",  activeBg: "bg-amber-50",  dot: "bg-amber-400"  },
  { label: "Xếp hạng", icon: Trophy,       link: "/results",   activeColor: "text-green-600",  activeBg: "bg-green-50",  dot: "bg-green-400"  },
  { label: "Yêu thích",icon: Heart,        link: "/dashboard", activeColor: "text-pink-500",   activeBg: "bg-pink-50",   dot: "bg-pink-400"   },
  { label: "Thực đơn", icon: Calendar,     link: "/meal-plan", activeColor: "text-blue-500",   activeBg: "bg-blue-50",   dot: "bg-blue-400"   },
  { label: "Đi chợ",   icon: ShoppingCart, link: "/shopping",  activeColor: "text-purple-500", activeBg: "bg-purple-50", dot: "bg-purple-400" },
];

export function AppHeader() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-amber-100/50 bg-white/70 backdrop-blur-xl shadow-sm shadow-amber-100/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center gap-2 sm:gap-4">

          {/* ── Logo ─────────────────────────────────────── */}
          <Link to="/home" className="flex items-center gap-2 sm:gap-2.5 group flex-shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-sm sm:text-base bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent leading-tight">
                MealYummy
              </span>
              <span className="hidden sm:block text-[10px] text-amber-500/70 tracking-wide italic">
                Ăn Ngon Mê Ly
              </span>
            </div>
          </Link>

          {/* ── Divider (desktop only) ──────────────────────────────────── */}
          <div className="hidden lg:block w-px h-7 bg-amber-100 flex-shrink-0 mx-1" />

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
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
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
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center border border-amber-200/80 hover:scale-105 hover:shadow-md transition-all cursor-pointer">
                <User className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-600" />
              </div>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-amber-50 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-foreground" />
              ) : (
                <Menu className="w-5 h-5 text-foreground" />
              )}
            </button>
          </div>

        </div>

        {/* ── Mobile Navigation Menu ────────────────────────────────── */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-amber-100/50 bg-white/95 backdrop-blur-xl">
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
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
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

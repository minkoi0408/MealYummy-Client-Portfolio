import { Link } from "react-router";
import { useState } from "react";
import { Plus, X, ChefHat, Clock, Flame, Search, ShoppingCart, ArrowRight } from "lucide-react";
import { AppHeader } from "../components/app-header";
import { useMealPlan } from "../contexts/meal-plan-context";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { useFavorites } from "../contexts/favorites-context";
import { mockRecipes } from "../data/mock-recipes";
import { toast } from "sonner";

// ─── Constants ────────────────────────────────────────────────────────────────

const MEAL_SLOTS = [
  { value: "breakfast" as const, label: "Bữa sáng", emoji: "🌅", time: "6:00 – 9:00", accentColor: "rgba(251,191,36,0.15)", borderColor: "rgba(251,191,36,0.3)" },
  { value: "lunch" as const, label: "Bữa trưa", emoji: "☀️", time: "11:00 – 13:00", accentColor: "rgba(163,230,53,0.08)", borderColor: "rgba(163,230,53,0.2)" },
  { value: "dinner" as const, label: "Chiều / Tối", emoji: "🌙", time: "17:00 – 20:00", accentColor: "rgba(139,92,246,0.08)", borderColor: "rgba(139,92,246,0.2)" },
];

function getThreeDays() {
  return [0, 1, 2].map((offset) => { const d = new Date(); d.setDate(d.getDate() + offset); return d; });
}
function formatDate(date: Date) { return date.toISOString().split("T")[0]; }
function dayLabel(offset: number) {
  if (offset === 0) return "Hôm nay";
  if (offset === 1) return "Ngày mai";
  return "Ngày kia";
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function MealPlanPage() {
  const { mealPlan, addToMealPlan, removeFromMealPlan } = useMealPlan();
  const { favorites } = useFavorites();
  const [activeDay, setActiveDay] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingSlot, setPendingSlot] = useState<{ date: string; mealType: "breakfast" | "lunch" | "dinner" } | null>(null);
  const [search, setSearch] = useState("");

  const days = getThreeDays();
  const allRecipes = [...favorites, ...mockRecipes.filter((r) => !favorites.find((f) => f.id === r.id))];
  const filtered = allRecipes.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()));

  function getMeals(date: string, mealType: string) {
    return mealPlan.filter((item) => item.date === date && item.mealType === mealType);
  }
  function openDialog(date: string, mealType: "breakfast" | "lunch" | "dinner") {
    setPendingSlot({ date, mealType }); setSearch(""); setDialogOpen(true);
  }
  function handlePick(recipe: any) {
    if (!pendingSlot) return;
    addToMealPlan(recipe, pendingSlot.date, pendingSlot.mealType);
    toast.success(`Đã thêm ${recipe.name} vào thực đơn!`);
    setDialogOpen(false);
  }

  const activeDateStr = formatDate(days[activeDay]);
  const totalCal = mealPlan.filter((item) => item.date === activeDateStr)
    .reduce((sum, item) => { const cal = parseInt(item.recipe.calories ?? "0"); return sum + (isNaN(cal) ? 0 : cal); }, 0);
  const totalMealCount = mealPlan.length;

  return (
    <div className="min-h-screen">
      <AppHeader />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        {/* Header */}
        <div className="pt-10 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3 text-xs font-bold uppercase tracking-widest"
            style={{ background: "rgba(163,230,53,0.08)", border: "1px solid rgba(163,230,53,0.2)", color: "#a3e635" }}>
            <ChefHat className="w-3.5 h-3.5" /> Thực Đơn
          </div>
          <h1 className="text-2xl font-black text-white mb-1">Thực đơn 3 ngày</h1>
          <p className="text-sm" style={{ color: "#64748b" }}>Lên kế hoạch bữa ăn cho hôm nay và 2 ngày tới</p>
        </div>

        {/* Shopping CTA */}
        {totalMealCount > 0 && (
          <div className="mb-5 flex items-center justify-between gap-4 rounded-2xl px-5 py-3.5"
            style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)" }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #8b5cf6, #6d28d9)" }}>
                <ShoppingCart className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "#c4b5fd" }}>Đã có {totalMealCount} bữa trong thực đơn</p>
                <p className="text-xs" style={{ color: "rgba(196,181,253,0.6)" }}>Danh sách đi chợ đã được cập nhật tự động</p>
              </div>
            </div>
            <Link to="/shopping" className="flex-shrink-0">
              <button className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl text-white transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg, #8b5cf6, #6d28d9)" }}>
                Xem danh sách đi chợ <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
        )}

        {/* Day tabs */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {days.map((day, i) => {
            const dateStr = formatDate(day);
            const mealsCount = mealPlan.filter((m) => m.date === dateStr).length;
            const isActive = activeDay === i;
            return (
              <button key={i} onClick={() => setActiveDay(i)}
                className="rounded-2xl p-4 text-left transition-all"
                style={isActive
                  ? { background: "linear-gradient(135deg, #a3e635, #4ade80)", boxShadow: "0 0 20px rgba(163,230,53,0.25)" }
                  : { background: "rgba(26,31,46,0.9)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <p className="text-xs font-semibold mb-0.5" style={{ color: isActive ? "rgba(15,17,23,0.7)" : "#64748b" }}>
                  {dayLabel(i)}
                </p>
                <p className="text-lg font-black leading-tight" style={{ color: isActive ? "#0f1117" : "#f1f5f9" }}>
                  {day.toLocaleDateString("vi-VN", { weekday: "short" })}, {day.getDate()}/{day.getMonth() + 1}
                </p>
                <div className="mt-2 flex items-center gap-1.5 text-xs"
                  style={{ color: isActive ? "rgba(15,17,23,0.6)" : "#64748b" }}>
                  <ChefHat className="w-3 h-3" /> {mealsCount} món đã chọn
                </div>
              </button>
            );
          })}
        </div>

        {/* Progress bar for active day */}
        <div className="mb-5 rounded-2xl px-4 py-3 flex items-center gap-4"
          style={{ background: "rgba(26,31,46,0.9)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex gap-2 flex-wrap">
            {MEAL_SLOTS.map((slot) => {
              const has = getMeals(activeDateStr, slot.value).length > 0;
              return (
                <div key={slot.value}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all"
                  style={has
                    ? { background: slot.accentColor, color: "#f1f5f9", border: `1px solid ${slot.borderColor}` }
                    : { background: "rgba(255,255,255,0.04)", color: "#475569", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <span>{slot.emoji}</span><span>{slot.label}</span>
                </div>
              );
            })}
          </div>
          <div className="ml-auto text-right flex-shrink-0">
            <p className="text-xs" style={{ color: "#64748b" }}>Tổng calo</p>
            <p className="font-bold text-lime-400">{totalCal > 0 ? `~${totalCal} kcal` : "—"}</p>
          </div>
        </div>

        {/* Meal slots */}
        <div className="space-y-4">
          {MEAL_SLOTS.map((slot) => {
            const meals = getMeals(activeDateStr, slot.value);
            return (
              <div key={slot.value} className="rounded-2xl overflow-hidden"
                style={{ background: slot.accentColor, border: `1px solid ${slot.borderColor}` }}>
                {/* Slot header */}
                <div className="flex items-center justify-between px-5 py-3.5"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{slot.emoji}</span>
                    <div>
                      <p className="font-bold text-base text-white leading-tight">{slot.label}</p>
                      <p className="text-xs" style={{ color: "#64748b" }}>{slot.time}</p>
                    </div>
                  </div>
                  <button onClick={() => openDialog(activeDateStr, slot.value)}
                    className="flex items-center gap-1.5 text-xs font-semibold h-8 px-3 rounded-xl transition-all"
                    style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "rgba(163,230,53,0.1)";
                      (e.currentTarget as HTMLButtonElement).style.color = "#a3e635";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.08)";
                      (e.currentTarget as HTMLButtonElement).style.color = "#94a3b8";
                    }}
                  >
                    <Plus className="w-3.5 h-3.5" /> Thêm món
                  </button>
                </div>

                {/* Meals inside slot */}
                <div className="p-4">
                  {meals.length === 0 ? (
                    <button onClick={() => openDialog(activeDateStr, slot.value)}
                      className="w-full h-20 rounded-xl flex flex-col items-center justify-center gap-1.5 group transition-all"
                      style={{ border: "2px dashed rgba(255,255,255,0.1)" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(163,230,53,0.3)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)"; }}
                    >
                      <Plus className="w-5 h-5 transition-colors" style={{ color: "rgba(255,255,255,0.2)" }} />
                      <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>Chưa có món — bấm để thêm</span>
                    </button>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {meals.map((meal) => (
                        <div key={meal.id}
                          className="group relative rounded-xl flex gap-3 p-3 transition-all"
                          style={{ background: "rgba(15,17,23,0.5)", border: "1px solid rgba(255,255,255,0.08)" }}>
                          <Link to={`/recipe/${meal.recipe.id}`} className="flex gap-3 flex-1 min-w-0">
                            <ImageWithFallback src={meal.recipe.image} alt={meal.recipe.name}
                              className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm leading-tight line-clamp-2 mb-1 text-white">{meal.recipe.name}</p>
                              <div className="flex items-center gap-2 text-xs" style={{ color: "#64748b" }}>
                                <span className="flex items-center gap-0.5"><Clock className="w-3 h-3 text-lime-400" />{meal.recipe.cookTime}</span>
                                <span className="flex items-center gap-0.5"><Flame className="w-3 h-3 text-orange-400" />{meal.recipe.calories}</span>
                              </div>
                            </div>
                          </Link>
                          <button
                            onClick={() => { removeFromMealPlan(meal.id); toast.success("Đã xóa khỏi thực đơn"); }}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}

                      {/* Inline add more */}
                      <button onClick={() => openDialog(activeDateStr, slot.value)}
                        className="h-[88px] rounded-xl flex flex-col items-center justify-center gap-1.5 group transition-all"
                        style={{ border: "2px dashed rgba(255,255,255,0.08)" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(163,230,53,0.3)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.08)"; }}
                      >
                        <Plus className="w-4 h-4" style={{ color: "rgba(255,255,255,0.2)" }} />
                        <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>Thêm món</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Add Recipe Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col gap-0 p-0 overflow-hidden"
          style={{ background: "#1a1f2e", border: "1px solid rgba(255,255,255,0.1)" }}>
          <DialogHeader className="px-6 pt-6 pb-4 flex-shrink-0"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <DialogTitle className="flex items-center gap-2 text-lg text-white">
              {pendingSlot && <span className="text-2xl">{MEAL_SLOTS.find((s) => s.value === pendingSlot.mealType)?.emoji}</span>}
              Chọn món ăn
              {pendingSlot && (
                <span className="ml-1 text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: "rgba(163,230,53,0.1)", color: "#a3e635", border: "1px solid rgba(163,230,53,0.2)" }}>
                  {MEAL_SLOTS.find((s) => s.value === pendingSlot.mealType)?.label} · {days[activeDay].toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "numeric" })}
                </span>
              )}
            </DialogTitle>
            <DialogDescription className="text-sm" style={{ color: "#64748b" }}>Chọn từ kho công thức của MealYummy</DialogDescription>
            <div className="relative mt-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#64748b" }} />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm kiếm món ăn..."
                className="w-full h-10 pl-9 pr-4 text-sm rounded-xl outline-none"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#f1f5f9" }}
                onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(163,230,53,0.4)"; }}
                onBlur={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.1)"; }}
              />
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            {favorites.length > 0 && !search && (
              <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "#a3e635" }}>⭐ Yêu thích của bạn</p>
            )}
            {filtered.length === 0 ? (
              <div className="text-center py-12">
                <ChefHat className="w-10 h-10 mx-auto mb-3" style={{ color: "rgba(255,255,255,0.15)" }} />
                <p className="text-sm" style={{ color: "#64748b" }}>Không tìm thấy món phù hợp</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {!search && filtered.map((recipe, idx) => {
                  const isFav = !!favorites.find((f) => f.id === recipe.id);
                  const prevIsFav = idx > 0 && !!favorites.find((f) => f.id === filtered[idx - 1].id);
                  const showSeparator = !isFav && prevIsFav;
                  return (
                    <div key={recipe.id}>
                      {showSeparator && (
                        <p className="text-xs font-semibold uppercase tracking-wide mb-3 mt-1" style={{ color: "#64748b" }}>🍽️ Tất cả công thức</p>
                      )}
                      <RecipePickCard recipe={recipe} onPick={handlePick} isFav={isFav} />
                    </div>
                  );
                })}
                {search && filtered.map((recipe) => (
                  <RecipePickCard key={recipe.id} recipe={recipe} onPick={handlePick} isFav={!!favorites.find((f) => f.id === recipe.id)} />
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Recipe Pick Card ─────────────────────────────────────────────────────────

function RecipePickCard({ recipe, onPick, isFav }: { recipe: any; onPick: (r: any) => void; isFav: boolean }) {
  return (
    <button onClick={() => onPick(recipe)}
      className="w-full text-left group rounded-xl flex gap-3 items-center p-3 transition-all"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "rgba(163,230,53,0.06)";
        (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(163,230,53,0.2)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)";
        (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.08)";
      }}
    >
      <ImageWithFallback src={recipe.image} alt={recipe.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          {isFav && <span className="text-xs text-lime-400">⭐</span>}
          <p className="font-semibold text-sm text-white truncate">{recipe.name}</p>
        </div>
        <p className="text-xs line-clamp-1 mb-1.5" style={{ color: "#64748b" }}>{recipe.description}</p>
        <div className="flex items-center gap-3 text-xs" style={{ color: "#64748b" }}>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-lime-400" />{recipe.cookTime}</span>
          <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-orange-400" />{recipe.calories}</span>
          <span className="px-2 py-0.5 rounded-full text-xs"
            style={{ background: "rgba(255,255,255,0.06)", color: "#94a3b8" }}>{recipe.cuisine}</span>
        </div>
      </div>
      <Plus className="w-5 h-5 flex-shrink-0 transition-colors group-hover:text-lime-400" style={{ color: "rgba(255,255,255,0.2)" }} />
    </button>
  );
}
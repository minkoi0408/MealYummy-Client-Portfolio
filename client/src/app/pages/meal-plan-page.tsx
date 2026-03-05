import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Plus,
  Trash2,
  X,
  ChefHat,
  Clock,
  Flame,
  Search,
  ShoppingCart,
  ArrowRight,
} from "lucide-react";
import { AppHeader } from "../components/app-header";
import { useMealPlan } from "../contexts/meal-plan-context";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { useFavorites } from "../contexts/favorites-context";
import { mockRecipes } from "../data/mock-recipes";
import { toast } from "sonner";

// ─── Constants ───────────────────────────────────────────────────────────────

const MEAL_SLOTS = [
  {
    value: "breakfast" as const,
    label: "Bữa sáng",
    emoji: "🌅",
    time: "6:00 – 9:00",
    gradient: "from-orange-50 to-amber-50",
    border: "border-orange-200/60",
    badge: "bg-orange-100 text-orange-600",
    dot: "bg-orange-400",
  },
  {
    value: "lunch" as const,
    label: "Bữa trưa",
    emoji: "☀️",
    time: "11:00 – 13:00",
    gradient: "from-yellow-50 to-amber-50",
    border: "border-yellow-200/60",
    badge: "bg-yellow-100 text-yellow-600",
    dot: "bg-yellow-400",
  },
  {
    value: "dinner" as const,
    label: "Chiều / Tối",
    emoji: "🌙",
    time: "17:00 – 20:00",
    gradient: "from-blue-50 to-indigo-50",
    border: "border-blue-200/60",
    badge: "bg-blue-100 text-blue-600",
    dot: "bg-blue-400",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getThreeDays() {
  return [0, 1, 2].map((offset) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d;
  });
}

function formatDate(date: Date) {
  return date.toISOString().split("T")[0];
}

function dayLabel(offset: number) {
  if (offset === 0) return "Hôm nay";
  if (offset === 1) return "Ngày mai";
  return "Ngày kia";
}

// ─── Page ────────────────────────────────────────────────────────────────────

export function MealPlanPage() {
  const { mealPlan, addToMealPlan, removeFromMealPlan } = useMealPlan();
  const { favorites } = useFavorites();
  const navigate = useNavigate();

  const [activeDay, setActiveDay] = useState(0); // 0, 1, 2
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingSlot, setPendingSlot] = useState<{
    date: string;
    mealType: "breakfast" | "lunch" | "dinner";
  } | null>(null);
  const [search, setSearch] = useState("");

  const days = getThreeDays();

  // All recipes to pick from (favorites first, then rest)
  const allRecipes = [
    ...favorites,
    ...mockRecipes.filter((r) => !favorites.find((f) => f.id === r.id)),
  ];

  const filtered = allRecipes.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  function getMeals(date: string, mealType: string) {
    return mealPlan.filter(
      (item) => item.date === date && item.mealType === mealType
    );
  }

  function openDialog(date: string, mealType: "breakfast" | "lunch" | "dinner") {
    setPendingSlot({ date, mealType });
    setSearch("");
    setDialogOpen(true);
  }

  function handlePick(recipe: any) {
    if (!pendingSlot) return;
    addToMealPlan(recipe, pendingSlot.date, pendingSlot.mealType);
    toast.success(`Đã thêm ${recipe.name} vào thực đơn!`);
    setDialogOpen(false);
  }

  // Total calo for the active day
  const activeDateStr = formatDate(days[activeDay]);
  const totalCal = mealPlan
    .filter((item) => item.date === activeDateStr)
    .reduce((sum, item) => {
      const cal = parseInt(item.recipe.calories ?? "0");
      return sum + (isNaN(cal) ? 0 : cal);
    }, 0);

  const filledSlots = MEAL_SLOTS.filter(
    (slot) => getMeals(activeDateStr, slot.value).length > 0
  ).length;

  // Total unique ingredients across the whole plan
  const totalMealCount = mealPlan.length;

  return (
    <div className="min-h-screen bg-transparent">
      <AppHeader />

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-black text-foreground mb-1">Thực đơn 3 ngày</h1>
          <p className="text-sm text-muted-foreground">
            Lên kế hoạch bữa ăn cho hôm nay và 2 ngày tới
          </p>
        </div>

        {/* Shopping list CTA — shown when meals are planned */}
        {totalMealCount > 0 && (
          <div className="mb-5 flex items-center justify-between gap-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200/50 rounded-2xl px-5 py-3.5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-sm flex-shrink-0">
                <ShoppingCart className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-purple-800">
                  Đã có {totalMealCount} bữa trong thực đơn
                </p>
                <p className="text-xs text-purple-500/80">
                  Danh sách đi chợ đã được cập nhật tự động
                </p>
              </div>
            </div>
            <Link to="/shopping" className="flex-shrink-0">
              <button className="flex items-center gap-1.5 text-xs font-semibold text-white bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 px-3.5 py-2 rounded-xl shadow-sm transition-all">
                Xem danh sách đi chợ
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
        )}

        {/* Day tabs */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {days.map((day, i) => {
            const dateStr = formatDate(day);
            const mealsCount = mealPlan.filter((m) => m.date === dateStr).length;
            const isActive = activeDay === i;
            return (
              <button
                key={i}
                onClick={() => setActiveDay(i)}
                className={`rounded-2xl p-4 text-left border transition-all ${
                  isActive
                    ? "bg-gradient-to-br from-amber-400 to-orange-500 border-transparent shadow-lg shadow-amber-200/50 text-white"
                    : "bg-white/70 backdrop-blur-sm border-amber-100/60 hover:border-amber-300/60 hover:shadow-md"
                }`}
              >
                <p className={`text-xs font-semibold mb-0.5 ${isActive ? "text-white/80" : "text-muted-foreground"}`}>
                  {dayLabel(i)}
                </p>
                <p className={`text-lg font-black leading-tight ${isActive ? "text-white" : "text-foreground"}`}>
                  {day.toLocaleDateString("vi-VN", { weekday: "short" })},{" "}
                  {day.getDate()}/{day.getMonth() + 1}
                </p>
                <div className={`mt-2 flex items-center gap-1.5 text-xs ${isActive ? "text-white/70" : "text-muted-foreground"}`}>
                  <ChefHat className="w-3 h-3" />
                  {mealsCount} món đã chọn
                </div>
              </button>
            );
          })}
        </div>

        {/* Progress bar for active day */}
        <div className="mb-6 bg-white/70 backdrop-blur-sm border border-amber-100/60 rounded-2xl p-4 flex items-center gap-4">
          {/* Slot dots */}
          <div className="flex gap-2">
            {MEAL_SLOTS.map((slot) => {
              const has = getMeals(activeDateStr, slot.value).length > 0;
              return (
                <div
                  key={slot.value}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                    has
                      ? `${slot.badge} border-transparent`
                      : "bg-gray-50 text-muted-foreground border-border/50"
                  }`}
                >
                  <span>{slot.emoji}</span>
                  <span>{slot.label}</span>
                </div>
              );
            })}
          </div>
          <div className="ml-auto text-right flex-shrink-0">
            <p className="text-xs text-muted-foreground">Tổng calo</p>
            <p className="font-bold text-amber-600">
              {totalCal > 0 ? `~${totalCal} kcal` : "—"}
            </p>
          </div>
        </div>

        {/* Meal slots */}
        <div className="space-y-4">
          {MEAL_SLOTS.map((slot) => {
            const meals = getMeals(activeDateStr, slot.value);

            return (
              <div
                key={slot.value}
                className={`rounded-2xl border bg-gradient-to-r ${slot.gradient} ${slot.border} overflow-hidden`}
              >
                {/* Slot header */}
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/60">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{slot.emoji}</span>
                    <div>
                      <p className="font-bold text-base text-foreground leading-tight">
                        {slot.label}
                      </p>
                      <p className="text-xs text-muted-foreground">{slot.time}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => openDialog(activeDateStr, slot.value)}
                    className="gap-1.5 bg-white/80 hover:bg-white text-foreground border border-white/60 shadow-sm h-8 text-xs"
                    variant="outline"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Thêm món
                  </Button>
                </div>

                {/* Meals inside slot */}
                <div className="p-4">
                  {meals.length === 0 ? (
                    <button
                      onClick={() => openDialog(activeDateStr, slot.value)}
                      className="w-full h-20 rounded-xl border-2 border-dashed border-white/80 bg-white/30 hover:bg-white/50 transition-all flex flex-col items-center justify-center gap-1.5 group"
                    >
                      <Plus className="w-5 h-5 text-muted-foreground/50 group-hover:text-foreground/70 transition-colors" />
                      <span className="text-xs text-muted-foreground/60 group-hover:text-muted-foreground transition-colors">
                        Chưa có món — bấm để thêm
                      </span>
                    </button>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {meals.map((meal) => (
                        <div
                          key={meal.id}
                          className="group relative bg-white/80 backdrop-blur-sm rounded-xl border border-white/80 shadow-sm hover:shadow-md transition-all flex gap-3 p-3"
                        >
                          <Link to={`/recipe/${meal.recipe.id}`} className="flex gap-3 flex-1 min-w-0">
                            <ImageWithFallback
                              src={meal.recipe.image}
                              alt={meal.recipe.name}
                              className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm leading-tight line-clamp-2 mb-1">
                                {meal.recipe.name}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span className="flex items-center gap-0.5">
                                  <Clock className="w-3 h-3" />
                                  {meal.recipe.cookTime}
                                </span>
                                <span className="flex items-center gap-0.5">
                                  <Flame className="w-3 h-3 text-orange-400" />
                                  {meal.recipe.calories}
                                </span>
                              </div>
                            </div>
                          </Link>
                          {/* Remove button */}
                          <button
                            onClick={() => {
                              removeFromMealPlan(meal.id);
                              toast.success("Đã xóa khỏi thực đơn");
                            }}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-400 hover:bg-red-500 text-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}

                      {/* Inline add more */}
                      <button
                        onClick={() => openDialog(activeDateStr, slot.value)}
                        className="h-[88px] rounded-xl border-2 border-dashed border-gray-200/80 bg-white/40 hover:bg-white/60 transition-all flex flex-col items-center justify-center gap-1.5 group"
                      >
                        <Plus className="w-4 h-4 text-muted-foreground/40 group-hover:text-foreground/60 transition-colors" />
                        <span className="text-xs text-muted-foreground/50 group-hover:text-muted-foreground transition-colors">
                          Thêm món
                        </span>
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
        <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col gap-0 p-0 overflow-hidden">
          {/* Dialog header */}
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/50 flex-shrink-0">
            <DialogTitle className="flex items-center gap-2 text-lg">
              {pendingSlot && (
                <span className="text-2xl">
                  {MEAL_SLOTS.find((s) => s.value === pendingSlot.mealType)?.emoji}
                </span>
              )}
              Chọn món ăn
              {pendingSlot && (
                <Badge className="ml-1 text-xs bg-amber-50 text-amber-700 border-amber-200 border">
                  {MEAL_SLOTS.find((s) => s.value === pendingSlot.mealType)?.label} ·{" "}
                  {days[activeDay].toLocaleDateString("vi-VN", {
                    weekday: "long",
                    day: "numeric",
                    month: "numeric",
                  })}
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription className="text-sm">
              Chọn từ kho công thức của MealYummy
            </DialogDescription>
            {/* Search */}
            <div className="relative mt-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm kiếm món ăn..."
                className="w-full h-10 pl-9 pr-4 text-sm rounded-xl border border-border bg-white/60 focus:outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-100"
              />
            </div>
          </DialogHeader>

          {/* Recipe list */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {/* Favorites section label */}
            {favorites.length > 0 && !search && (
              <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-3">
                ⭐ Yêu thích của bạn
              </p>
            )}

            {filtered.length === 0 ? (
              <div className="text-center py-12">
                <ChefHat className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">Không tìm thấy món phù hợp</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {/* Separator between favorites and rest */}
                {!search &&
                  filtered.map((recipe, idx) => {
                    const isFav = favorites.find((f) => f.id === recipe.id);
                    const prevIsFav = idx > 0 && favorites.find((f) => f.id === filtered[idx - 1].id);
                    const showSeparator = !isFav && prevIsFav;
                    return (
                      <div key={recipe.id}>
                        {showSeparator && (
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 mt-1">
                            🍽️ Tất cả công thức
                          </p>
                        )}
                        <RecipePickCard recipe={recipe} onPick={handlePick} isFav={!!isFav} />
                      </div>
                    );
                  })}
                {search &&
                  filtered.map((recipe) => (
                    <RecipePickCard
                      key={recipe.id}
                      recipe={recipe}
                      onPick={handlePick}
                      isFav={!!favorites.find((f) => f.id === recipe.id)}
                    />
                  ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Recipe pick card ─────────────────────────────────────────────────────────

function RecipePickCard({
  recipe,
  onPick,
  isFav,
}: {
  recipe: any;
  onPick: (r: any) => void;
  isFav: boolean;
}) {
  return (
    <button
      onClick={() => onPick(recipe)}
      className="w-full text-left group rounded-xl border border-border bg-white/60 hover:border-amber-300 hover:shadow-md hover:bg-amber-50/30 transition-all p-3 flex gap-3 items-center"
    >
      <ImageWithFallback
        src={recipe.image}
        alt={recipe.name}
        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          {isFav && <span className="text-xs text-amber-500">⭐</span>}
          <p className="font-semibold text-sm truncate">{recipe.name}</p>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-1 mb-1.5">
          {recipe.description}
        </p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> {recipe.cookTime}
          </span>
          <span className="flex items-center gap-1">
            <Flame className="w-3 h-3 text-orange-400" /> {recipe.calories}
          </span>
          <Badge variant="secondary" className="text-xs py-0 h-5">
            {recipe.cuisine}
          </Badge>
        </div>
      </div>
      <Plus className="w-5 h-5 text-muted-foreground/30 group-hover:text-amber-500 transition-colors flex-shrink-0" />
    </button>
  );
}
import { useState, useMemo } from "react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  ShoppingCart,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  CalendarDays,
  ChefHat,
  ArrowRight,
  Sparkles,
  PackageOpen,
} from "lucide-react";
import { AppHeader } from "../components/app-header";
import { useMealPlan, type MealPlanItem } from "../contexts/meal-plan-context";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ShoppingItem {
  id: string;
  name: string;
  amount: string;
  category: string;
  checked: boolean;
  fromRecipes?: string[];   // which recipe(s) this came from
  isManual?: boolean;       // user-added manually
}

// ─── Config ───────────────────────────────────────────────────────────────────

const CATEGORY_CONFIG: Record<string, { bg: string; text: string; border: string; emoji: string }> = {
  "Thịt & Hải sản": { bg: "bg-red-50",    text: "text-red-600",    border: "border-red-200/60",    emoji: "🥩" },
  "Rau củ":          { bg: "bg-green-50",  text: "text-green-600",  border: "border-green-200/60",  emoji: "🥦" },
  "Gia vị & Nước chấm": { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200/60", emoji: "🧂" },
  "Tinh bột":        { bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200/60",  emoji: "🍚" },
  "Khác":            { bg: "bg-gray-50",   text: "text-gray-600",   border: "border-gray-200/60",   emoji: "🛒" },
};

const INGREDIENT_MAP: Record<string, string> = {
  xương: "Thịt & Hải sản", thịt: "Thịt & Hải sản", bò: "Thịt & Hải sản",
  gà: "Thịt & Hải sản", heo: "Thịt & Hải sản", cá: "Thịt & Hải sản",
  tôm: "Thịt & Hải sản", mực: "Thịt & Hải sản", trứng: "Thịt & Hải sản",
  rau: "Rau củ", củ: "Rau củ", hành: "Rau củ", gừng: "Rau củ",
  tỏi: "Rau củ", ớt: "Rau củ", cà: "Rau củ", bắp: "Rau củ",
  giá: "Rau củ", ngò: "Rau củ", sả: "Rau củ", chanh: "Rau củ",
  dưa: "Rau củ", nấm: "Rau củ", rong: "Rau củ",
  bánh: "Tinh bột", bún: "Tinh bột", cơm: "Tinh bột",
  phở: "Tinh bột", mì: "Tinh bột", gạo: "Tinh bột", bột: "Tinh bột",
  muối: "Gia vị & Nước chấm", đường: "Gia vị & Nước chấm", nước: "Gia vị & Nước chấm",
  dầu: "Gia vị & Nước chấm", mắm: "Gia vị & Nước chấm", tiêu: "Gia vị & Nước chấm",
  hào: "Gia vị & Nước chấm", xì: "Gia vị & Nước chấm", tương: "Gia vị & Nước chấm",
  me: "Gia vị & Nước chấm", gia: "Gia vị & Nước chấm",
};

function categorize(ingredient: string): string {
  const lower = ingredient.toLowerCase();
  for (const [key, cat] of Object.entries(INGREDIENT_MAP)) {
    if (lower.includes(key)) return cat;
  }
  return "Khác";
}

function parseIngredient(raw: string): { name: string; amount: string } {
  const m = raw.match(/^(\d+[\w\/]*\s*(?:g|kg|ml|l|củ|cái|quả|muỗng|thìa|tép|nhánh|bó|hộp|gói|lon|lít|cc|con|chén)?)[\s:]+(.+)/i);
  if (m) return { amount: m[1].trim(), name: m[2].trim() };
  return { name: raw, amount: "vừa đủ" };
}

// ─── Build shopping list from meal plan ──────────────────────────────────────

function buildFromMealPlan(mealPlan: MealPlanItem[]): ShoppingItem[] {
  // Map: normalised name → { amount variants, recipes, category }
  const map = new Map<string, { amounts: string[]; fromRecipes: string[]; category: string }>();

  mealPlan.forEach((item) => {
    const ingredients: string[] = (item.recipe as any).ingredients ?? [];
    ingredients.forEach((raw) => {
      const { name, amount } = parseIngredient(raw);
      const key = name.toLowerCase().trim();
      const cat = categorize(raw);
      if (map.has(key)) {
        const entry = map.get(key)!;
        if (amount !== "vừa đủ" && !entry.amounts.includes(amount)) entry.amounts.push(amount);
        if (!entry.fromRecipes.includes(item.recipe.name)) entry.fromRecipes.push(item.recipe.name);
      } else {
        map.set(key, {
          amounts: amount !== "vừa đủ" ? [amount] : [],
          fromRecipes: [item.recipe.name],
          category: cat,
        });
      }
    });
  });

  return Array.from(map.entries()).map(([key, { amounts, fromRecipes, category }], i) => ({
    id: `mp-${i}-${key}`,
    name: key.charAt(0).toUpperCase() + key.slice(1),
    amount: amounts.length > 0 ? amounts.join(" + ") : "vừa đủ",
    category,
    fromRecipes,
    checked: false,
    isManual: false,
  }));
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("vi-VN", { weekday: "short", day: "numeric", month: "numeric" });
}

const MEAL_LABEL: Record<string, string> = {
  breakfast: "Sáng",
  lunch: "Trưa",
  dinner: "Tối",
  snack: "Ăn vặt",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export function ShoppingPage() {
  const { mealPlan } = useMealPlan();

  // Items derived from meal plan (regenerated whenever mealPlan changes)
  const autoItems = useMemo(() => buildFromMealPlan(mealPlan), [mealPlan]);

  // Checked state: keyed by item id
  const [checked, setChecked] = useState<Set<string>>(new Set());

  // Manual items added by user
  const [manualItems, setManualItems] = useState<ShoppingItem[]>([]);
  const [newItemInput, setNewItemInput] = useState("");

  // Collapse state per category
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  // Merge auto + manual
  const allItems: ShoppingItem[] = [
    ...autoItems.map((i) => ({ ...i, checked: checked.has(i.id) })),
    ...manualItems.map((i) => ({ ...i, checked: checked.has(i.id) })),
  ];

  function toggleCheck(id: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function removeManual(id: string) {
    setManualItems((prev) => prev.filter((i) => i.id !== id));
    setChecked((prev) => { const n = new Set(prev); n.delete(id); return n; });
  }

  function addManual() {
    if (!newItemInput.trim()) return;
    const { name, amount } = parseIngredient(newItemInput.trim());
    const cat = categorize(newItemInput);
    const id = `manual-${Date.now()}`;
    setManualItems((prev) => [...prev, { id, name: name.charAt(0).toUpperCase() + name.slice(1), amount, category: cat, checked: false, isManual: true }]);
    setNewItemInput("");
  }

  function resetChecked() {
    setChecked(new Set());
    toast.success("Đã bỏ chọn tất cả");
  }

  function toggleCollapse(cat: string) {
    setCollapsed((prev) => { const n = new Set(prev); n.has(cat) ? n.delete(cat) : n.add(cat); return n; });
  }

  // Summary stats
  const uniqueDates = [...new Set(mealPlan.map((m) => m.date))].sort();
  const totalMeals = mealPlan.length;
  const totalItems = allItems.length;
  const checkedCount = allItems.filter((i) => i.checked).length;
  const progress = totalItems > 0 ? (checkedCount / totalItems) * 100 : 0;

  // Group by category
  const grouped = allItems.reduce<Record<string, ShoppingItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const catOrder = ["Thịt & Hải sản", "Tinh bột", "Rau củ", "Gia vị & Nước chấm", "Khác"];
  const sortedCategories = [
    ...catOrder.filter((c) => grouped[c]),
    ...Object.keys(grouped).filter((c) => !catOrder.includes(c)),
  ];

  // ── Empty state ──────────────────────────────────────────────────────────────
  if (mealPlan.length === 0 && manualItems.length === 0) {
    return (
      <div className="min-h-screen bg-transparent">
        <AppHeader />
        <main className="max-w-3xl mx-auto px-6 py-8">
          <div className="flex items-center gap-2 mb-8">
            <ShoppingCart className="w-5 h-5 text-purple-500" />
            <h1 className="text-2xl font-black text-foreground">Danh sách đi chợ</h1>
          </div>
          {/* Empty hero */}
          <div className="text-center py-16 px-8">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center mx-auto mb-5 shadow-sm">
              <PackageOpen className="w-9 h-9 text-purple-400" />
            </div>
            <h2 className="font-bold text-lg text-foreground mb-2">Chưa có thực đơn</h2>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-6">
              Lên thực đơn cho các bữa ăn trước, danh sách nguyên liệu sẽ tự động được tạo tại đây!
            </p>
            <Link to="/meal-plan">
              <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm font-semibold shadow-md shadow-amber-200/50 hover:from-amber-500 hover:to-orange-600 transition-all">
                <CalendarDays className="w-4 h-4" />
                Lên thực đơn ngay
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <p className="text-xs text-muted-foreground/50 mt-6">— hoặc thêm nguyên liệu thủ công bên dưới —</p>
          </div>

          {/* Manual add even when empty */}
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={newItemInput}
              onChange={(e) => setNewItemInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addManual()}
              placeholder="Thêm nguyên liệu thủ công (VD: 200g thịt heo)..."
              className="flex-1 h-10 px-4 text-sm rounded-xl border border-border bg-white/60 backdrop-blur-sm focus:outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
            />
            <Button onClick={addManual} className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white gap-1.5 rounded-xl">
              <Plus className="w-4 h-4" />Thêm
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent">
      <AppHeader />

      <main className="max-w-3xl mx-auto px-6 py-8">
        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShoppingCart className="w-5 h-5 text-purple-500" />
              <h1 className="text-2xl font-black text-foreground">Danh sách đi chợ</h1>
            </div>
            <p className="text-sm text-muted-foreground">Tổng hợp nguyên liệu từ thực đơn của bạn</p>
          </div>
          <button
            onClick={resetChecked}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground px-3 py-2 rounded-xl border border-border/60 hover:border-border bg-white/50 backdrop-blur-sm transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Bỏ chọn tất cả
          </button>
        </div>

        {/* ── Meal plan summary banner ─────────────────────────────── */}
        {mealPlan.length > 0 && (
          <div className="mb-5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 rounded-2xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-semibold text-amber-800">
                    Tự động từ thực đơn — {totalMeals} bữa · {autoItems.length} nguyên liệu
                  </span>
                </div>
                {/* Day pills */}
                <div className="flex flex-wrap gap-1.5">
                  {uniqueDates.map((date) => {
                    const meals = mealPlan.filter((m) => m.date === date);
                    return (
                      <div key={date} className="flex items-center gap-1 bg-white/70 border border-amber-200/50 rounded-full px-2.5 py-1 text-xs text-amber-700">
                        <CalendarDays className="w-3 h-3" />
                        <span className="font-medium">{formatDate(date)}</span>
                        <span className="text-amber-500/70">·</span>
                        <span>{meals.map((m) => MEAL_LABEL[m.mealType]).join(", ")}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <Link to="/meal-plan" className="flex-shrink-0">
                <button className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-800 border border-amber-300/60 hover:border-amber-400 bg-white/70 rounded-lg px-2.5 py-1.5 transition-all">
                  <ChefHat className="w-3.5 h-3.5" />
                  Sửa thực đơn
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* ── Progress ─────────────────────────────────────────────── */}
        <div className="mb-5 bg-white/70 backdrop-blur-sm border border-purple-100/60 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-sm font-semibold text-foreground">Tiến độ mua sắm</span>
            <Badge className={`text-xs border ${
              checkedCount === totalItems && totalItems > 0
                ? "bg-green-100 text-green-700 border-green-200"
                : "bg-purple-100 text-purple-700 border-purple-200"
            }`}>
              {checkedCount}/{totalItems} mặt hàng
            </Badge>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-400 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          {checkedCount === totalItems && totalItems > 0 && (
            <p className="text-xs text-green-600 font-medium mt-2 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Đã mua đủ nguyên liệu! 🎉
            </p>
          )}
        </div>

        {/* ── Manual add ───────────────────────────────────────────── */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={newItemInput}
            onChange={(e) => setNewItemInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addManual()}
            placeholder="Thêm nguyên liệu thủ công (VD: 200g thịt heo)..."
            className="flex-1 h-10 px-4 text-sm rounded-xl border border-border bg-white/60 backdrop-blur-sm focus:outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
          />
          <Button onClick={addManual} className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white gap-1.5 rounded-xl">
            <Plus className="w-4 h-4" />Thêm
          </Button>
        </div>

        {/* ── Grouped ingredient list ───────────────────────────────── */}
        <div className="space-y-3">
          {sortedCategories.map((category) => {
            const catItems = grouped[category];
            const config = CATEGORY_CONFIG[category] ?? CATEGORY_CONFIG["Khác"];
            const isCollapsed = collapsed.has(category);
            const checkedInCat = catItems.filter((i) => i.checked).length;

            return (
              <div key={category} className={`rounded-2xl border ${config.border} bg-white/70 backdrop-blur-sm overflow-hidden`}>
                {/* Category header */}
                <button
                  onClick={() => toggleCollapse(category)}
                  className="w-full flex items-center justify-between px-5 py-3 hover:bg-white/60 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{config.emoji}</span>
                    <span className="font-semibold text-sm text-foreground">{category}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${config.bg} ${config.text}`}>
                      {checkedInCat}/{catItems.length}
                    </span>
                  </div>
                  {isCollapsed
                    ? <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    : <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  }
                </button>

                {/* Items */}
                {!isCollapsed && (
                  <div className="divide-y divide-border/30">
                    {catItems.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-center gap-3 px-5 py-3 transition-colors group ${
                          item.checked ? "bg-gray-50/80" : "hover:bg-amber-50/20"
                        }`}
                      >
                        {/* Checkbox */}
                        <button onClick={() => toggleCheck(item.id)} className="flex-shrink-0">
                          {item.checked
                            ? <CheckCircle2 className="w-5 h-5 text-green-500" />
                            : <Circle className="w-5 h-5 text-muted-foreground/30" />
                          }
                        </button>

                        {/* Name + source */}
                        <div className="flex-1 min-w-0">
                          <span className={`text-sm font-medium ${item.checked ? "line-through text-muted-foreground/40" : "text-foreground"}`}>
                            {item.name}
                          </span>
                          {item.fromRecipes && item.fromRecipes.length > 0 && (
                            <p className={`text-[11px] mt-0.5 truncate ${item.checked ? "text-muted-foreground/30" : "text-muted-foreground/60"}`}>
                              {item.fromRecipes.join(" · ")}
                            </p>
                          )}
                          {item.isManual && (
                            <span className="text-[10px] text-purple-400 font-medium">Thêm thủ công</span>
                          )}
                        </div>

                        {/* Amount badge */}
                        <span className={`text-xs px-2.5 py-1 rounded-full flex-shrink-0 font-medium ${config.bg} ${config.text}`}>
                          {item.amount}
                        </span>

                        {/* Remove (manual only, or always show on hover) */}
                        <button
                          onClick={() => {
                            if (item.isManual) { removeManual(item.id); toast.success("Đã xóa"); }
                            else toast.info("Nguyên liệu này từ thực đơn — chỉnh trong trang Thực đơn nhé!");
                          }}
                          className="flex-shrink-0 text-muted-foreground/20 group-hover:text-muted-foreground/50 hover:!text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Bottom CTA ───────────────────────────────────────────── */}
        <div className="mt-8 text-center">
          <Link to="/meal-plan">
            <button className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-amber-700 border border-border/60 hover:border-amber-300 bg-white/50 hover:bg-amber-50/50 px-4 py-2.5 rounded-xl transition-all">
              <CalendarDays className="w-4 h-4" />
              Chỉnh sửa thực đơn
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}

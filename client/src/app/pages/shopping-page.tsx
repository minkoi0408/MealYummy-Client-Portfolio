import { useState, useMemo } from "react";
import { Link } from "react-router";
import {
  ShoppingCart, CheckCircle2, Circle, Plus, Trash2,
  RefreshCw, ChevronDown, ChevronUp, CalendarDays,
  ChefHat, ArrowRight, Sparkles, PackageOpen,
} from "lucide-react";
import { AppHeader } from "../components/app-header";
import { useMealPlan, type MealPlanItem } from "../contexts/meal-plan-context";
import { toast } from "sonner";

interface ShoppingItem {
  id: string; name: string; amount: string; category: string;
  checked: boolean; fromRecipes?: string[]; isManual?: boolean;
}

const CATEGORY_CONFIG: Record<string, { accentColor: string; borderColor: string; textColor: string; emoji: string }> = {
  "Thịt & Hải sản": { accentColor: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.2)", textColor: "#f87171", emoji: "🥩" },
  "Rau củ": { accentColor: "rgba(163,230,53,0.08)", borderColor: "rgba(163,230,53,0.2)", textColor: "#a3e635", emoji: "🥦" },
  "Gia vị & Nước chấm": { accentColor: "rgba(251,191,36,0.08)", borderColor: "rgba(251,191,36,0.2)", textColor: "#fbbf24", emoji: "🧂" },
  "Tinh bột": { accentColor: "rgba(251,146,60,0.08)", borderColor: "rgba(251,146,60,0.2)", textColor: "#fb923c", emoji: "🍚" },
  "Khác": { accentColor: "rgba(100,116,139,0.08)", borderColor: "rgba(100,116,139,0.2)", textColor: "#94a3b8", emoji: "🛒" },
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
  const m = raw.match(/^(\d+[\w/]*\s*(?:g|kg|ml|l|củ|cái|quả|muỗng|thìa|tép|nhánh|bó|hộp|gói|lon|lít|cc|con|chén)?)\s+(.+)/i);
  if (m) return { amount: m[1].trim(), name: m[2].trim() };
  return { name: raw, amount: "vừa đủ" };
}

function buildFromMealPlan(mealPlan: MealPlanItem[]): ShoppingItem[] {
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
        map.set(key, { amounts: amount !== "vừa đủ" ? [amount] : [], fromRecipes: [item.recipe.name], category: cat });
      }
    });
  });
  return Array.from(map.entries()).map(([key, { amounts, fromRecipes, category }], i) => ({
    id: `mp-${i}-${key}`,
    name: key.charAt(0).toUpperCase() + key.slice(1),
    amount: amounts.length > 0 ? amounts.join(" + ") : "vừa đủ",
    category, fromRecipes, checked: false, isManual: false,
  }));
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("vi-VN", { weekday: "short", day: "numeric", month: "numeric" });
}

const MEAL_LABEL: Record<string, string> = { breakfast: "Sáng", lunch: "Trưa", dinner: "Tối", snack: "Ăn vặt" };

export function ShoppingPage() {
  const { mealPlan } = useMealPlan();
  const autoItems = useMemo(() => buildFromMealPlan(mealPlan), [mealPlan]);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [manualItems, setManualItems] = useState<ShoppingItem[]>([]);
  const [newItemInput, setNewItemInput] = useState("");
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const allItems: ShoppingItem[] = [
    ...autoItems.map((i) => ({ ...i, checked: checked.has(i.id) })),
    ...manualItems.map((i) => ({ ...i, checked: checked.has(i.id) })),
  ];

  const toggleCheck = (id: string) => setChecked((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const removeManual = (id: string) => { setManualItems((prev) => prev.filter((i) => i.id !== id)); setChecked((prev) => { const n = new Set(prev); n.delete(id); return n; }); };
  const addManual = () => {
    if (!newItemInput.trim()) return;
    const { name, amount } = parseIngredient(newItemInput.trim());
    const cat = categorize(newItemInput);
    const id = `manual-${Date.now()}`;
    setManualItems((prev) => [...prev, { id, name: name.charAt(0).toUpperCase() + name.slice(1), amount, category: cat, checked: false, isManual: true }]);
    setNewItemInput("");
  };
  const resetChecked = () => { setChecked(new Set()); toast.success("Đã bỏ chọn tất cả"); };
  const toggleCollapse = (cat: string) => setCollapsed((prev) => { const n = new Set(prev); n.has(cat) ? n.delete(cat) : n.add(cat); return n; });

  const uniqueDates = [...new Set(mealPlan.map((m) => m.date))].sort();
  const totalMeals = mealPlan.length;
  const totalItems = allItems.length;
  const checkedCount = allItems.filter((i) => i.checked).length;
  const progress = totalItems > 0 ? (checkedCount / totalItems) * 100 : 0;

  const grouped = allItems.reduce<Record<string, ShoppingItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const catOrder = ["Thịt & Hải sản", "Tinh bột", "Rau củ", "Gia vị & Nước chấm", "Khác"];
  const sortedCategories = [...catOrder.filter((c) => grouped[c]), ...Object.keys(grouped).filter((c) => !catOrder.includes(c))];

  // ── Empty state ─────────────────────────────────────────────────────────────
  if (mealPlan.length === 0 && manualItems.length === 0) {
    return (
      <div className="min-h-screen">
        <AppHeader />
        <main className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
          <div className="pt-10 mb-8 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-purple-400" />
            <h1 className="text-2xl font-black text-white">Danh sách đi chợ</h1>
          </div>
          <div className="text-center py-16 px-8">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-5"
              style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)" }}>
              <PackageOpen className="w-9 h-9 text-purple-400" />
            </div>
            <h2 className="font-black text-lg text-white mb-2">Chưa có thực đơn</h2>
            <p className="text-sm mb-6 max-w-xs mx-auto" style={{ color: "#64748b" }}>
              Lên thực đơn cho các bữa ăn trước, danh sách nguyên liệu sẽ tự động được tạo tại đây!
            </p>
            <Link to="/meal-plan">
              <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg, #8b5cf6, #6d28d9)", boxShadow: "0 0 20px rgba(139,92,246,0.3)" }}>
                <CalendarDays className="w-4 h-4" /> Lên thực đơn ngay <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <p className="text-xs mt-6" style={{ color: "rgba(255,255,255,0.2)" }}>— hoặc thêm nguyên liệu thủ công bên dưới —</p>
          </div>
          <div className="flex gap-2 mt-2">
            <input type="text" value={newItemInput} onChange={(e) => setNewItemInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addManual()}
              placeholder="Thêm nguyên liệu thủ công (VD: 200g thịt heo)..."
              className="flex-1 h-10 px-4 text-sm rounded-xl outline-none"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#f1f5f9" }}
            />
            <button onClick={addManual} className="h-10 px-4 rounded-xl text-sm font-bold text-white flex items-center gap-1.5"
              style={{ background: "linear-gradient(135deg, #8b5cf6, #6d28d9)" }}>
              <Plus className="w-4 h-4" /> Thêm
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AppHeader />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
        {/* Header */}
        <div className="pt-10 flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShoppingCart className="w-5 h-5 text-purple-400" />
              <h1 className="text-2xl font-black text-white">Danh sách đi chợ</h1>
            </div>
            <p className="text-sm" style={{ color: "#64748b" }}>Tổng hợp nguyên liệu từ thực đơn của bạn</p>
          </div>
          <button onClick={resetChecked}
            className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl transition-all"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#64748b" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#94a3b8"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#64748b"; }}
          >
            <RefreshCw className="w-3.5 h-3.5" /> Bỏ chọn tất cả
          </button>
        </div>

        {/* Meal plan summary banner */}
        {mealPlan.length > 0 && (
          <div className="mb-5 rounded-2xl p-4"
            style={{ background: "rgba(163,230,53,0.04)", border: "1px solid rgba(163,230,53,0.15)" }}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-lime-400" />
                  <span className="text-sm font-semibold" style={{ color: "#a3e635" }}>
                    Tự động từ thực đơn — {totalMeals} bữa · {autoItems.length} nguyên liệu
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {uniqueDates.map((date) => {
                    const meals = mealPlan.filter((m) => m.date === date);
                    return (
                      <div key={date} className="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#94a3b8" }}>
                        <CalendarDays className="w-3 h-3" />
                        <span className="font-medium">{formatDate(date)}</span>
                        <span style={{ color: "rgba(148,163,184,0.5)" }}>·</span>
                        <span>{meals.map((m) => MEAL_LABEL[m.mealType]).join(", ")}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <Link to="/meal-plan" className="flex-shrink-0">
                <button className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg transition-all"
                  style={{ color: "#a3e635", border: "1px solid rgba(163,230,53,0.2)", background: "rgba(163,230,53,0.05)" }}>
                  <ChefHat className="w-3.5 h-3.5" /> Sửa thực đơn
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* Progress */}
        <div className="mb-5 rounded-2xl p-4" style={{ background: "rgba(26,31,46,0.9)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-sm font-semibold text-white">Tiến độ mua sắm</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium"
              style={checkedCount === totalItems && totalItems > 0
                ? { background: "rgba(163,230,53,0.1)", color: "#a3e635", border: "1px solid rgba(163,230,53,0.2)" }
                : { background: "rgba(139,92,246,0.1)", color: "#c4b5fd", border: "1px solid rgba(139,92,246,0.2)" }
              }>
              {checkedCount}/{totalItems} mặt hàng
            </span>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: "linear-gradient(90deg, #8b5cf6, #a3e635)" }} />
          </div>
          {checkedCount === totalItems && totalItems > 0 && (
            <p className="text-xs font-medium mt-2 flex items-center gap-1" style={{ color: "#a3e635" }}>
              <CheckCircle2 className="w-3.5 h-3.5" /> Đã mua đủ nguyên liệu! 🎉
            </p>
          )}
        </div>

        {/* Manual add */}
        <div className="flex gap-2 mb-6">
          <input type="text" value={newItemInput} onChange={(e) => setNewItemInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addManual()}
            placeholder="Thêm nguyên liệu thủ công (VD: 200g thịt heo)..."
            className="flex-1 h-10 px-4 text-sm rounded-xl outline-none"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#f1f5f9" }}
            onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(163,230,53,0.4)"; }}
            onBlur={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.1)"; }}
          />
          <button onClick={addManual} className="h-10 px-4 rounded-xl text-sm font-bold text-white flex items-center gap-1.5 transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg, #8b5cf6, #6d28d9)" }}>
            <Plus className="w-4 h-4" /> Thêm
          </button>
        </div>

        {/* Grouped ingredient list */}
        <div className="space-y-3">
          {sortedCategories.map((category) => {
            const catItems = grouped[category];
            const config = CATEGORY_CONFIG[category] ?? CATEGORY_CONFIG["Khác"];
            const isCollapsed = collapsed.has(category);
            const checkedInCat = catItems.filter((i) => i.checked).length;

            return (
              <div key={category} className="rounded-2xl overflow-hidden"
                style={{ background: "rgba(26,31,46,0.9)", border: `1px solid ${config.borderColor}` }}>
                {/* Category header */}
                <button onClick={() => toggleCollapse(category)}
                  className="w-full flex items-center justify-between px-5 py-3 transition-colors"
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.03)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{config.emoji}</span>
                    <span className="font-semibold text-sm text-white">{category}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: config.accentColor, color: config.textColor }}>
                      {checkedInCat}/{catItems.length}
                    </span>
                  </div>
                  {isCollapsed ? <ChevronDown className="w-4 h-4" style={{ color: "#64748b" }} /> : <ChevronUp className="w-4 h-4" style={{ color: "#64748b" }} />}
                </button>

                {/* Items */}
                {!isCollapsed && (
                  <div>
                    {catItems.map((item) => (
                      <div key={item.id}
                        className="flex items-center gap-3 px-5 py-3 group transition-colors"
                        style={item.checked ? { background: "rgba(255,255,255,0.01)", borderTop: "1px solid rgba(255,255,255,0.04)" } : { borderTop: "1px solid rgba(255,255,255,0.04)" }}
                      >
                        <button onClick={() => toggleCheck(item.id)} className="flex-shrink-0">
                          {item.checked
                            ? <CheckCircle2 className="w-5 h-5 text-lime-400" />
                            : <Circle className="w-5 h-5" style={{ color: "rgba(255,255,255,0.15)" }} />
                          }
                        </button>

                        <div className="flex-1 min-w-0">
                          <span className={`text-sm font-medium ${item.checked ? "line-through" : "text-white"}`}
                            style={item.checked ? { color: "rgba(255,255,255,0.25)" } : {}}>
                            {item.name}
                          </span>
                          {item.fromRecipes && item.fromRecipes.length > 0 && (
                            <p className="text-[11px] mt-0.5 truncate" style={{ color: item.checked ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.25)" }}>
                              {item.fromRecipes.join(" · ")}
                            </p>
                          )}
                          {item.isManual && <span className="text-[10px] font-medium" style={{ color: "#c4b5fd" }}>Thêm thủ công</span>}
                        </div>

                        <span className="text-xs px-2.5 py-1 rounded-full flex-shrink-0 font-medium"
                          style={{ background: config.accentColor, color: config.textColor }}>
                          {item.amount}
                        </span>

                        <button
                          onClick={() => {
                            if (item.isManual) { removeManual(item.id); toast.success("Đã xóa"); }
                            else toast.info("Nguyên liệu này từ thực đơn — chỉnh trong trang Thực đơn nhé!");
                          }}
                          className="flex-shrink-0 transition-colors"
                          style={{ color: "rgba(255,255,255,0.1)" }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#f87171"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.1)"; }}
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

        {/* Bottom CTA */}
        <div className="mt-8 text-center">
          <Link to="/meal-plan">
            <button className="inline-flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl transition-all"
              style={{ color: "#64748b", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#a3e635";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(163,230,53,0.3)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#64748b";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.08)";
              }}
            >
              <CalendarDays className="w-4 h-4" /> Chỉnh sửa thực đơn <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}

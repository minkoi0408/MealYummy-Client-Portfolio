import { useState, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router";
import {
  ShoppingCart, CheckCircle2, Circle, Plus, Trash2,
  RefreshCw, ChevronDown, ChevronUp, CalendarDays,
  ChefHat, ArrowRight, Sparkles, PackageOpen, MapPin, Loader2,
} from "lucide-react";
import { AppHeader } from "../components/app-header";
import { useMealPlan, type MealPlanItem } from "../contexts/meal-plan-context";
import { toast } from "sonner";
import { useBrightness } from "../contexts/brightness-context";

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
  const navigate = useNavigate();
  const { mealPlan } = useMealPlan();
  const { isBright } = useBrightness();
  const autoItems = useMemo(() => buildFromMealPlan(mealPlan), [mealPlan]);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [manualItems, setManualItems] = useState<ShoppingItem[]>([]);
  const [newItemInput, setNewItemInput] = useState("");
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [showLocationOverlay, setShowLocationOverlay] = useState(false);
  const [locationMessage, setLocationMessage] = useState("Đang xác định vị trí của bạn...");
  const [overlayPhase, setOverlayPhase] = useState<"scanning" | "zooming" | "done">("scanning");
  const [foundLocation, setFoundLocation] = useState<string | null>(null);

  const handleFindMarket = useCallback(() => {
    setShowLocationOverlay(true);
    setOverlayPhase("scanning");
    setFoundLocation(null);
    setLocationMessage("🛰️ Đang kết nối vệ tinh...");

    // Progressive messages
    const msgTimer1 = setTimeout(() => setLocationMessage("📡 Đang quét tín hiệu GPS..."), 1500);
    const msgTimer2 = setTimeout(() => setLocationMessage("🌏 Đang xác định vị trí trên bản đồ..."), 3000);

    const minDelay = new Promise((r) => setTimeout(r, 4000));

    const geoPromise = new Promise<{ lat?: number; lng?: number }>((resolve) => {
      if (!navigator.geolocation) {
        resolve({});
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          clearTimeout(msgTimer1);
          clearTimeout(msgTimer2);
          resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => {
          clearTimeout(msgTimer1);
          clearTimeout(msgTimer2);
          resolve({});
        },
        { timeout: 8000, enableHighAccuracy: true }
      );
    });

    Promise.all([minDelay, geoPromise]).then(([, coords]) => {
      // Phase 2: Zoom into location
      setOverlayPhase("zooming");
      if (coords.lat && coords.lng) {
        setFoundLocation(`${coords.lat.toFixed(4)}°N, ${coords.lng.toFixed(4)}°E`);
        setLocationMessage("📍 Đã xác định vị trí!");
      } else {
        setFoundLocation("TP. Hồ Chí Minh, Việt Nam");
        setLocationMessage("📍 Đang dùng vị trí mặc định");
      }

      // Phase 3: Navigate
      setTimeout(() => {
        setLocationMessage("🔍 Đang tìm chợ & siêu thị gần bạn...");
      }, 1200);

      setTimeout(() => {
        setOverlayPhase("done");
        setLocationMessage("✅ Đã tìm thấy!");
      }, 2500);

      setTimeout(() => {
        setShowLocationOverlay(false);
        navigate("/nearby-restaurants");
      }, 3500);
    });
  }, [navigate]);

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
            <h1 className="text-2xl font-black text-white" style={{ color: "var(--foreground)" }}>Danh sách đi chợ</h1>
          </div>
          <div className="text-center py-16 px-8">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-5"
              style={{ background: isBright ? "rgba(139,92,246,0.15)" : "rgba(139,92,246,0.1)", border: isBright ? "1px solid rgba(139,92,246,0.3)" : "1px solid rgba(139,92,246,0.2)" }}>
              <PackageOpen className="w-9 h-9 text-purple-400" />
            </div>
            <h2 className="font-black text-lg mb-2" style={{ color: "var(--foreground)" }}>Chưa có thực đơn</h2>
            <p className="text-sm mb-6 max-w-xs mx-auto" style={{ color: "var(--muted-foreground)" }}>
              Lên thực đơn cho các bữa ăn trước, danh sách nguyên liệu sẽ tự động được tạo tại đây!
            </p>
            <Link to="/meal-plan">
              <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg, #8b5cf6, #6d28d9)", boxShadow: `0 0 20px ${isBright ? "rgba(139,92,246,0.4)" : "rgba(139,92,246,0.3)"}` }}>
                <CalendarDays className="w-4 h-4" /> Lên thực đơn ngay <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <p className="text-xs mt-6" style={{ color: isBright ? "rgba(15,20,35,0.4)" : "rgba(255,255,255,0.2)" }}>— hoặc thêm nguyên liệu thủ công bên dưới —</p>
          </div>
          <div className="flex gap-2 mt-2">
            <input type="text" value={newItemInput} onChange={(e) => setNewItemInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addManual()}
              placeholder="Thêm nguyên liệu thủ công (VD: 200g thịt heo)..."
              className="flex-1 h-10 px-4 text-sm rounded-xl outline-none"
              style={{ background: isBright ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.06)", border: isBright ? "1px solid rgba(0,0,0,0.1)" : "1px solid rgba(255,255,255,0.1)", color: "var(--foreground)" }}
            />
            <button onClick={addManual} className="h-10 px-4 rounded-xl text-sm font-bold text-white flex items-center gap-1.5"
              style={{ background: "linear-gradient(135deg, #8b5cf6, #6d28d9)" }}>
              <Plus className="w-4 h-4" /> Thêm
            </button>
            {(manualItems.length > 0) && (
              <button
                onClick={handleFindMarket}
                className="h-10 px-4 rounded-xl text-sm font-bold text-white flex items-center gap-1.5 transition-all hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  boxShadow: "0 0 16px rgba(16,185,129,0.35)",
                  animation: "fadeSlideIn 0.3s ease",
                }}
              >
                <MapPin className="w-4 h-4" /> Tìm chợ gần bạn
              </button>
            )}
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
              <h1 className="text-2xl font-black" style={{ color: "var(--foreground)" }}>Danh sách đi chợ</h1>
            </div>
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Tổng hợp nguyên liệu từ thực đơn của bạn</p>
          </div>
          <button onClick={resetChecked}
            className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl transition-all"
            style={{ background: isBright ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)", border: isBright ? "1px solid rgba(0,0,0,0.1)" : "1px solid rgba(255,255,255,0.1)", color: "var(--muted-foreground)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = isBright ? "var(--foreground)" : "#94a3b8"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--muted-foreground)"; }}
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
                        style={{ background: isBright ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)", border: isBright ? "1px solid rgba(0,0,0,0.08)" : "1px solid rgba(255,255,255,0.08)", color: "var(--muted-foreground)" }}>
                        <CalendarDays className="w-3 h-3" />
                        <span className="font-semibold" style={{ color: isBright ? "rgba(15,20,35,0.7)" : "#94a3b8" }}>{formatDate(date)}</span>
                        <span style={{ color: isBright ? "rgba(15,20,35,0.3)" : "rgba(148,163,184,0.5)" }}>·</span>
                        <span>{meals.map((m) => MEAL_LABEL[m.mealType]).join(", ")}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <Link to="/meal-plan" className="flex-shrink-0">
                <button className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg transition-all"
                  style={{ color: "#a3e635", border: "1px solid rgba(163,230,53,0.3)", background: "rgba(163,230,53,0.1)" }}>
                  <ChefHat className="w-3.5 h-3.5" /> Sửa thực đơn
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* Progress */}
        <div className="mb-5 rounded-2xl p-4" style={{ background: "var(--card)", border: isBright ? "1px solid rgba(0,0,0,0.1)" : "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Tiến độ mua sắm</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold"
              style={checkedCount === totalItems && totalItems > 0
                ? { background: "rgba(163,230,53,0.15)", color: "#a3e635", border: "1px solid rgba(163,230,53,0.3)" }
                : { background: isBright ? "rgba(139,92,246,0.15)" : "rgba(139,92,246,0.1)", color: isBright ? "#7c3aed" : "#c4b5fd", border: isBright ? "1px solid rgba(139,92,246,0.3)" : "1px solid rgba(139,92,246,0.2)" }
              }>
              {checkedCount}/{totalItems} mặt hàng
            </span>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden" style={{ background: isBright ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.06)" }}>
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
        <div className="flex gap-2 mb-6 flex-wrap">
          <input type="text" value={newItemInput} onChange={(e) => setNewItemInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addManual()}
            placeholder="Thêm nguyên liệu thủ công (VD: 200g thịt heo)..."
            className="flex-1 h-10 px-4 text-sm rounded-xl outline-none"
            style={{ background: isBright ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.06)", border: isBright ? "1px solid rgba(0,0,0,0.1)" : "1px solid rgba(255,255,255,0.1)", color: "var(--foreground)", minWidth: "160px" }}
            onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(163,230,53,0.4)"; }}
            onBlur={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = isBright ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)"; }}
          />
          <button onClick={addManual} className="h-10 px-4 rounded-xl text-sm font-bold text-white flex items-center gap-1.5 transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg, #8b5cf6, #6d28d9)" }}>
            <Plus className="w-4 h-4" /> Thêm
          </button>
          {(manualItems.length > 0 || autoItems.length > 0) && (
            <button
              onClick={handleFindMarket}
              className="h-10 px-4 rounded-xl text-sm font-bold text-white flex items-center gap-1.5 transition-all hover:scale-105 ml-0 sm:ml-1"
              style={{
                background: "linear-gradient(135deg, #10b981, #059669)",
                boxShadow: "0 0 16px rgba(16,185,129,0.35)",
                animation: "fadeSlideIn 0.3s ease",
              }}
            >
              <MapPin className="w-4 h-4" /> Tìm chợ gần bạn
            </button>
          )}
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
                style={{ background: "var(--card)", border: `1px solid ${isBright ? config.borderColor.replace('0.2', '0.4') : config.borderColor}` }}>
                {/* Category header */}
                <button onClick={() => toggleCollapse(category)}
                  className="w-full flex items-center justify-between px-5 py-3 transition-colors"
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = isBright ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.03)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{config.emoji}</span>
                    <span className="font-bold text-sm" style={{ color: "var(--foreground)" }}>{category}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: isBright ? config.accentColor.replace('0.08', '0.15') : config.accentColor, color: isBright ? config.textColor.replace('#', '%23').includes('a3e635') ? '#166534' : config.textColor : config.textColor }}>
                      {checkedInCat}/{catItems.length}
                    </span>
                  </div>
                  {isCollapsed ? <ChevronDown className="w-4 h-4" style={{ color: "var(--muted-foreground)" }} /> : <ChevronUp className="w-4 h-4" style={{ color: "var(--muted-foreground)" }} />}
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
                          <span className={`text-sm font-bold ${item.checked ? "line-through opacity-40" : ""}`}
                            style={item.checked ? { color: "var(--muted-foreground)" } : { color: "var(--foreground)" }}>
                            {item.name}
                          </span>
                          {item.fromRecipes && item.fromRecipes.length > 0 && (
                            <p className="text-[11px] mt-0.5 truncate font-medium" style={{ color: "var(--muted-foreground)", opacity: item.checked ? 0.4 : 0.7 }}>
                              {item.fromRecipes.join(" · ")}
                            </p>
                          )}
                          {item.isManual && <span className="text-[10px] font-bold" style={{ color: isBright ? "#7c3aed" : "#c4b5fd" }}>Thêm thủ công</span>}
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
            <button className="inline-flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl transition-all font-semibold"
              style={{ color: "var(--muted-foreground)", border: isBright ? "1px solid rgba(0,0,0,0.1)" : "1px solid rgba(255,255,255,0.08)", background: isBright ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.03)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#a3e635";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(163,230,53,0.3)";
                if (isBright) (e.currentTarget as HTMLButtonElement).style.background = "rgba(163,230,53,0.05)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "var(--muted-foreground)";
                (e.currentTarget as HTMLButtonElement).style.borderColor = isBright ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.08)";
                if (isBright) (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,0,0,0.03)";
              }}
            >
              <CalendarDays className="w-4 h-4" /> Chỉnh sửa thực đơn <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </main>

      {/* ── Location Finding Overlay with Spinning Earth ── */}
      {showLocationOverlay && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{
            background: overlayPhase === "done"
              ? "#0f1117"
              : "radial-gradient(ellipse at center, #0a1628 0%, #050a14 60%, #000 100%)",
            transition: "background 0.8s ease",
          }}>

          {/* Stars background — fade out when zooming */}
          <div className="absolute inset-0 overflow-hidden transition-opacity duration-1000"
            style={{ opacity: overlayPhase === "scanning" ? 1 : 0 }}>
            {Array.from({ length: 80 }).map((_, i) => (
              <div key={i} className="absolute rounded-full"
                style={{
                  width: `${(i % 3) + 1}px`,
                  height: `${(i % 3) + 1}px`,
                  left: `${(i * 37 + 13) % 100}%`,
                  top: `${(i * 53 + 7) % 100}%`,
                  background: i % 5 === 0 ? "#a5f3fc" : "#fff",
                  opacity: ((i * 17) % 60 + 10) / 100,
                  animation: `twinkle ${(i % 3) + 2}s ease-in-out infinite`,
                  animationDelay: `${(i % 5) * 0.6}s`,
                }}
              />
            ))}
          </div>

          {/* Spinning Earth — zooms in when location found */}
          <div className="relative transition-all duration-[2000ms] ease-in-out"
            style={{
              animation: overlayPhase === "scanning" ? "floatEarth 3s ease-in-out infinite" : "none",
              transform: overlayPhase === "zooming"
                ? "scale(3.5) translateY(10%)"
                : overlayPhase === "done"
                  ? "scale(6) translateY(15%)"
                  : "scale(1)",
              opacity: overlayPhase === "done" ? 0 : 1,
            }}>
            {/* Outer glow */}
            <div className="absolute rounded-full"
              style={{
                width: 400, height: 400,
                top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                background: "radial-gradient(circle, rgba(56,189,248,0.25) 0%, rgba(56,189,248,0.08) 40%, transparent 70%)",
                animation: overlayPhase === "scanning" ? "pulseGlow 2s ease-in-out infinite" : "none",
                opacity: overlayPhase === "zooming" ? 0.3 : 1,
                transition: "opacity 1s ease",
              }}
            />

            <svg width="320" height="320" viewBox="0 0 400 400" className="relative z-10"
              style={{
                animation: overlayPhase === "scanning" ? "spinEarth 6s linear infinite" : "none",
                filter: overlayPhase === "zooming"
                  ? "drop-shadow(0 0 80px rgba(56,189,248,0.5)) blur(0.5px)"
                  : "drop-shadow(0 0 50px rgba(56,189,248,0.35)) drop-shadow(0 0 100px rgba(56,189,248,0.15))",
                transition: "filter 1s ease",
              }}>
              <defs>
                <radialGradient id="earthOcean" cx="38%" cy="38%" r="62%">
                  <stop offset="0%" stopColor="#64b5f6" />
                  <stop offset="25%" stopColor="#42a5f5" />
                  <stop offset="50%" stopColor="#1e88e5" />
                  <stop offset="80%" stopColor="#0d47a1" />
                  <stop offset="100%" stopColor="#0a2342" />
                </radialGradient>
                <radialGradient id="atmo" cx="50%" cy="50%" r="50%">
                  <stop offset="80%" stopColor="transparent" />
                  <stop offset="93%" stopColor="rgba(100,200,255,0.08)" />
                  <stop offset="100%" stopColor="rgba(56,189,248,0.2)" />
                </radialGradient>
                <linearGradient id="landGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#66bb6a" />
                  <stop offset="100%" stopColor="#2e7d32" />
                </linearGradient>
                <linearGradient id="landGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#81c784" />
                  <stop offset="100%" stopColor="#388e3c" />
                </linearGradient>
                <linearGradient id="desertGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#d4a843" />
                  <stop offset="100%" stopColor="#a67c2e" />
                </linearGradient>
                <clipPath id="globe"><circle cx="200" cy="200" r="176" /></clipPath>
              </defs>

              {/* Ocean base */}
              <circle cx="200" cy="200" r="176" fill="url(#earthOcean)" />

              {/* Continents */}
              <g clipPath="url(#globe)">
                {/* North America */}
                <path d="M55,95 C60,80 75,68 90,62 C105,56 120,58 130,65 C140,72 145,82 142,95 
                  C140,105 135,112 128,120 C122,128 118,138 115,148 C112,158 108,165 100,168 
                  C92,171 82,168 75,160 C68,152 62,140 58,128 C54,116 52,108 55,95Z"
                  fill="url(#landGrad2)" />
                <path d="M42,78 C48,72 56,70 62,74 C68,78 70,85 66,90 C62,95 55,97 48,94 C41,91 38,84 42,78Z"
                  fill="#4caf50" />
                <path d="M100,168 C104,172 110,175 112,182 C114,189 112,196 106,200 
                  C100,204 95,202 92,196 C89,190 90,182 93,176 C95,172 98,170 100,168Z"
                  fill="#43a047" />
                <path d="M130,42 C138,36 150,35 158,40 C166,45 168,55 164,64 
                  C160,73 152,78 142,76 C132,74 126,66 126,56 C126,48 128,44 130,42Z"
                  fill="#c8e6c9" />

                {/* South America */}
                <path d="M102,210 C110,205 120,208 126,216 C132,224 134,235 132,248 
                  C130,261 125,274 118,284 C111,294 103,302 95,305 
                  C87,308 80,304 76,296 C72,288 70,276 72,262 
                  C74,248 78,236 84,226 C90,216 96,212 102,210Z"
                  fill="url(#landGrad1)" />

                {/* Europe */}
                <path d="M185,70 C192,64 202,62 210,66 C218,70 222,78 220,88 
                  C218,95 212,100 205,102 C198,104 190,102 186,96 
                  C182,90 180,82 182,76 C183,73 184,71 185,70Z"
                  fill="#81c784" />
                <path d="M200,48 C205,44 212,44 216,48 C220,52 220,60 216,66 
                  C212,72 206,74 200,70 C194,66 194,56 200,48Z"
                  fill="#a5d6a7" />
                <path d="M172,72 C176,68 182,68 184,72 C186,76 184,82 180,84 
                  C176,86 172,84 170,80 C168,76 170,74 172,72Z"
                  fill="#66bb6a" />

                {/* Africa */}
                <path d="M190,115 C200,108 214,106 224,112 C234,118 238,130 236,144 
                  C234,158 228,172 220,186 C212,200 204,212 196,220 
                  C188,228 180,230 174,224 C168,218 166,206 168,190 
                  C170,174 176,158 182,144 C186,134 188,122 190,115Z"
                  fill="url(#landGrad1)" />
                <path d="M248,195 C252,190 256,190 258,194 C260,198 260,206 256,212 
                  C252,218 248,218 246,214 C244,210 244,200 248,195Z"
                  fill="#4caf50" />
                <path d="M195,118 C204,114 216,115 222,120 C228,125 228,132 222,138 
                  C216,142 206,142 198,138 C190,134 188,126 195,118Z"
                  fill="url(#desertGrad)" opacity="0.6" />

                {/* Asia */}
                <path d="M230,60 C248,52 270,50 288,56 C306,62 318,76 322,94 
                  C326,112 322,132 312,148 C302,164 288,174 272,178 
                  C256,182 240,178 228,168 C216,158 210,144 210,128 
                  C210,112 216,96 224,82 C228,74 230,66 230,60Z"
                  fill="url(#landGrad2)" />
                <path d="M262,155 C270,148 280,150 284,158 C288,166 286,178 280,188 
                  C274,198 266,202 260,196 C254,190 254,178 258,168 C260,162 261,158 262,155Z"
                  fill="#43a047" />
                <path d="M300,160 C308,155 316,158 320,166 C324,174 320,184 314,190 
                  C308,196 300,194 296,186 C292,178 294,168 300,160Z"
                  fill="#388e3c" />
                <path d="M330,80 C334,74 340,74 342,80 C344,86 342,96 338,102 
                  C334,108 330,108 328,102 C326,96 326,86 330,80Z"
                  fill="#66bb6a" />
                <path d="M318,82 C322,78 326,80 326,86 C326,92 322,96 318,94 C314,92 314,86 318,82Z"
                  fill="#4caf50" />
                <path d="M305,200 C310,198 316,200 318,205 C320,210 316,215 310,216 C304,217 300,214 300,208 C300,203 302,200 305,200Z"
                  fill="#2e7d32" />
                <path d="M322,208 C326,206 330,208 330,213 C330,218 326,220 322,218 C318,216 318,210 322,208Z"
                  fill="#388e3c" />
                <path d="M270,200 C273,198 276,200 276,204 C276,208 273,210 270,208 C267,206 267,202 270,200Z"
                  fill="#4caf50" />

                {/* Australia & NZ */}
                <path d="M310,240 C322,232 340,230 354,236 C368,242 374,254 372,268 
                  C370,282 360,292 346,296 C332,300 318,296 308,286 
                  C298,276 296,262 302,250 C306,244 308,242 310,240Z"
                  fill="url(#landGrad1)" />
                <path d="M372,306 C376,302 380,304 380,310 C380,316 376,322 372,322 
                  C368,322 366,316 368,310 C369,308 370,306 372,306Z"
                  fill="#66bb6a" />
                <path d="M366,324 C370,322 372,326 370,330 C368,334 364,334 362,330 C360,326 362,324 366,324Z"
                  fill="#4caf50" />

                {/* Poles */}
                <path d="M150,26 C170,22 210,20 245,22 C265,24 270,30 260,36 
                  C240,42 200,44 170,40 C150,38 140,32 150,26Z"
                  fill="#e8f5e9" opacity="0.5" />
                <path d="M120,365 C150,358 200,356 260,358 C300,360 320,368 300,374 
                  C270,380 210,382 160,378 C130,376 110,372 120,365Z"
                  fill="#e0e0e0" opacity="0.4" />
              </g>

              {/* Cloud layers */}
              <g clipPath="url(#globe)" opacity="0.25">
                <path d="M60,90 C80,85 120,82 160,86 C180,88 190,92 170,96 C140,100 90,98 60,90Z" fill="white" />
                <path d="M220,150 C250,145 290,148 320,155 C340,160 335,168 310,170 C280,172 240,165 220,150Z" fill="white" />
                <path d="M80,200 C110,194 160,192 200,196 C230,200 235,208 210,212 C175,216 110,212 80,200Z" fill="white" />
                <path d="M140,280 C170,275 210,276 240,282 C260,286 258,294 235,296 C200,298 160,290 140,280Z" fill="white" />
                <path d="M280,100 C300,95 330,96 350,102 C360,106 355,112 340,114 C315,116 290,110 280,100Z" fill="white" />
              </g>

              {/* Atmosphere + highlight */}
              <circle cx="200" cy="200" r="176" fill="url(#atmo)" />
              <ellipse cx="145" cy="125" rx="55" ry="50" fill="rgba(255,255,255,0.06)" />
              <ellipse cx="130" cy="110" rx="30" ry="25" fill="rgba(255,255,255,0.04)" />
            </svg>

            {/* Location pin */}
            <div className="absolute z-20 transition-all duration-1000"
              style={{
                top: overlayPhase === "zooming" ? "32%" : "28%",
                left: overlayPhase === "zooming" ? "52%" : "56%",
                animation: overlayPhase === "scanning" ? "bouncePin 1s ease-in-out infinite" : "none",
                transform: overlayPhase === "zooming" ? "scale(0.4)" : "scale(1)",
              }}>
              <MapPin className="w-8 h-8 text-red-400" style={{ filter: "drop-shadow(0 2px 8px rgba(239,68,68,0.6))" }} />
            </div>
          </div>

          {/* Found location card — appears when zooming */}
          {(overlayPhase === "zooming" || overlayPhase === "done") && foundLocation && (
            <div className="absolute z-30 flex flex-col items-center"
              style={{
                top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                animation: "fadeSlideIn 0.6s ease",
              }}>
              <div className="rounded-2xl px-8 py-5 text-center"
                style={{
                  background: "rgba(15,17,23,0.85)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(163,230,53,0.3)",
                  boxShadow: "0 0 40px rgba(163,230,53,0.15), 0 20px 60px rgba(0,0,0,0.5)",
                }}>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-lime-400 rounded-full" style={{ animation: "pulseGlow 1.5s ease-in-out infinite", boxShadow: "0 0 10px rgba(163,230,53,0.6)" }} />
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#a3e635" }}>Vị trí đã xác định</span>
                </div>
                <p className="text-xl font-black text-white mb-1">{foundLocation}</p>
                <p className="text-sm" style={{ color: "#94a3b8" }}>{locationMessage}</p>
              </div>
            </div>
          )}

          {/* Status text — bottom, only during scanning */}
          {overlayPhase === "scanning" && (
            <div className="mt-12 text-center z-10" style={{ animation: "fadeSlideIn 0.5s ease" }}>
              <div className="flex items-center justify-center gap-2.5 mb-3">
                <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
                <p className="text-lg font-semibold text-white">
                  {locationMessage}
                </p>
              </div>
              <p className="text-sm" style={{ color: "rgba(148,163,184,0.6)" }}>
                Vui lòng cho phép truy cập định vị để có kết quả chính xác hơn
              </p>
            </div>
          )}

          {/* Scanning rings — only during scanning phase */}
          {overlayPhase === "scanning" && (
            <>
              <div className="absolute" style={{ top: "calc(50% - 20px)", left: "50%", transform: "translate(-50%, -50%)" }}>
                <div className="rounded-full" style={{
                  width: 360, height: 360,
                  border: "1px solid rgba(56,189,248,0.15)",
                  animation: "scanRing 2.5s ease-out infinite",
                }} />
              </div>
              <div className="absolute" style={{ top: "calc(50% - 20px)", left: "50%", transform: "translate(-50%, -50%)" }}>
                <div className="rounded-full" style={{
                  width: 360, height: 360,
                  border: "1px solid rgba(56,189,248,0.1)",
                  animation: "scanRing 2.5s ease-out infinite 0.8s",
                }} />
              </div>
              <div className="absolute" style={{ top: "calc(50% - 20px)", left: "50%", transform: "translate(-50%, -50%)" }}>
                <div className="rounded-full" style={{
                  width: 360, height: 360,
                  border: "1px solid rgba(56,189,248,0.06)",
                  animation: "scanRing 2.5s ease-out infinite 1.6s",
                }} />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

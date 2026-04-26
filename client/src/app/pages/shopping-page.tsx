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
import { ThreeGlobe } from "../components/three-globe";

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

      {/* ── Location Finding Overlay with 3D Globe ── */}
      {showLocationOverlay && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{
            background: overlayPhase === "done"
              ? "#0f1117"
              : "radial-gradient(ellipse at center, #0a1628 0%, #050a14 60%, #000 100%)",
            transition: "background 0.8s ease",
          }}>

          {/* 3D Globe (Three.js) — fills the entire overlay */}
          <ThreeGlobe phase={overlayPhase} />

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
            <div className="absolute bottom-20 left-0 right-0 text-center z-10" style={{ animation: "fadeSlideIn 0.5s ease" }}>
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
        </div>
      )}
    </div>
  );
}

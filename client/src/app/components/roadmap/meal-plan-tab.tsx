import { Link } from "react-router";
import { useState } from "react";
import {
  Plus, X, ChefHat, Clock, Flame, Search, ShoppingCart,
  ArrowRight, Dumbbell, Droplet, Zap, Leaf, Target, ChevronDown,
} from "lucide-react";
import { useMealPlan } from "../../contexts/meal-plan-context";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { favoriteApi } from "../../../apis/favorite.api";
import { mockRecipes } from "../../data/mock-recipes";
import { toast } from "sonner";
import { useBrightness } from "../../contexts/brightness-context";

// ─── Constants ─────────────────────────────────────────────────────────────────

const MEAL_SLOTS = [
  { value: "breakfast" as const, label: "Bữa sáng", emoji: "🌅", time: "6:00 – 9:00", accentColor: "rgba(251,191,36,0.06)", borderColor: "rgba(251,191,36,0.25)", headerColor: "#fbbf24" },
  { value: "lunch" as const, label: "Bữa trưa", emoji: "☀️", time: "11:00 – 13:00", accentColor: "rgba(163,230,53,0.06)", borderColor: "rgba(163,230,53,0.25)", headerColor: "#a3e635" },
  { value: "snack" as const, label: "Bữa phụ", emoji: "🍌", time: "9:30 – 16:30", accentColor: "rgba(251,146,60,0.06)", borderColor: "rgba(251,146,60,0.25)", headerColor: "#fb923c" },
  { value: "dinner" as const, label: "Chiều / Tối", emoji: "🌙", time: "17:00 – 20:00", accentColor: "rgba(139,92,246,0.06)", borderColor: "rgba(139,92,246,0.25)", headerColor: "#c4b5fd" },
];

// ─── Nutrition helpers ─────────────────────────────────────────────────────────

function parseCalories(cal: string): number {
  const m = cal?.match(/(\d+)/);
  return m ? parseInt(m[1]) : 0;
}
function estimateMacros(calories: number) {
  return {
    protein: Math.round((calories * 0.30) / 4),
    carbs: Math.round((calories * 0.40) / 4),
    fat: Math.round((calories * 0.30) / 9),
    fiber: Math.round((calories * 0.30) / 4 * 0.25),
  };
}

// ─── Date helpers ──────────────────────────────────────────────────────────────

function getThreeDays() {
  return [0, 1, 2].map((offset) => { const d = new Date(); d.setDate(d.getDate() + offset); return d; });
}
function formatDate(date: Date) { return date.toISOString().split("T")[0]; }
function dayLabel(offset: number) {
  if (offset === 0) return "Hôm nay";
  if (offset === 1) return "Ngày mai";
  return "Ngày kia";
}

// ─── Schedule (times) ──────────────────────────────────────────────────────────

type ScheduleTimes = {
  breakfast: string;
  lunch: string;
  snack: string;
  dinner: string;
};

const DEFAULT_SCHEDULE_TIMES: ScheduleTimes = {
  breakfast: "07:00",
  snack: "10:00",
  lunch: "13:00",
  dinner: "19:00",
};

function loadScheduleTimes(): ScheduleTimes {
  try {
    const s = localStorage.getItem("mealyummy-schedule-times");
    return s ? { ...DEFAULT_SCHEDULE_TIMES, ...JSON.parse(s) } : DEFAULT_SCHEDULE_TIMES;
  } catch {
    return DEFAULT_SCHEDULE_TIMES;
  }
}

function saveScheduleTimes(t: ScheduleTimes) {
  localStorage.setItem("mealyummy-schedule-times", JSON.stringify(t));
}

// ─── Body Metrics & TDEE ───────────────────────────────────────────────────────

interface UserMetrics {
  weight: number;   // kg
  height: number;   // cm
  age: number;
  gender: "male" | "female";
  activity: "sedentary" | "light" | "moderate" | "active" | "very_active";
  goal: "cut" | "maintain" | "bulk";
}

const DEFAULT_METRICS: UserMetrics = {
  weight: 70, height: 170, age: 25,
  gender: "male", activity: "moderate", goal: "maintain",
};

const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};
const GOAL_ADJUSTMENTS = { cut: -500, maintain: 0, bulk: +300 };

function calcTDEE(m: UserMetrics) {
  // Mifflin-St Jeor BMR
  const bmr = m.gender === "male"
    ? 10 * m.weight + 6.25 * m.height - 5 * m.age + 5
    : 10 * m.weight + 6.25 * m.height - 5 * m.age - 161;
  const tdee = Math.round(bmr * ACTIVITY_MULTIPLIERS[m.activity]);
  const target = tdee + GOAL_ADJUSTMENTS[m.goal];
  // Macros based on goal
  const protein = m.goal === "bulk" ? Math.round(m.weight * 2.2) : Math.round(m.weight * 1.8);
  const fat = Math.round((target * 0.25) / 9);
  const carbs = Math.round((target - protein * 4 - fat * 9) / 4);
  const fiber = Math.round(target / 1000 * 14); // 14g / 1000kcal
  return { calories: target, protein: Math.max(protein, 50), carbs: Math.max(carbs, 50), fat: Math.max(fat, 20), fiber: Math.max(fiber, 20), bmr, tdee };
}

function loadMetrics(): UserMetrics {
  try {
    const s = localStorage.getItem("mealyummy-metrics");
    return s ? { ...DEFAULT_METRICS, ...JSON.parse(s) } : DEFAULT_METRICS;
  } catch { return DEFAULT_METRICS; }
}
function saveMetrics(m: UserMetrics) {
  localStorage.setItem("mealyummy-metrics", JSON.stringify(m));
}

// ─── Nutrition Ring ────────────────────────────────────────────────────────────

function NutritionRing({ value, max, color, size = 56 }: { value: number; max: number; color: string; size?: number }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(1, value / max);
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="6"
        strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.6s ease" }} />
    </svg>
  );
}

// ─── Daily Nutrition Panel ─────────────────────────────────────────────────────

type NutritionTargets = { calories: number; protein: number; carbs: number; fat: number; fiber: number };

function DayNutritionPanel({ dateStr, mealPlan, targets }: { dateStr: string; mealPlan: any[]; targets: NutritionTargets }) {
  const { isBright } = useBrightness();
  const dayMeals = mealPlan.filter((m) => m.date === dateStr);
  const totalCal = dayMeals.reduce((s, m) => s + parseCalories(m.recipe.calories), 0);
  const totals = dayMeals.reduce((s, m) => {
    const mac = estimateMacros(parseCalories(m.recipe.calories));
    return { protein: s.protein + mac.protein, carbs: s.carbs + mac.carbs, fat: s.fat + mac.fat, fiber: s.fiber + mac.fiber };
  }, { protein: 0, carbs: 0, fat: 0, fiber: 0 });

  const macros = [
    { label: "Protein", value: totals.protein, max: targets.protein, unit: "g", color: "#a3e635", icon: <Dumbbell className="w-3.5 h-3.5" /> },
    { label: "Carbs", value: totals.carbs, max: targets.carbs, unit: "g", color: "#fb923c", icon: <Zap className="w-3.5 h-3.5" /> },
    { label: "Fat", value: totals.fat, max: targets.fat, unit: "g", color: "#c4b5fd", icon: <Droplet className="w-3.5 h-3.5" /> },
    { label: "Chất xơ", value: totals.fiber, max: targets.fiber, unit: "g", color: "#34d399", icon: <Leaf className="w-3.5 h-3.5" /> },
  ];

  const calPct = Math.round(Math.min(100, (totalCal / targets.calories) * 100));

  return (
    <div className="rounded-2xl p-5 mb-5" style={{ background: "var(--card)", border: isBright ? "1px solid rgba(0,0,0,0.1)" : "1px solid rgba(255,255,255,0.07)" }}>
      {/* Top: calo big + ring */}
      <div className="flex items-center gap-5 mb-5">
        <div className="relative flex-shrink-0">
          <NutritionRing value={totalCal} max={targets.calories} color="#a3e635" size={80} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs font-black leading-none" style={{ color: "var(--foreground)" }}>{calPct}%</span>
          </div>
        </div>
        <div className="flex-1">
          <p className="text-xs font-bold mb-1" style={{ color: "var(--muted-foreground)" }}>Tổng calo trong ngày</p>
          <p className="text-4xl font-black leading-none" style={{ color: "var(--foreground)" }}>
            {totalCal > 0 ? totalCal.toLocaleString() : "—"}
            <span className="text-base font-bold ml-1" style={{ color: "var(--muted-foreground)" }}>/ {targets.calories.toLocaleString()} kcal</span>
          </p>
          <div className="mt-2 h-2 rounded-full overflow-hidden" style={{ background: isBright ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.06)" }}>
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${calPct}%`, background: calPct >= 90 ? "linear-gradient(90deg,#fb923c,#f87171)" : "linear-gradient(90deg,#a3e635,#4ade80)" }} />
          </div>
          <p className="text-xs mt-1 font-medium" style={{ color: isBright ? "rgba(15,20,35,0.5)" : "#475569" }}>
            {totalCal === 0 ? "Chưa có bữa ăn nào" : calPct >= 100 ? "⚠️ Đã đạt mục tiêu calo" : `Còn thiếu ${targets.calories - totalCal} kcal`}
          </p>
        </div>
      </div>

      {/* Macro grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {macros.map((m) => {
          const pct = Math.min(100, Math.round((m.value / m.max) * 100));
          const macroColor = isBright && m.color === "#a3e635" ? "#166534" : m.color;
          return (
            <div key={m.label} className="rounded-xl p-3"
              style={{ background: isBright ? `${m.color}15` : `${m.color}09`, border: isBright ? `1px solid ${m.color}40` : `1px solid ${m.color}25` }}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5" style={{ color: macroColor }}>
                  {m.icon}
                  <span className="text-xs font-bold">{m.label}</span>
                </div>
                <span className="text-xs font-bold" style={{ color: isBright ? "rgba(15,20,35,0.5)" : "#475569" }}>{pct}%</span>
              </div>
              <p className="text-xl font-black mb-1.5" style={{ color: "var(--foreground)" }}>
                {m.value}<span className="text-xs font-normal ml-0.5" style={{ color: "var(--muted-foreground)" }}>{m.unit}</span>
              </p>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: isBright ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.06)" }}>
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: m.color, transition: "width 0.6s ease" }} />
              </div>
              <p className="text-[10px] mt-1 font-medium" style={{ color: isBright ? "rgba(15,20,35,0.4)" : "#334155" }}>mục tiêu {m.max}{m.unit}</p>
            </div>
          );
        })}
      </div>

      {/* Meal completeness indicator */}
      {dayMeals.length > 0 && (
        <div className="mt-4 flex items-center gap-3 pt-4" style={{ borderTop: isBright ? "1px solid rgba(0,0,0,0.08)" : "1px solid rgba(255,255,255,0.05)" }}>
          <Target className="w-4 h-4 flex-shrink-0" style={{ color: isBright ? "#166534" : "#a3e635" }} />
          <p className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>
            {dayMeals.length} bữa · ~{Math.round(totalCal / Math.max(1, dayMeals.length))} kcal/bữa trung bình ·&nbsp;
            <span className="font-bold" style={{ color: isBright ? "#166534" : "#a3e635" }}>{totals.protein}g protein</span>
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export function MealPlanTab() {
  const { mealPlan, addToMealPlan, removeFromMealPlan } = useMealPlan();
  const { data: favoriteMealsData } = useQuery({
    queryKey: ["favoriteMeals"],
    queryFn: () => favoriteApi.getFavoriteMeals(0, 50)
  });
  const favorites = favoriteMealsData?.content || [];
  const { isBright } = useBrightness();
  const [activeDay, setActiveDay] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingSlot, setPendingSlot] = useState<{ date: string; mealType: "breakfast" | "lunch" | "dinner" | "snack" } | null>(null);
  const [search, setSearch] = useState("");
  const [metrics, setMetrics] = useState<UserMetrics>(loadMetrics);
  const [metricsOpen, setMetricsOpen] = useState(false);
  const [scheduleTimes, setScheduleTimes] = useState<ScheduleTimes>(loadScheduleTimes);

  const targets = calcTDEE(metrics);

  function updateMetrics(patch: Partial<UserMetrics>) {
    setMetrics((prev) => { const next = { ...prev, ...patch }; saveMetrics(next); return next; });
  }

  function updateScheduleTime(key: keyof ScheduleTimes, value: string) {
    setScheduleTimes((prev) => {
      const next = { ...prev, [key]: value };
      saveScheduleTimes(next);
      toast.success("Đã cập nhật thời khóa biểu");
      return next;
    });
  }

  const days = getThreeDays();
  const allRecipes = [...favorites, ...mockRecipes.filter((r) => !favorites.find((f) => f.id === r.id))];
  const filtered = allRecipes.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()));

  function getMeals(date: string, mealType: string) {
    return mealPlan.filter((item) => item.date === date && item.mealType === mealType);
  }
  function openDialog(date: string, mealType: "breakfast" | "lunch" | "dinner" | "snack") {
    setPendingSlot({ date, mealType }); setSearch(""); setDialogOpen(true);
  }
  function handlePick(recipe: any) {
    if (!pendingSlot) return;
    addToMealPlan(recipe, pendingSlot.date, pendingSlot.mealType);
    toast.success(`Đã thêm ${recipe.name} vào thực đơn!`);
    setDialogOpen(false);
  }

  const activeDateStr = formatDate(days[activeDay]);
  const totalMealCount = mealPlan.length;

  return (
    <div className="animate-in fade-in duration-500">
      <main className="max-w-4xl mx-auto py-6">
        {/* ── Header ── */}
        <div className="pt-10 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3 text-xs font-bold uppercase tracking-widest"
            style={{ background: isBright ? "rgba(163,230,53,0.15)" : "rgba(163,230,53,0.08)", border: isBright ? "1px solid rgba(163,230,53,0.3)" : "1px solid rgba(163,230,53,0.2)", color: isBright ? "#166534" : "#a3e635" }}>
            <ChefHat className="w-3.5 h-3.5" /> Thực Đơn
          </div>
          <h1 className="text-2xl font-black mb-1" style={{ color: "var(--foreground)" }}>Kế hoạch 3 ngày</h1>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Lên lịch bữa ăn và theo dõi dinh dưỡng mỗi ngày</p>
        </div>

        {/* ── Body Metrics Panel ── */}
        <div className="mb-5 rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(163,230,53,0.2)" }}>
          {/* Toggle header */}
          <button
            onClick={() => setMetricsOpen(!metricsOpen)}
            className="w-full flex items-center justify-between px-5 py-4 transition-all"
            style={{ background: metricsOpen ? "rgba(163,230,53,0.08)" : "rgba(26,31,46,0.9)" }}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #a3e635, #4ade80)" }}>
                <span className="text-sm">⚖️</span>
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-white">Thông tin cơ thể</p>
                <p className="text-xs" style={{ color: "#64748b" }}>
                  TDEE: <span style={{ color: "#a3e635" }}>{targets.tdee.toLocaleString()} kcal</span>
                  &nbsp;·&nbsp;Mục tiêu: <span style={{ color: "#a3e635" }}>{targets.calories.toLocaleString()} kcal</span>
                  &nbsp;·&nbsp;{metrics.weight}kg / {metrics.height}cm
                </p>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 transition-transform flex-shrink-0" style={{ color: "#64748b", transform: metricsOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
          </button>

          {metricsOpen && (
            <div className="px-5 pb-5 pt-1" style={{ background: "rgba(26,31,46,0.95)" }}>
              {/* Gender */}
              <div className="mb-4">
                <p className="text-xs font-semibold mb-2" style={{ color: "#94a3b8" }}>Giới tính</p>
                <div className="flex gap-2">
                  {(["male", "female"] as const).map((g) => (
                    <button key={g} onClick={() => updateMetrics({ gender: g })}
                      className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all"
                      style={metrics.gender === g
                        ? { background: "linear-gradient(135deg, #a3e635, #4ade80)", color: "#0f1117" }
                        : { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#64748b" }}>
                      {g === "male" ? "👨 Nam" : "👩 Nữ"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Weight / Height / Age row */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {([
                  { key: "weight" as const, label: "Cân nặng", unit: "kg", min: 30, max: 200 },
                  { key: "height" as const, label: "Chiều cao", unit: "cm", min: 100, max: 250 },
                  { key: "age" as const, label: "Tuổi", unit: "tuổi", min: 10, max: 99 },
                ]).map(({ key, label, unit, min, max }) => (
                  <div key={key}>
                    <p className="text-xs font-semibold mb-1.5" style={{ color: "#94a3b8" }}>{label}</p>
                    <div className="flex items-center rounded-xl overflow-hidden" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                      <button onClick={() => updateMetrics({ [key]: Math.max(min, metrics[key] - 1) })}
                        className="w-8 h-10 flex items-center justify-center text-lg font-bold flex-shrink-0 transition-colors"
                        style={{ color: "#64748b" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#a3e635"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#64748b"; }}>−</button>
                      <div className="flex-1 text-center">
                        <p className="text-base font-black text-white">{metrics[key]}</p>
                        <p className="text-[10px]" style={{ color: "#475569" }}>{unit}</p>
                      </div>
                      <button onClick={() => updateMetrics({ [key]: Math.min(max, metrics[key] + 1) })}
                        className="w-8 h-10 flex items-center justify-center text-lg font-bold flex-shrink-0 transition-colors"
                        style={{ color: "#64748b" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#a3e635"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#64748b"; }}>+</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Activity */}
              <div className="mb-4">
                <p className="text-xs font-semibold mb-2" style={{ color: "#94a3b8" }}>Mức độ hoạt động</p>
                <div className="grid grid-cols-1 gap-1.5">
                  {([
                    { value: "sedentary", label: "🪑 Ít vận động (ngồi nhiều)" },
                    { value: "light", label: "🚶 Nhẹ (1–3 buổi/tuần)" },
                    { value: "moderate", label: "🏃 Trung bình (3–5 buổi/tuần)" },
                    { value: "active", label: "💪 Nặng (6–7 buổi/tuần)" },
                    { value: "very_active", label: "🔥 Rất nặng (2 buổi/ngày)" },
                  ] as const).map((opt) => (
                    <button key={opt.value} onClick={() => updateMetrics({ activity: opt.value })}
                      className="text-left px-3 py-2 rounded-xl text-xs font-medium transition-all"
                      style={metrics.activity === opt.value
                        ? { background: "rgba(163,230,53,0.12)", color: "#a3e635", border: "1px solid rgba(163,230,53,0.3)" }
                        : { background: "rgba(255,255,255,0.04)", color: "#64748b", border: "1px solid rgba(255,255,255,0.06)" }}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Goal */}
              <div className="mb-5">
                <p className="text-xs font-semibold mb-2" style={{ color: "#94a3b8" }}>Mục tiêu</p>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { value: "cut", label: "🔽 Giảm mỡ", color: "#f87171" },
                    { value: "maintain", label: "⚖️ Duy trì", color: "#a3e635" },
                    { value: "bulk", label: "🔼 Tăng cơ", color: "#fb923c" },
                  ] as const).map((opt) => (
                    <button key={opt.value} onClick={() => updateMetrics({ goal: opt.value })}
                      className="py-2.5 rounded-xl text-xs font-semibold transition-all"
                      style={metrics.goal === opt.value
                        ? { background: `${opt.color}20`, color: opt.color, border: `1px solid ${opt.color}50` }
                        : { background: "rgba(255,255,255,0.04)", color: "#64748b", border: "1px solid rgba(255,255,255,0.08)" }}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Result summary */}
              <div className="rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-3"
                style={{ background: "rgba(163,230,53,0.06)", border: "1px solid rgba(163,230,53,0.15)" }}>
                {[
                  { label: "BMR", value: targets.bmr, unit: "kcal", color: "#94a3b8" },
                  { label: "TDEE", value: targets.tdee, unit: "kcal", color: "#fb923c" },
                  { label: "Mục tiêu", value: targets.calories, unit: "kcal", color: "#a3e635" },
                  { label: "Protein", value: targets.protein, unit: "g", color: "#4ade80" },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <p className="text-xs mb-0.5" style={{ color: "#475569" }}>{s.label}</p>
                    <p className="text-lg font-black" style={{ color: s.color }}>{s.value.toLocaleString()}<span className="text-xs font-normal ml-0.5" style={{ color: "#475569" }}>{s.unit}</span></p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Shopping CTA ── */}
        {totalMealCount > 0 && (
          <div className="mb-5 flex items-center justify-between gap-4 rounded-2xl px-5 py-3.5"
            style={{ 
              background: isBright ? "rgba(139,92,246,0.12)" : "rgba(139,92,246,0.08)", 
              border: isBright ? "1px solid rgba(139,92,246,0.35)" : "1px solid rgba(139,92,246,0.2)" 
            }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #8b5cf6, #6d28d9)" }}>
                <ShoppingCart className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: isBright ? "#5b21b6" : "#c4b5fd" }}>Đã có {totalMealCount} bữa trong thực đơn</p>
                <p className="text-xs font-medium" style={{ color: isBright ? "rgba(91,33,182,0.7)" : "rgba(196,181,253,0.6)" }}>Danh sách đi chợ đã được cập nhật tự động</p>
              </div>
            </div>
            <Link to="/shopping" className="flex-shrink-0">
              <button className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl text-white transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg, #8b5cf6, #6d28d9)", boxShadow: `0 4px 12px ${isBright ? "rgba(139,92,246,0.4)" : "rgba(139,92,246,0.25)"}` }}>
                Xem danh sách đi chợ <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
        )}

        {/* ── Day tabs ── */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {days.map((day, i) => {
            const dateStr = formatDate(day);
            const dayMeals = mealPlan.filter((m) => m.date === dateStr);
            const totalCal = dayMeals.reduce((s, m) => s + parseCalories(m.recipe.calories), 0);
            const isActive = activeDay === i;
            return (
              <button key={i} onClick={() => setActiveDay(i)}
                className="rounded-2xl p-4 text-left transition-all"
                style={isActive
                  ? { background: "linear-gradient(135deg, #a3e635, #4ade80)", boxShadow: `0 4px 20px ${isBright ? "rgba(163,230,53,0.4)" : "rgba(163,230,53,0.25)"}` }
                  : { background: "var(--card)", border: isBright ? "1px solid rgba(0,0,0,0.1)" : "1px solid rgba(255,255,255,0.06)" }}>
                <p className="text-xs font-bold mb-0.5" style={{ color: isActive ? "rgba(15,17,23,0.7)" : "var(--muted-foreground)" }}>
                  {dayLabel(i)}
                </p>
                <p className="text-base font-black leading-tight" style={{ color: isActive ? "#0f1117" : "var(--foreground)" }}>
                  {day.toLocaleDateString("vi-VN", { weekday: "short" })}, {day.getDate()}/{day.getMonth() + 1}
                </p>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: isActive ? "rgba(15,17,23,0.6)" : "var(--muted-foreground)" }}>
                    <ChefHat className="w-3 h-3" /> {dayMeals.length} bữa
                  </div>
                  {totalCal > 0 && (
                    <div className="flex items-center gap-1.5 text-xs font-black" style={{ color: isActive ? "rgba(15,17,23,0.55)" : isBright ? "#166534" : "#a3e635" }}>
                      <Flame className="w-3 h-3" /> {totalCal} kcal
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* ── Schedule (next days) ── */}
        <div className="mb-5 rounded-2xl p-5" style={{ background: "rgba(26,31,46,0.9)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#64748b" }}>
                Thời khóa biểu (áp dụng cho mọi ngày)
              </p>
              <p className="text-sm font-bold text-white mt-1">
                Chuẩn bị nguyên liệu theo lịch ăn
              </p>
              <p className="text-xs mt-1" style={{ color: "#94a3b8" }}>
                Chỉnh giờ ở đây để Gym Mode và Thực đơn khớp nhau.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {days.map((d, idx) => (
              <div key={idx} className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <p className="text-xs font-semibold" style={{ color: "#a3e635" }}>{dayLabel(idx)}</p>
                <p className="text-sm font-bold text-white">
                  {d.toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "numeric" })}
                </p>

                <div className="mt-3 space-y-2">
                  {([
                    { key: "breakfast" as const, label: "Bữa sáng", emoji: "🌅" },
                    { key: "snack" as const, label: "Bữa phụ", emoji: "🍌" },
                    { key: "lunch" as const, label: "Bữa trưa", emoji: "☀️" },
                    { key: "dinner" as const, label: "Bữa tối", emoji: "🌙" },
                  ]).map((s) => (
                    <div key={s.key} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-base">{s.emoji}</span>
                        <span className="text-xs font-semibold truncate" style={{ color: "#cbd5e1" }}>{s.label}</span>
                      </div>
                      <input
                        type="time"
                        value={scheduleTimes[s.key]}
                        onChange={(e) => updateScheduleTime(s.key, e.target.value)}
                        className="h-9 px-3 rounded-xl text-xs font-semibold outline-none"
                        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", color: "#f1f5f9" }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Nutrition Panel ── */}
        <DayNutritionPanel dateStr={activeDateStr} mealPlan={mealPlan} targets={targets} />

        {/* ── Meal Slots ── */}
        <div className="space-y-4">
          {MEAL_SLOTS.map((slot) => {
            const meals = getMeals(activeDateStr, slot.value);
            const slotCal = meals.reduce((s, m) => s + parseCalories(m.recipe.calories), 0);
            return (
              <div key={slot.value} className="rounded-2xl overflow-hidden"
                style={isBright
                  ? { background: "rgba(15,20,35,0.88)", border: `1px solid ${slot.borderColor}`, boxShadow: "0 4px 20px rgba(0,0,0,0.25)" }
                  : { background: slot.accentColor, border: `1px solid ${slot.borderColor}` }}>

                {/* Slot header */}
                <div className="flex items-center justify-between px-5 py-3.5"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{slot.emoji}</span>
                    <div>
                      <p className="font-bold text-base text-white leading-tight">{slot.label}</p>
                      <p className="text-xs" style={{ color: "#64748b" }}>
                        {(scheduleTimes as any)[slot.value] || slot.time}
                      </p>
                    </div>
                    {slotCal > 0 && (
                      <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                        style={{ background: `${slot.headerColor}18`, color: slot.headerColor, border: `1px solid ${slot.headerColor}30` }}>
                        {slotCal} kcal
                      </span>
                    )}
                  </div>
                  <button onClick={() => openDialog(activeDateStr, slot.value)}
                    className="flex items-center gap-1.5 text-xs font-semibold h-8 px-3 rounded-xl transition-all"
                    style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = `${slot.headerColor}18`;
                      (e.currentTarget as HTMLButtonElement).style.color = slot.headerColor;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.08)";
                      (e.currentTarget as HTMLButtonElement).style.color = "#94a3b8";
                    }}>
                    <Plus className="w-3.5 h-3.5" /> Thêm món
                  </button>
                </div>

                {/* Meals */}
                <div className="p-4">
                  {meals.length === 0 ? (
                    <button onClick={() => openDialog(activeDateStr, slot.value)}
                      className="w-full h-20 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all"
                      style={{ border: "2px dashed rgba(255,255,255,0.1)" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = `${slot.headerColor}50`; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)"; }}>
                      <Plus className="w-5 h-5" style={{ color: "rgba(255,255,255,0.2)" }} />
                      <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>Chưa có món — bấm để thêm</span>
                    </button>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {meals.map((meal) => {
                        const cal = parseCalories(meal.recipe.calories);
                        const mac = estimateMacros(cal);
                        return (
                          <div key={meal.id}
                            className="group relative rounded-xl transition-all"
                            style={{ background: "rgba(15,17,23,0.55)", border: "1px solid rgba(255,255,255,0.08)" }}>
                            <Link to={`/meal/${meal.recipe.id}`} className="flex gap-3 p-3">
                              <ImageWithFallback src={meal.recipe.image} alt={meal.recipe.name}
                                className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm leading-tight text-white mb-1 line-clamp-1">{meal.recipe.name}</p>
                                <div className="flex items-center gap-2 text-xs mb-1.5" style={{ color: "#64748b" }}>
                                  <span className="flex items-center gap-0.5"><Clock className="w-3 h-3 text-lime-400" />{meal.recipe.cookTime}</span>
                                  <span className="flex items-center gap-0.5"><Flame className="w-3 h-3 text-orange-400" />{meal.recipe.calories}</span>
                                </div>
                                {/* Mini macros */}
                                <div className="flex items-center gap-1.5 text-[10px]">
                                  <span style={{ color: "#a3e635" }}>P: {mac.protein}g</span>
                                  <span style={{ color: "#475569" }}>·</span>
                                  <span style={{ color: "#fb923c" }}>C: {mac.carbs}g</span>
                                  <span style={{ color: "#475569" }}>·</span>
                                  <span style={{ color: "#c4b5fd" }}>F: {mac.fat}g</span>
                                </div>
                              </div>
                            </Link>
                            <button
                              onClick={() => { removeFromMealPlan(meal.id); toast.success("Đã xóa khỏi thực đơn"); }}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}

                      {/* Inline add more */}
                      <button onClick={() => openDialog(activeDateStr, slot.value)}
                        className="h-[88px] rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all"
                        style={{ border: "2px dashed rgba(255,255,255,0.08)" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = `${slot.headerColor}50`; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.08)"; }}>
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

      {/* ── Add Recipe Dialog ── */}
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

// ─── Recipe Pick Card ──────────────────────────────────────────────────────────

function RecipePickCard({ recipe, onPick, isFav }: { recipe: any; onPick: (r: any) => void; isFav: boolean }) {
  const cal = parseCalories(recipe.calories);
  const mac = estimateMacros(cal);
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
      }}>
      <ImageWithFallback src={recipe.image} alt={recipe.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          {isFav && <span className="text-xs text-lime-400">⭐</span>}
          <p className="font-semibold text-sm text-white truncate">{recipe.name}</p>
        </div>
        <div className="flex items-center gap-3 text-xs mb-1.5" style={{ color: "#64748b" }}>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-lime-400" />{recipe.cookTime}</span>
          <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-orange-400" />{recipe.calories}</span>
          <span className="px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)", color: "#94a3b8" }}>{recipe.cuisine}</span>
        </div>
        {cal > 0 && (
          <div className="flex items-center gap-2 text-[10px]">
            <span style={{ color: "#a3e635" }}>💪 {mac.protein}g protein</span>
            <span style={{ color: "#475569" }}>·</span>
            <span style={{ color: "#fb923c" }}>🔥 {mac.carbs}g carbs</span>
          </div>
        )}
      </div>
      <Plus className="w-5 h-5 flex-shrink-0 transition-colors group-hover:text-lime-400" style={{ color: "rgba(255,255,255,0.2)" }} />
    </button>
  );
}
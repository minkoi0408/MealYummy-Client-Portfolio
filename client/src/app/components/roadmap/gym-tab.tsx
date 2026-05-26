import { Link } from "react-router";
import { useMealPlan } from "../../contexts/meal-plan-context";
import { Dumbbell, Flame, Zap, Droplet, Leaf, ArrowRight, Target } from "lucide-react";
import { useFavorites } from "../../contexts/favorites-context";
import { mockRecipes } from "../../data/mock-recipes";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type UserMetrics = {
  weight: number;
  height: number;
  age: number;
  gender: "male" | "female";
  activity: "sedentary" | "light" | "moderate" | "active" | "very_active";
  goal: "cut" | "maintain" | "bulk";
};

const DEFAULT_METRICS: UserMetrics = {
  weight: 70,
  height: 170,
  age: 25,
  gender: "male",
  activity: "moderate",
  goal: "maintain",
};

const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

const GOAL_ADJUSTMENTS = { cut: -500, maintain: 0, bulk: +300 };

function calcTargets(m: UserMetrics) {
  const bmr =
    m.gender === "male"
      ? 10 * m.weight + 6.25 * m.height - 5 * m.age + 5
      : 10 * m.weight + 6.25 * m.height - 5 * m.age - 161;
  const tdee = Math.round(bmr * ACTIVITY_MULTIPLIERS[m.activity]);
  const calories = tdee + GOAL_ADJUSTMENTS[m.goal];

  const protein = m.goal === "bulk" ? Math.round(m.weight * 2.2) : Math.round(m.weight * 1.8);
  const fat = Math.round((calories * 0.25) / 9);
  const carbs = Math.round((calories - protein * 4 - fat * 9) / 4);
  const fiber = Math.round((calories / 1000) * 14);

  return {
    bmr,
    tdee,
    calories,
    protein: Math.max(protein, 50),
    carbs: Math.max(carbs, 50),
    fat: Math.max(fat, 20),
    fiber: Math.max(fiber, 20),
  };
}

function loadMetrics(): UserMetrics {
  try {
    const s = localStorage.getItem("mealyummy-metrics");
    return s ? { ...DEFAULT_METRICS, ...JSON.parse(s) } : DEFAULT_METRICS;
  } catch {
    return DEFAULT_METRICS;
  }
}

function parseCalories(cal: string): number {
  const m = cal?.match(/(\d+)/);
  return m ? parseInt(m[1]) : 0;
}

function estimateMacros(calories: number) {
  return {
    protein: Math.round((calories * 0.3) / 4),
    carbs: Math.round((calories * 0.4) / 4),
    fat: Math.round((calories * 0.3) / 9),
    fiber: Math.round(((calories * 0.3) / 4) * 0.25),
  };
}

function clampPct(value: number, max: number) {
  if (max <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((value / max) * 100)));
}

function ProgressBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
}

function loadIsDark(): boolean {
  try {
    const s = localStorage.getItem("mealyummy-theme");
    if (!s) return true;
    return s === "dark";
  } catch {
    return true;
  }
}

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

function pickClosestRecipe(recipes: any[], targetCalories: number, usedIds: Set<string>) {
  let best: any | null = null;
  let bestDiff = Number.POSITIVE_INFINITY;
  for (const r of recipes) {
    if (usedIds.has(r.id)) continue;
    const c = parseCalories(r.calories);
    if (!c) continue;
    const diff = Math.abs(c - targetCalories);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = r;
    }
  }
  return best;
}

export function GymTab() {
  const { mealPlan, addToMealPlan } = useMealPlan();
  const { favorites } = useFavorites();
  const metrics = loadMetrics();
  const targets = calcTargets(metrics);
  const today = new Date().toISOString().split("T")[0];
  const [isDark] = useState(loadIsDark);
  const [dayType, setDayType] = useState<"training" | "rest">("training");
  const [daysAhead, setDaysAhead] = useState<1 | 3 | 7>(3);
  const [scheduleTimes] = useState<ScheduleTimes>(loadScheduleTimes);

  const todayMeals = mealPlan.filter((m) => m.date === today);
  const totalCal = todayMeals.reduce((s, m) => s + parseCalories(m.recipe.calories), 0);
  const totals = todayMeals.reduce(
    (s, m) => {
      const mac = estimateMacros(parseCalories(m.recipe.calories));
      return {
        protein: s.protein + mac.protein,
        carbs: s.carbs + mac.carbs,
        fat: s.fat + mac.fat,
        fiber: s.fiber + mac.fiber,
      };
    },
    { protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );

  const calPct = clampPct(totalCal, targets.calories);

  const macroCards = [
    { key: "protein", label: "Protein", icon: <Dumbbell className="w-4 h-4" />, color: "#a3e635", value: totals.protein, max: targets.protein, unit: "g" },
    { key: "carbs", label: "Carb", icon: <Zap className="w-4 h-4" />, color: "#fb923c", value: totals.carbs, max: targets.carbs, unit: "g" },
    { key: "fat", label: "Fat", icon: <Droplet className="w-4 h-4" />, color: "#c4b5fd", value: totals.fat, max: targets.fat, unit: "g" },
    { key: "fiber", label: "Chất xơ", icon: <Leaf className="w-4 h-4" />, color: "#34d399", value: totals.fiber, max: targets.fiber, unit: "g" },
  ] as const;

  const palette = !isDark
    ? {
        badgeBg: "rgba(251,191,36,0.12)",
        badgeBorder: "1px solid rgba(251,191,36,0.35)",
        badgeText: "#f59e0b",
        cardBg: "rgba(255,255,255,0.82)",
        cardBorder: "1px solid rgba(0,0,0,0.08)",
        text: "#1a1a1a",
        subText: "#6b7280",
        subtle: "rgba(0,0,0,0.05)",
        primaryGrad: "linear-gradient(135deg, #fbbf24, #fb923c)",
        primaryText: "#1a1a1a",
      }
    : {
        badgeBg: "rgba(163,230,53,0.08)",
        badgeBorder: "1px solid rgba(163,230,53,0.2)",
        badgeText: "#a3e635",
        cardBg: "rgba(26,31,46,0.9)",
        cardBorder: "1px solid rgba(255,255,255,0.06)",
        text: "#ffffff",
        subText: "#64748b",
        subtle: "rgba(255,255,255,0.06)",
        primaryGrad: "linear-gradient(135deg, #a3e635, #4ade80)",
        primaryText: "#0f1117",
      };

  const goalLabel = metrics.goal === "cut" ? "Giảm mỡ" : metrics.goal === "bulk" ? "Tăng cơ" : "Duy trì";
  const goalAccent = metrics.goal === "cut" ? "#f87171" : metrics.goal === "bulk" ? "#fb923c" : (!isDark ? "#f59e0b" : "#a3e635");

  const recipePool = useMemo(() => {
    const all = [...favorites, ...mockRecipes.filter((r) => !favorites.find((f) => f.id === r.id))];
    return all;
  }, [favorites]);

  function createSchedulePlan() {
    const target = targets.calories;
    const slots = dayType === "training"
      ? [
          { mealType: "breakfast" as const, label: "Bữa sáng", ratio: 0.28 },
          { mealType: "snack" as const, label: "Pre-workout", ratio: 0.12 },
          { mealType: "lunch" as const, label: "Bữa trưa", ratio: 0.32 },
          { mealType: "dinner" as const, label: "Post-workout", ratio: 0.28 },
        ]
      : [
          { mealType: "breakfast" as const, label: "Bữa sáng", ratio: 0.30 },
          { mealType: "lunch" as const, label: "Bữa trưa", ratio: 0.35 },
          { mealType: "snack" as const, label: "Snack", ratio: 0.10 },
          { mealType: "dinner" as const, label: "Bữa tối", ratio: 0.25 },
        ];

    let createdDays = 0;
    let skippedDays = 0;

    for (let offset = 0; offset < daysAhead; offset++) {
      const d = new Date();
      d.setDate(d.getDate() + offset);
      const dateStr = d.toISOString().split("T")[0];

      const existing = mealPlan.some((m) => m.date === dateStr);
      if (existing) {
        skippedDays++;
        continue;
      }

      const used = new Set<string>();
      const picked = slots
        .map((s) => {
          const desired = Math.round(target * s.ratio);
          const r =
            pickClosestRecipe(recipePool, desired, used) ||
            recipePool.find((x) => !used.has(x.id));
          if (r) used.add(r.id);
          return { slot: s, recipe: r };
        })
        .filter((x) => !!x.recipe) as Array<{ slot: (typeof slots)[number]; recipe: any }>;

      if (picked.length === 0) {
        toast.error("Không tìm thấy công thức phù hợp để tạo thực đơn.");
        return;
      }

      for (const p of picked) {
        addToMealPlan(p.recipe, dateStr, p.slot.mealType);
      }
      createdDays++;
    }

    if (createdDays === 0 && skippedDays > 0) {
      toast.message("Các ngày đã có thực đơn rồi. Hãy xóa bớt trong Thực đơn nếu muốn tạo lại.");
      return;
    }

    toast.success(
      `Đã tạo thực đơn ${createdDays} ngày (${dayType === "training" ? "ngày tập" : "ngày nghỉ"})` +
      (skippedDays ? ` · Bỏ qua ${skippedDays} ngày đã có sẵn` : "")
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <main className="max-w-5xl mx-auto py-6">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3 text-xs font-bold uppercase tracking-widest"
            style={{ background: palette.badgeBg, border: palette.badgeBorder as any, color: palette.badgeText }}
          >
            <Dumbbell className="w-3.5 h-3.5" /> Gym Mode
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mb-1" style={{ color: palette.text }}>
            Ăn theo chế độ — theo dõi hôm nay
          </h1>
          <p className="text-sm" style={{ color: palette.subText }}>
            Mục tiêu: <span style={{ color: goalAccent, fontWeight: 700 }}>{goalLabel}</span> · {metrics.weight}kg
          </p>
            </div>
          </div>
        </div>

        {/* Schedule planner */}
        <div className="rounded-2xl p-5 mb-5" style={{ background: palette.cardBg, border: palette.cardBorder as any }}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: palette.subText }}>
                Thời khóa biểu hôm nay
              </p>
              <p className="text-sm font-bold" style={{ color: palette.text }}>
                {dayType === "training" ? "Ngày tập (pre/post workout)" : "Ngày nghỉ (recovery)"}
              </p>
              <p className="text-xs mt-1" style={{ color: palette.subText }}>
                Bấm tạo để tự điền thực đơn vào trang Thực đơn.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setDayType("training")}
                className="h-9 px-3 rounded-xl text-xs font-semibold transition-all"
                style={dayType === "training"
                  ? { background: palette.primaryGrad, color: palette.primaryText }
                  : { background: palette.subtle, border: `1px solid ${!isDark ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.12)"}`, color: palette.subText }}
              >
                Ngày tập
              </button>
              <button
                onClick={() => setDayType("rest")}
                className="h-9 px-3 rounded-xl text-xs font-semibold transition-all"
                style={dayType === "rest"
                  ? { background: palette.primaryGrad, color: palette.primaryText }
                  : { background: palette.subtle, border: `1px solid ${!isDark ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.12)"}`, color: palette.subText }}
              >
                Ngày nghỉ
              </button>
              <div className="flex items-center gap-1.5 h-9 px-2.5 rounded-xl"
                style={{ background: palette.subtle, border: `1px solid ${!isDark ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.12)"}` }}
              >
                <span className="text-[11px] font-semibold" style={{ color: palette.subText }}>Tạo</span>
                {([1, 3, 7] as const).map((n) => (
                  <button
                    key={n}
                    onClick={() => setDaysAhead(n)}
                    className="h-7 px-2 rounded-lg text-[11px] font-bold transition-all"
                    style={daysAhead === n
                      ? { background: palette.primaryGrad, color: palette.primaryText }
                      : { background: "transparent", color: palette.subText }}
                  >
                    {n} ngày
                  </button>
                ))}
              </div>
              <button
                onClick={createSchedulePlan}
                className="h-9 px-4 rounded-xl text-xs font-black transition-all hover:scale-[1.02]"
                style={{ background: palette.primaryGrad, color: palette.primaryText }}
              >
                Tạo thực đơn theo lịch
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(dayType === "training"
              ? [
                  { label: "Bữa sáng", time: scheduleTimes.breakfast },
                  { label: "Pre-workout", time: scheduleTimes.snack },
                  { label: "Bữa trưa", time: scheduleTimes.lunch },
                  { label: "Post-workout", time: scheduleTimes.dinner },
                ]
              : [
                  { label: "Bữa sáng", time: scheduleTimes.breakfast },
                  { label: "Bữa trưa", time: scheduleTimes.lunch },
                  { label: "Snack", time: scheduleTimes.snack },
                  { label: "Bữa tối", time: scheduleTimes.dinner },
                ]).map((s) => (
              <div
                key={s.label}
                className="rounded-2xl p-3"
                style={{ background: !isDark ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.04)", border: !isDark ? "1px solid rgba(0,0,0,0.06)" : "1px solid rgba(255,255,255,0.06)" }}
              >
                <p className="text-xs font-semibold" style={{ color: palette.subText }}>{s.time}</p>
                <p className="text-sm font-bold" style={{ color: palette.text }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top: calories */}
        <div className="rounded-2xl p-5 mb-5" style={{ background: palette.cardBg, border: palette.cardBorder as any }}>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: palette.subText }}>
                Calories hôm nay
              </p>
              <div className="flex items-end gap-2">
                <p className="text-4xl font-black leading-none" style={{ color: palette.text }}>
                  {totalCal > 0 ? totalCal.toLocaleString() : "—"}
                </p>
                <p className="text-sm font-semibold mb-1" style={{ color: palette.subText }}>
                  / {targets.calories.toLocaleString()} kcal
                </p>
                <span className="ml-auto text-xs font-semibold" style={{ color: calPct >= 100 ? "#f87171" : "#a3e635" }}>
                  {calPct}%
                </span>
              </div>
              <div className="mt-3">
                <ProgressBar
                  pct={calPct}
                  color={calPct >= 100
                    ? "linear-gradient(90deg,#fb923c,#f87171)"
                    : !isDark
                      ? "linear-gradient(90deg,#fbbf24,#fb923c)"
                      : "linear-gradient(90deg,#a3e635,#4ade80)"}
                />
              </div>
              <p className="text-xs mt-2" style={{ color: !isDark ? "#6b7280" : "#475569" }}>
                {totalCal === 0
                  ? "Chưa có bữa nào trong hôm nay."
                  : totalCal >= targets.calories
                    ? "Đã đạt mục tiêu calories hôm nay."
                    : `Còn thiếu ${(targets.calories - totalCal).toLocaleString()} kcal.`}
              </p>
            </div>

            <div className="flex gap-2">
              <Link to="/meal-plan">
                <button
                  className="h-10 px-4 rounded-xl text-xs font-black flex items-center gap-2 transition-all hover:scale-105"
                  style={{ background: palette.primaryGrad, color: palette.primaryText }}
                >
                  <Target className="w-4 h-4" />
                  Lên thực đơn
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
              <Link to="/history">
                <button
                  className="h-10 px-4 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all hover:bg-white/10"
                  style={{
                    background: palette.subtle,
                    border: `1px solid ${!isDark ? "rgba(0,0,0,0.10)" : "rgba(255,255,255,0.12)"}`,
                    color: !isDark ? "#374151" : "#cbd5e1",
                  }}
                >
                  <Flame className="w-4 h-4 text-orange-400" />
                  Lịch sử
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Macros */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {macroCards.map((m) => {
            const pct = clampPct(m.value, m.max);
            return (
              <div
                key={m.key}
                className="rounded-2xl p-4"
                style={{ background: palette.cardBg, border: palette.cardBorder as any }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2" style={{ color: m.color }}>
                    {m.icon}
                    <p className="text-xs font-bold uppercase tracking-widest">{m.label}</p>
                  </div>
                  <span className="text-xs font-semibold" style={{ color: palette.subText }}>
                    {pct}%
                  </span>
                </div>
                <p className="text-2xl font-black" style={{ color: palette.text }}>
                  {m.value}
                  <span className="text-xs font-normal ml-0.5" style={{ color: palette.subText }}>
                    {m.unit}
                  </span>
                </p>
                <p className="text-xs mb-2" style={{ color: !isDark ? "#6b7280" : "#475569" }}>
                  mục tiêu {m.max}
                  {m.unit}
                </p>
                <ProgressBar pct={pct} color={m.color} />
              </div>
            );
          })}
        </div>

        {/* Hint */}
        <div className="mt-5 rounded-2xl p-5" style={{ background: !isDark ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.04)", border: !isDark ? "1px solid rgba(0,0,0,0.06)" : "1px solid rgba(255,255,255,0.06)" }}>
          <p className="text-sm font-semibold mb-1" style={{ color: palette.text }}>Gợi ý nhanh cho dân gym</p>
          <p className="text-xs" style={{ color: palette.subText }}>
            Ưu tiên protein trước, giữ calories trong khoảng mục tiêu. Bạn có thể chỉnh mục tiêu trong trang Hồ sơ dinh dưỡng.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link to="/profile">
              <button
                className="h-9 px-4 rounded-xl text-xs font-semibold"
                style={{
                  background: !isDark ? "rgba(251,191,36,0.14)" : "rgba(163,230,53,0.08)",
                  border: !isDark ? "1px solid rgba(251,191,36,0.35)" : "1px solid rgba(163,230,53,0.2)",
                  color: !isDark ? "#f59e0b" : "#a3e635",
                }}
              >
                Chỉnh mục tiêu
              </button>
            </Link>
            <Link to="/results">
              <button
                className="h-9 px-4 rounded-xl text-xs font-semibold"
                style={{
                  background: palette.subtle,
                  border: `1px solid ${!isDark ? "rgba(0,0,0,0.10)" : "rgba(255,255,255,0.12)"}`,
                  color: !isDark ? "#374151" : "#cbd5e1",
                }}
              >
                Tìm món phù hợp
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}


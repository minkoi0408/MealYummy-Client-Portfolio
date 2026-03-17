import { AppHeader } from "../components/app-header";
import { useMealPlan } from "../contexts/meal-plan-context";
import { Flame, Calendar as CalendarIcon, Clock } from "lucide-react";
import { Link } from "react-router";

function parseDateLabel(dateStr: string) {
  const today = new Date().toISOString().split("T")[0];
  if (dateStr === today) return "Hôm nay";
  const d = new Date(dateStr);
  return d.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "numeric",
    month: "numeric",
  });
}

function parseCalories(cal: string): number {
  const m = cal?.match(/(\d+)/);
  return m ? parseInt(m[1]) : 0;
}

export function MealHistoryPage() {
  const { mealPlan } = useMealPlan();

  const byDate: Record<string, typeof mealPlan> = {};
  mealPlan.forEach((item) => {
    if (!byDate[item.date]) byDate[item.date] = [];
    byDate[item.date].push(item);
  });

  const dates = Object.keys(byDate)
    .sort((a, b) => (a > b ? -1 : 1))
    .slice(0, 7);

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-6">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3 text-xs font-bold uppercase tracking-widest"
            style={{
              background: "rgba(163,230,53,0.08)",
              border: "1px solid rgba(163,230,53,0.2)",
              color: "#a3e635",
            }}
          >
            <CalendarIcon className="w-3.5 h-3.5" /> Lịch sử bữa ăn
          </div>
          <h1 className="text-2xl font-black text-white mb-1">
            Bạn đã ăn gì gần đây?
          </h1>
        </div>

        {dates.length === 0 ? (
          <p className="text-sm" style={{ color: "#64748b" }}>
            Chưa có dữ liệu bữa ăn. Hãy thêm món trong trang Thực đơn.
          </p>
        ) : (
          <div className="space-y-5">
            {dates.map((date) => {
              const meals = byDate[date];
              const totalCal = meals.reduce(
                (sum, m) => sum + parseCalories(m.recipe.calories),
                0
              );
              return (
                <div
                  key={date}
                  className="rounded-2xl p-4"
                  style={{
                    background: "rgba(26,31,46,0.9)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p
                        className="text-xs font-semibold uppercase"
                        style={{ color: "#64748b" }}
                      >
                        {parseDateLabel(date)}
                      </p>
                      <p className="text-sm" style={{ color: "#94a3b8" }}>
                        {meals.length} bữa · {totalCal} kcal
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {meals.map((m) => (
                      <Link
                        key={m.id}
                        to={`/meal/${m.recipe.id}`}
                        className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white truncate">
                            {m.recipe.name}
                          </p>
                          <div
                            className="flex items-center gap-3 text-xs"
                            style={{ color: "#64748b" }}
                          >
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />{" "}
                              {m.recipe.cookTime}
                            </span>
                            <span className="flex items-center gap-1">
                              <Flame className="w-3 h-3 text-orange-400" />{" "}
                              {m.recipe.calories}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}


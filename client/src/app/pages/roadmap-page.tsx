import { useState } from "react";
import { AppHeader } from "../components/app-header";
import { Calendar, HeartPulse, Route } from "lucide-react";
import { MealPlanTab } from "../components/roadmap/meal-plan-tab";
import { NutritionTab } from "../components/roadmap/nutrition-tab";
import { JourneyTab } from "../components/roadmap/journey-tab";
import { useBrightness } from "../contexts/brightness-context";

// We will use the MealPlanTab's built-in Body Metrics Panel or create a dedicated one.
// For now, let's create a placeholder NutritionTab if needed, or use the tabs to switch.

export function RoadmapPage() {
  const [activeTab, setActiveTab] = useState<"meal" | "nutrition" | "journey">("nutrition");
  const { isBright } = useBrightness();

  const TABS = [
    { id: "nutrition" as const, label: "Hồ sơ dinh dưỡng", icon: <HeartPulse className="w-4 h-4" /> },
    { id: "journey" as const, label: "Hành trình của bạn", icon: <Route className="w-4 h-4" /> },
    { id: "meal" as const, label: "Thực đơn", icon: <Calendar className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen">
      <AppHeader />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8 flex justify-center">
          <div className="inline-flex p-1 rounded-2xl" style={{ background: isBright ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)" }}>
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${isActive ? "shadow-md" : "opacity-70 hover:opacity-100"}`}
                  style={{
                    background: isActive ? (isBright ? "#fff" : "rgba(163,230,53,0.15)") : "transparent",
                    color: isActive ? (isBright ? "#166534" : "#a3e635") : "var(--muted-foreground)"
                  }}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          {activeTab === "meal" && <MealPlanTab />}
          {activeTab === "nutrition" && <NutritionTab onGoToJourney={() => setActiveTab("journey")} />}
          {activeTab === "journey" && <JourneyTab onGoToNutrition={() => setActiveTab("nutrition")} onGoToMealPlan={() => setActiveTab("meal")} />}
        </div>
      </main>
    </div>
  );
}

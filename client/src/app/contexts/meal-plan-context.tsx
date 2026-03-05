import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { type Recipe } from "./favorites-context";

export interface MealPlanItem {
  id: string;
  recipe: Recipe;
  date: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
}

interface MealPlanContextType {
  mealPlan: MealPlanItem[];
  addToMealPlan: (recipe: Recipe, date?: string, mealType?: MealPlanItem["mealType"]) => void;
  removeFromMealPlan: (id: string) => void;
  getMealsByDate: (date: string) => MealPlanItem[];
  clearMealPlan: () => void;
}

const MealPlanContext = createContext<MealPlanContextType | undefined>(undefined);

export function MealPlanProvider({ children }: { children: ReactNode }) {
  const [mealPlan, setMealPlan] = useState<MealPlanItem[]>(() => {
    const saved = localStorage.getItem("mealyummy-meal-plan");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("mealyummy-meal-plan", JSON.stringify(mealPlan));
  }, [mealPlan]);

  const addToMealPlan = (recipe: Recipe, date?: string, mealType: MealPlanItem["mealType"] = "lunch") => {
    const today = new Date().toISOString().split("T")[0];
    const newItem: MealPlanItem = {
      id: `${recipe.id}-${Date.now()}`,
      recipe,
      date: date || today,
      mealType,
    };
    setMealPlan((prev) => [...prev, newItem]);
  };

  const removeFromMealPlan = (id: string) => {
    setMealPlan((prev) => prev.filter((item) => item.id !== id));
  };

  const getMealsByDate = (date: string) => {
    return mealPlan.filter((item) => item.date === date);
  };

  const clearMealPlan = () => {
    setMealPlan([]);
  };

  return (
    <MealPlanContext.Provider
      value={{ mealPlan, addToMealPlan, removeFromMealPlan, getMealsByDate, clearMealPlan }}
    >
      {children}
    </MealPlanContext.Provider>
  );
}

export function useMealPlan() {
  const context = useContext(MealPlanContext);
  if (!context) {
    throw new Error("useMealPlan must be used within MealPlanProvider");
  }
  return context;
}

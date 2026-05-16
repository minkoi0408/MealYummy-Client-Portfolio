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
  const [mealPlan, setMealPlan] = useState<MealPlanItem[]>([]);

  useEffect(() => {
    // Fetch meal plan from backend on load
    const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
    if (token) {
      fetch("http://localhost:8082/api/v1/meal-plan", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data && data.data) {
          setMealPlan(data.data);
        }
      })
      .catch(err => console.error("Error fetching meal plan:", err));
    }
  }, []);

  const addToMealPlan = (recipe: Recipe, date?: string, mealType: MealPlanItem["mealType"] = "lunch") => {
    const today = new Date().toISOString().split("T")[0];
    const targetDate = date || today;
    
    const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
    if (!token) return;

    fetch("http://localhost:8082/api/v1/meal-plan", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ recipe, date: targetDate, mealType })
    })
    .then(res => res.json())
    .then(data => {
      if (data && data.data) {
        setMealPlan((prev) => [data.data, ...prev]);
      }
    })
    .catch(err => console.error("Error adding meal plan:", err));
  };

  const removeFromMealPlan = (id: string) => {
    const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
    if (!token) return;

    fetch(`http://localhost:8082/api/v1/meal-plan/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      setMealPlan((prev) => prev.filter((item) => item.id !== id));
    })
    .catch(err => console.error("Error removing meal plan:", err));
  };

  const getMealsByDate = (date: string) => {
    return mealPlan.filter((item) => item.date === date);
  };

  const clearMealPlan = () => {
    const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
    if (!token) return;

    fetch(`http://localhost:8082/api/v1/meal-plan`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      setMealPlan([]);
    })
    .catch(err => console.error("Error clearing meal plan:", err));
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

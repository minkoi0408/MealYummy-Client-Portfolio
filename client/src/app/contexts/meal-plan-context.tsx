import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { type Recipe } from "../data/mock-recipes";
import { useAuth } from "./auth-context";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8082/api/v1";
export interface MealPlanItem {
  id: string;
  recipe: Recipe;
  date: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  isEaten: boolean;
}

interface MealPlanContextType {
  mealPlan: MealPlanItem[];
  addToMealPlan: (recipe: Recipe, date?: string, mealType?: MealPlanItem["mealType"]) => void;
  removeFromMealPlan: (id: string) => void;
  getMealsByDate: (date: string) => MealPlanItem[];
  clearMealPlan: () => void;
  clearMealPlanForDate: (date: string) => Promise<void>;
  syncMealPlanForDate: (date: string) => Promise<void>;
  refreshMealPlan: () => void;
  toggleMealStatus: (id: string) => void;
}

const MealPlanContext = createContext<MealPlanContextType | undefined>(undefined);

export function MealPlanProvider({ children }: { children: ReactNode }) {
  const [mealPlan, setMealPlan] = useState<MealPlanItem[]>([]);
  const { isAuthenticated } = useAuth();

  const fetchMealPlan = () => {
    const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
    if (token) {
      fetch(`${API_URL}/meal-plan`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        if (!res.ok) {
           throw new Error("HTTP " + res.status);
        }
        return res.json();
      })
      .then(data => {
        if (data && data.data) {
          setMealPlan(data.data);
        }
      })
      .catch(err => console.error("Error fetching meal plan:", err));
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchMealPlan();
    } else {
      setMealPlan([]);
    }
  }, [isAuthenticated]);

  const addToMealPlan = (recipe: Recipe, date?: string, mealType: MealPlanItem["mealType"] = "lunch") => {
    const today = new Date().toISOString().split("T")[0];
    const targetDate = date || today;
    
    const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
    if (!token) return;

    fetch(`${API_URL}/meal-plan`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ recipe, date: targetDate, mealType })
    })
    .then(res => {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    })
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

    fetch(`${API_URL}/meal-plan/${id}`, {
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

    fetch(`${API_URL}/meal-plan`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      setMealPlan([]);
    })
    .catch(err => console.error("Error clearing meal plan:", err));
  };

  const clearMealPlanForDate = async (date: string) => {
    const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/meal-plan/date/${date}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      fetchMealPlan(); // Refresh after clearing
    } catch (err) {
      console.error("Error clearing meal plan for date:", err);
      throw err;
    }
  };

  const syncMealPlanForDate = async (date: string) => {
    const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/meal-plan/date/${date}/sync`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      fetchMealPlan(); // Refresh after syncing
    } catch (err) {
      console.error("Error syncing meal plan for date:", err);
      throw err;
    }
  };

  const toggleMealStatus = (id: string) => {
    const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
    if (!token) return;

    // Optimistic update
    setMealPlan(prev => prev.map(item => item.id === id ? { ...item, isEaten: !item.isEaten } : item));

    fetch(`${API_URL}/meal-plan/${id}/toggle`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    })
    .then(data => {
      if (data && data.data) {
        // Sync with server state
        setMealPlan(prev => prev.map(item => item.id === id ? data.data : item));
      }
    })
    .catch(err => {
      console.error("Error toggling meal status:", err);
      // Revert on error
      setMealPlan(prev => prev.map(item => item.id === id ? { ...item, isEaten: !item.isEaten } : item));
    });
  };

  return (
    <MealPlanContext.Provider
      value={{ mealPlan, addToMealPlan, removeFromMealPlan, getMealsByDate, clearMealPlan, clearMealPlanForDate, syncMealPlanForDate, refreshMealPlan: fetchMealPlan, toggleMealStatus }}
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

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export interface Recipe {
  id: string;
  name: string;
  description: string;
  image: string;
  prepTime: string;
  cookTime: string;
  servings: string;
  difficulty: string;
  calories: string;
  cuisine: string;
  ingredients: string[];
  instructions: string[];
  tips?: string;
}

interface FavoritesContextType {
  favorites: Recipe[];
  addFavorite: (recipe: Recipe) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

// Demo recipes to initialize favorites
const initialDemoRecipes: Recipe[] = [

];

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Recipe[]>(() => {
    const saved = localStorage.getItem("mealyummy-favorites");
    if (saved) {
      return JSON.parse(saved);
    }
    // Initialize with demo recipes if no saved data
    return initialDemoRecipes;
  });

  useEffect(() => {
    localStorage.setItem("mealyummy-favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (recipe: Recipe) => {
    setFavorites((prev) => {
      if (prev.find((r) => r.id === recipe.id)) {
        return prev;
      }
      return [...prev, recipe];
    });
  };

  const removeFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((recipe) => recipe.id !== id));
  };

  const isFavorite = (id: string) => {
    return favorites.some((recipe) => recipe.id === id);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }
  return context;
}
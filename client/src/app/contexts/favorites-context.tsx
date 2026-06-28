import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { favoriteApi } from "../../apis/favorite.api";
import { toast } from "sonner";

interface FavoritesContextType {
  favoriteIds: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");

  const { data: favoriteIds = [] } = useQuery({
    queryKey: ["favoriteIds"],
    queryFn: favoriteApi.getFavoriteMealIds,
    staleTime: 5 * 60 * 1000,
    enabled: !!token,
  });

  const toggleMutation = useMutation({
    mutationFn: favoriteApi.toggleFavorite,
    onMutate: async (mealId) => {
      await queryClient.cancelQueries({ queryKey: ["favoriteIds"] });
      const previousIds = queryClient.getQueryData<string[]>(["favoriteIds"]);
      
      if (previousIds) {
        const newIds = previousIds.includes(mealId) 
          ? previousIds.filter(id => id !== mealId)
          : [...previousIds, mealId];
        queryClient.setQueryData(["favoriteIds"], newIds);
      }
      return { previousIds };
    },
    onError: (err, mealId, context) => {
      if (context?.previousIds) {
        queryClient.setQueryData(["favoriteIds"], context.previousIds);
      }
      toast.error("Không thể cập nhật danh sách yêu thích");
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["favoriteMeals"] });
    }
  });

  const isFavorite = (id: string) => favoriteIds.includes(id);

  const handleToggle = (id: string) => {
    toggleMutation.mutate(id);
  };

  return (
    <FavoritesContext.Provider value={{ 
      favoriteIds, 
      toggleFavorite: handleToggle, 
      isFavorite 
    }}>
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
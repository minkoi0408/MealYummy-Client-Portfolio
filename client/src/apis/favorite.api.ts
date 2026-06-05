import { axiosInstance as axiosClient } from "./axios.client";

export interface ToggleFavoriteResponse {
  isFavorite: boolean;
  message: string;
}

export interface FavoriteStatusResponse {
  isFavorite: boolean;
}

export interface PaginatedResponse<T> {
  content: T[];
  pageable: any;
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export const favoriteApi = {
  // Toggle favorite status
  toggleFavorite: async (mealId: string): Promise<ToggleFavoriteResponse> => {
    const response = await axiosClient.post(`/favorites/${mealId}/toggle`);
    return response.data.data;
  },

  // Check status for a single meal
  checkFavoriteStatus: async (mealId: string): Promise<FavoriteStatusResponse> => {
    const response = await axiosClient.get(`/favorites/check/${mealId}`);
    return response.data.data;
  },

  // Get all favorite meal IDs
  getFavoriteMealIds: async (): Promise<string[]> => {
    const response = await axiosClient.get("/favorites/ids");
    return response.data.data;
  },

  // Get paginated favorite meals
  getFavoriteMeals: async (page: number = 0, size: number = 10): Promise<PaginatedResponse<any>> => {
    const response = await axiosClient.get(`/favorites?page=${page}&size=${size}`);
    return response.data.data;
  },
};

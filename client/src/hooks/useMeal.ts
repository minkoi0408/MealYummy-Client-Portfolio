import { create } from 'zustand';
import { mealAPI } from '../apis/meal.api';
import { type Meal } from '../types/meal.type';

interface MealState {
    meals: Meal[];             // kết quả search (AI hoặc tag)
    selectedMeal: Meal | null; // chi tiết món đang xem
    isLoading: boolean;
    isLoaded: boolean;
    error: string | null;

    fetchMeals: () => Promise<void>;
    searchMeals: (name: string) => Promise<Meal[]>;
    searchByTag: (tagIds: string[]) => Promise<Meal[]>;
    getMealById: (id: string) => Promise<void>;
    clearSelectedMeal: () => void;
}

const useMeal = create<MealState>((set, get) => ({
    meals: [],
    selectedMeal: null,
    isLoading: false,
    isLoaded: false,
    error: null,

    fetchMeals: async () => {
        if (get().isLoaded || get().isLoading) return;
        set({ isLoading: true, error: null });
        try {
            const response = await mealAPI.getAll();
            set({
                meals: response.data?.data || [],
                isLoading: false,
                isLoaded: true
            });
        } catch (err: any) {
            set({ error: err.message || 'Lỗi khi lấy dữ liệu meal', isLoading: false });
        }
    },

    /** Tìm món theo từ khoá text (AI search) */
    searchMeals: async (name: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await mealAPI.search(name);
            const data: Meal[] = response.data?.data || [];
            set({ meals: data, isLoading: false });
            return data;
        } catch (err: any) {
            set({ error: err.message || 'Lỗi khi tìm kiếm món ăn', isLoading: false });
            return [];
        }
    },

    /** Lọc món theo danh sách tagId (gọi song song rồi intersect) */
    searchByTag: async (tagIds: string[]) => {
        if (tagIds.length === 0) return [];
        set({ isLoading: true, error: null });
        try {
            const responses = await Promise.all(
                tagIds.map((tagId) => mealAPI.getByTag(tagId))
            );
            const arrays: Meal[][] = responses.map((r: any) => r.data?.data || []);
            let merged = arrays[0] ?? [];
            for (let i = 1; i < arrays.length; i++) {
                const ids = new Set(arrays[i].map((m) => m.id));
                merged = merged.filter((m) => ids.has(m.id));
            }
            set({ meals: merged, isLoading: false });
            return merged;
        } catch (err: any) {
            set({ error: err.message || 'Lỗi khi lọc theo tag', isLoading: false });
            return [];
        }
    },

    getMealById: async (id: string) => {
        set({ isLoading: true, error: null, selectedMeal: null });
        try {
            const response = await mealAPI.getById(id);
            set({ selectedMeal: response.data?.data || null, isLoading: false });
        } catch (err: any) {
            set({ error: err.message || 'Lỗi khi lấy chi tiết món ăn', isLoading: false });
        }
    },

    clearSelectedMeal: () => set({ selectedMeal: null }),
}));

export default useMeal;

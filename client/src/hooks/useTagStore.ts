import { create } from 'zustand';
import { tagAPI } from '../apis/tag.api';
import { type Tag } from '../types/meal.type';

interface TagState {
    tags: Tag[];
    isLoading: boolean;
    isLoaded: boolean; // Đánh dấu để không gọi API lại nhiều lần
    error: string | null;

    // Hành động lấy dữ liệu
    fetchTags: () => Promise<void>;
}

const useTagStore = create<TagState>((set, get) => ({
    tags: [],
    isLoading: false,
    isLoaded: false,
    error: null,

    fetchTags: async () => {
        // Nếu đã có dữ liệu rồi hoặc đang loading thì thoát luôn
        if (get().isLoaded || get().isLoading) return;

        set({ isLoading: true, error: null });
        try {
            const response = await tagAPI.getAll();
            // Nếu call API sử dụng Response<T>, kết quả sẽ nằm trong response.data.data
            set({
                tags: response.data?.data || [],
                isLoading: false,
                isLoaded: true
            });
        } catch (err: any) {
            set({ error: err.message || "Lỗi khi lấy dữ liệu tags", isLoading: false });
        }
    },
}));

export default useTagStore;

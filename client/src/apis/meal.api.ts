import { callAPI } from './axios.client';

export const mealAPI = {
    getAll: () => callAPI('GET', '/meals'),
    search: (name: string) => callAPI('GET', '/meals/search', undefined, { name }),
    getByTag: (tagId: string) => callAPI('GET', `/meals/tag/${tagId}`),
    getById: (id: string) => callAPI('GET', `/meals/${id}`),
};

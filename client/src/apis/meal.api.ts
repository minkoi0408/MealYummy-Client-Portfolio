import { callAPI } from './axios.client';
import type { AxiosResponse } from 'axios';
import type { BaseApiResponse } from '../types/auth.types';
import type { Page } from './category.api';

export interface MealResponseDTO {
  id: string;
  name: string;
  description?: string;
  price: {
    amount: number;
    currency: string;
  };
  categoryIds?: string[];
  tagIds?: string[];
  active?: boolean;
  createdAt?: string;
}

export const mealApi = {
  getAll: (page: number = 0, size: number = 10): Promise<AxiosResponse<BaseApiResponse<Page<MealResponseDTO>>>> => {
    return callAPI('GET', '/meals', null, { page, size });
  },

  create: (data: any): Promise<AxiosResponse<BaseApiResponse<MealResponseDTO>>> => {
    return callAPI('POST', '/meals', data);
  },

  update: (id: string, data: any): Promise<AxiosResponse<BaseApiResponse<MealResponseDTO>>> => {
    return callAPI('PUT', `/meals/${id}`, data);
  },

  toggleState: (id: string): Promise<AxiosResponse<BaseApiResponse<void>>> => {
    return callAPI('PUT', `/meals/${id}/state`);
  },

  delete: (id: string): Promise<AxiosResponse<BaseApiResponse<void>>> => {
    return callAPI('DELETE', `/meals/${id}`);
  },

  uploadImage: (id: string, file: File): Promise<AxiosResponse<BaseApiResponse<MealResponseDTO>>> => {
    const formData = new FormData();
    formData.append('file', file);
    return callAPI('POST', `/meals/${id}/images`, formData, null, {
      'Content-Type': 'multipart/form-data',
    });
  }
};

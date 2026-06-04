import { callAPI } from './axios.client';
import type { AxiosResponse } from 'axios';
import type { BaseApiResponse } from '../types/auth.types';
import type { Page } from './category.api';

export interface PriceDTO {
  minPrice: number;
  maxPrice: number;
}

export interface MealImageDTO {
  url: string;
  isThumbnail: boolean;
}

export interface MealIngredientDTO {
  ingredientId: string;
  name?: string;
  value: number;
  unit: string;
  unitDesc?: string;
}

export interface MealRequestDTO {
  name: string;
  description: string;
  price: PriceDTO;
  categoryIds: string[];
  tagIds: string[];
  ingredients: MealIngredientDTO[];
}

export interface MealResponseDTO {
  id: string;
  name: string;
  description?: string;
  price: PriceDTO;
  images?: MealImageDTO[];
  categories?: { id: string; name: string }[];
  tags?: { id: string; name: string }[];
  ingredients?: MealIngredientDTO[];
  active?: boolean;
  createdAt?: string;
}

export const mealApi = {
  getAll: (page: number = 0, size: number = 10): Promise<AxiosResponse<BaseApiResponse<Page<MealResponseDTO>>>> => {
    return callAPI('GET', '/meals', null, { page, size });
  },

  create: (data: MealRequestDTO): Promise<AxiosResponse<BaseApiResponse<MealResponseDTO>>> => {
    return callAPI('POST', '/meals', data);
  },

  update: (id: string, data: MealRequestDTO): Promise<AxiosResponse<BaseApiResponse<MealResponseDTO>>> => {
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

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

export interface NutritionDTO {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface MealIngredientDTO {
  name: string;
  value: number;
  unit: string;
  unitDesc?: string;
}

export interface MealRequestDTO {
  name: string;
  description: string;
  price: PriceDTO;
  categories: string[];
  tags: string[];
  ingredients: MealIngredientDTO[];
  nutrition: NutritionDTO;
}

export interface MealResponseDTO {
  id: string;
  name: string;
  description: string;
  price: PriceDTO;
  images?: MealImageDTO[];
  categories: string[];
  tags: string[];
  ingredients: MealIngredientDTO[];
  nutrition: NutritionDTO;
  active?: boolean;
  createdAt?: string;
}

export const mealApi = {
  getAll: (page: number = 0, size: number = 10): Promise<AxiosResponse<BaseApiResponse<Page<MealResponseDTO>>>> => {
    return callAPI('GET', '/meals', null, { page, size });
  },

  getById: (id: string): Promise<AxiosResponse<BaseApiResponse<MealResponseDTO>>> => {
    return callAPI('GET', `/meals/${id}`);
  },

  search: (name: string): Promise<AxiosResponse<BaseApiResponse<MealResponseDTO[]>>> => {
    return callAPI('GET', '/meals/search', null, { name });
  },

  getByTag: (tagId: string): Promise<AxiosResponse<BaseApiResponse<MealResponseDTO[]>>> => {
    return callAPI('GET', `/meals/tag/${tagId}`);
  },

  create: (data: MealRequestDTO): Promise<AxiosResponse<BaseApiResponse<MealResponseDTO>>> => {
    return callAPI('POST', '/meals', data);
  },

  createBulk: (data: MealRequestDTO[]): Promise<AxiosResponse<BaseApiResponse<MealResponseDTO[]>>> => {
    return callAPI('POST', '/meals/bulk', data);
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
  },

  getRestaurantKeywords: (mealName: string): Promise<AxiosResponse<BaseApiResponse<string[]>>> => {
    return callAPI('GET', `/ai/knowledge/restaurant-keywords`, null, { mealName });
  }
};

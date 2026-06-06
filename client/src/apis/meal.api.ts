import { callAPI } from './axios.client';
import type { AxiosResponse } from 'axios';
import type { BaseApiResponse } from '../types/auth.types';
import type { Page } from './category.api';
import type { Meal } from '../types/meal.type';


export const mealApi = {
  getAll: (page: number = 0, size: number = 10): Promise<AxiosResponse<BaseApiResponse<Page<Meal>>>> => {
    return callAPI('GET', '/meals', null, { page, size });
  },

  create: (data: any): Promise<AxiosResponse<BaseApiResponse<Meal>>> => {
    return callAPI('POST', '/meals', data);
  },

  update: (id: string, data: any): Promise<AxiosResponse<BaseApiResponse<Meal>>> => {
    return callAPI('PUT', `/meals/${id}`, data);
  },

  toggleState: (id: string): Promise<AxiosResponse<BaseApiResponse<void>>> => {
    return callAPI('PUT', `/meals/${id}/state`);
  },

  delete: (id: string): Promise<AxiosResponse<BaseApiResponse<void>>> => {
    return callAPI('DELETE', `/meals/${id}`);
  },

  search: (name: string): Promise<AxiosResponse<BaseApiResponse<Meal[]>>> => {
    return callAPI('GET', '/meals/search', null, { name });
  },

  getByTag: (tagId: string): Promise<AxiosResponse<BaseApiResponse<Meal[]>>> => {
    return callAPI('GET', `/meals/tag/${tagId}`);
  },

  getById: (id: string): Promise<AxiosResponse<BaseApiResponse<Meal>>> => {
    return callAPI('GET', `/meals/${id}`);
  }
};

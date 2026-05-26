import { callAPI } from './axios.client';
import type { AxiosResponse } from 'axios';
import type { BaseApiResponse } from '../types/auth.types';
import type { Page } from './category.api';

export interface Ingredient {
  id: string;
  name: string;
  description?: string;
  calories?: number;
  unit?: string;
  active?: boolean;
  createdAt?: string;
}

export const ingredientApi = {
  getAll: (page: number = 0, size: number = 10, sort: string = 'name,asc'): Promise<AxiosResponse<BaseApiResponse<Page<Ingredient>>>> => {
    return callAPI('GET', '/ingredients', null, { page, size, sort });
  },

  create: (data: Partial<Ingredient>): Promise<AxiosResponse<BaseApiResponse<Ingredient>>> => {
    return callAPI('POST', '/ingredients', data);
  },

  update: (id: string, data: Partial<Ingredient>): Promise<AxiosResponse<BaseApiResponse<Ingredient>>> => {
    return callAPI('PUT', `/ingredients/${id}`, data);
  },

  toggleState: (id: string): Promise<AxiosResponse<BaseApiResponse<void>>> => {
    return callAPI('PUT', `/ingredients/${id}/state`);
  },

  delete: (id: string): Promise<AxiosResponse<BaseApiResponse<void>>> => {
    return callAPI('DELETE', `/ingredients/${id}`);
  }
};

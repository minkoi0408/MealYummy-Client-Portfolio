import { callAPI } from './axios.client';
import type { AxiosResponse } from 'axios';
import type { BaseApiResponse } from '../types/auth.types';

export interface Page<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
  size: number;
  number: number;
  empty: boolean;
  page?: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  parentName?: string;
  image?: string;
  active?: boolean;
  createdAt?: string;
}

export const categoryApi = {
  getAll: (page: number = 0, size: number = 10, sort: string = 'name,asc'): Promise<AxiosResponse<BaseApiResponse<Page<Category>>>> => {
    return callAPI('GET', '/categories', null, { page, size, sort });
  },
  
  create: (data: Partial<Category>): Promise<AxiosResponse<BaseApiResponse<Category>>> => {
    return callAPI('POST', '/categories', data);
  },

  update: (id: string, data: Partial<Category>): Promise<AxiosResponse<BaseApiResponse<Category>>> => {
    return callAPI('PUT', `/categories/${id}`, data);
  },

  toggleState: (id: string): Promise<AxiosResponse<BaseApiResponse<void>>> => {
    return callAPI('PUT', `/categories/${id}/state`);
  },

  delete: (id: string): Promise<AxiosResponse<BaseApiResponse<void>>> => {
    return callAPI('DELETE', `/categories/${id}`);
  }
};

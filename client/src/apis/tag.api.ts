import { callAPI } from './axios.client';
import type { AxiosResponse } from 'axios';
import type { BaseApiResponse } from '../types/auth.types';
import type { Page } from './category.api';

export interface Tag {
  id: string;
  name: string;
  active?: boolean;
  createdAt?: string;
}

export const tagApi = {
  getAll: (page: number = 0, size: number = 10, sort: string = 'name,asc'): Promise<AxiosResponse<BaseApiResponse<Page<Tag>>>> => {
    return callAPI('GET', '/tags', null, { page, size, sort });
  },

  create: (data: Partial<Tag>): Promise<AxiosResponse<BaseApiResponse<Tag>>> => {
    return callAPI('POST', '/tags', data);
  },

  createBulk: (data: Partial<Tag>[]): Promise<AxiosResponse<BaseApiResponse<Tag[]>>> => {
    return callAPI('POST', '/tags/bulk', data);
  },

  update: (id: string, data: Partial<Tag>): Promise<AxiosResponse<BaseApiResponse<Tag>>> => {
    return callAPI('PUT', `/tags/${id}`, data);
  },

  toggleState: (id: string): Promise<AxiosResponse<BaseApiResponse<void>>> => {
    return callAPI('PUT', `/tags/${id}/state`);
  },

  delete: (id: string): Promise<AxiosResponse<BaseApiResponse<void>>> => {
    return callAPI('DELETE', `/tags/${id}`);
  }
};
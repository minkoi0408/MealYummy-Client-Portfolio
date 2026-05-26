import { callAPI } from './axios.client';
import type { AxiosResponse } from 'axios';
import type { BaseApiResponse } from '../types/auth.types';
import type { Bundle } from '../types/bundle.types';
import type { Page } from './category.api';

export const bundleApi = {
  getAllActiveBundles: (): Promise<AxiosResponse<BaseApiResponse<Bundle[]>>> => {
    return callAPI('GET', '/bundles', null);
  },

  // Dashboard API
  getAll: (page: number = 0, size: number = 10): Promise<AxiosResponse<BaseApiResponse<Page<Bundle>>>> => {
    return callAPI('GET', '/bundles', null, { page, size });
  },

  create: (data: Partial<Bundle>): Promise<AxiosResponse<BaseApiResponse<Bundle>>> => {
    return callAPI('POST', '/bundles', data);
  },

  update: (id: string, data: Partial<Bundle>): Promise<AxiosResponse<BaseApiResponse<Bundle>>> => {
    return callAPI('PUT', `/bundles/${id}`, data);
  },

  toggleState: (id: string): Promise<AxiosResponse<BaseApiResponse<void>>> => {
    return callAPI('PUT', `/bundles/${id}/state`);
  }
};

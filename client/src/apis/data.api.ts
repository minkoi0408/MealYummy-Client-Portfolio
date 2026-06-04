import { callAPI } from './axios.client';
import type { AxiosResponse } from 'axios';
import type { BaseApiResponse } from '../types/auth.types';

export const dataApi = {
  // Export APIs
  exportCategories: (): Promise<AxiosResponse<BaseApiResponse<string>>> => {
    return callAPI('GET', '/data/export/categories');
  },

  exportTags: (): Promise<AxiosResponse<BaseApiResponse<string>>> => {
    return callAPI('GET', '/data/export/tags');
  },

  exportIngredients: (): Promise<AxiosResponse<BaseApiResponse<string>>> => {
    return callAPI('GET', '/data/export/ingredients');
  },

  // Import APIs
  importCategories: (file: File): Promise<AxiosResponse<BaseApiResponse<string>>> => {
    const formData = new FormData();
    formData.append('file', file);
    return callAPI('POST', '/data/import/upload/categories', formData, null, {
      'Content-Type': 'multipart/form-data',
    });
  },

  importTags: (file: File): Promise<AxiosResponse<BaseApiResponse<string>>> => {
    const formData = new FormData();
    formData.append('file', file);
    return callAPI('POST', '/data/import/upload/tags', formData, null, {
      'Content-Type': 'multipart/form-data',
    });
  },

  importIngredients: (file: File): Promise<AxiosResponse<BaseApiResponse<string>>> => {
    const formData = new FormData();
    formData.append('file', file);
    return callAPI('POST', '/data/import/upload/ingredients', formData, null, {
      'Content-Type': 'multipart/form-data',
    });
  },
};

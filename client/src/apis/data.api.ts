import { callAPI } from './axios.client';
import type { AxiosResponse } from 'axios';
import type { BaseApiResponse } from '../types/auth.types';

export const dataApi = {
  // Import APIs
  importMeals: (file: File): Promise<AxiosResponse<BaseApiResponse<string>>> => {
    const formData = new FormData();
    formData.append('file', file);
    return callAPI('POST', '/data/import/upload/meals', formData, null, {
      'Content-Type': 'multipart/form-data',
    });
  },

  importMealsFromJson: (): Promise<AxiosResponse<BaseApiResponse<string>>> => {
    return callAPI('GET', '/data/import/meals-from-json');
  }
};

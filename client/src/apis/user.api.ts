import { callAPI } from './axios.client';
import type { AxiosResponse } from 'axios';
import type { BaseApiResponse } from '../types/auth.types';
import type { Page } from './category.api';

export interface UserResponseDTO {
  id: string;
  username: string;
  email: string;
  role: {
    roleCode?: string;
    roleName: string;
    description: string;
  };
  active: boolean;
  totpEnabled: boolean;
  createdAt: string;
}

export const userApi = {
  getAll: (page: number = 0, size: number = 10): Promise<AxiosResponse<BaseApiResponse<Page<UserResponseDTO>>>> => {
    return callAPI('GET', '/users', null, { page, size });
  },

  getById: (id: string): Promise<AxiosResponse<BaseApiResponse<UserResponseDTO>>> => {
    return callAPI('GET', `/users/${id}`);
  },

  updateRole: (id: string, roleId: string): Promise<AxiosResponse<BaseApiResponse<UserResponseDTO>>> => {
    return callAPI('PUT', `/users/${id}/role`, { roleId });
  }
};

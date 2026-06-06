import { callAPI } from './axios.client';
import type { AxiosResponse } from 'axios';

export interface BaseApiResponse<T> {
  timestamp: string;
  message: string;
  data: T;
  errors?: Record<string, string>;
}

export interface RolePermissionDTO {
  roleCode: string;
  permissionCodes: string[];
}

export interface RoleResponse {
  roleCode: string;
  roleName: string;
  description: string;
  permissions: string[];
}

export interface PermissionResponse {
  permissionCode: string;
  permissionName: string;
  type: string;
  description: string;
}

export interface Role {
  id?: number;
  roleCode: string;
  roleName: string;
  description: string;
  permissions?: string[];
}



const getHeaders = (): Record<string, string> | undefined => {
  const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : undefined;
};

export const roleApi = {
  getRoles: (): Promise<AxiosResponse<BaseApiResponse<RoleResponse[]>>> => {
    return callAPI('GET', '/roles', null, null, getHeaders());
  },

  getPermissions: (): Promise<AxiosResponse<BaseApiResponse<PermissionResponse[]>>> => {
    return callAPI('GET', '/permissions', null, null, getHeaders());
  },

  addPermissions: (data: RolePermissionDTO): Promise<AxiosResponse<BaseApiResponse<Role>>> => {
    return callAPI('PUT', '/roles/permissions/add', data, null, getHeaders());
  },

  removePermissions: (data: RolePermissionDTO): Promise<AxiosResponse<BaseApiResponse<Role>>> => {
    return callAPI('PUT', '/roles/permissions/delete', data, null, getHeaders());
  }
};

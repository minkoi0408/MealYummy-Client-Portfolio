import { callAPI } from './axios.client';
import type { AxiosResponse } from 'axios';
import type { BaseApiResponse } from '../types/auth.types';
import type { Page } from './category.api';

export interface UserSubscription {
  id: string;
  userId: string;
  bundleId: string;
  username?: string;
  bundleName?: string;
  startDate: string;
  endDate: string;
  status: string;
}

export const subscriptionApi = {
  getSubscriptionPlan: (): Promise<AxiosResponse<BaseApiResponse<any>>> => {
    return callAPI('GET', '/subscriptions/plan');
  },

  getCurrentSubscription: (): Promise<AxiosResponse<BaseApiResponse<UserSubscription>>> => {
    return callAPI('GET', '/subscriptions/me');
  },

  getAll: (page: number = 0, size: number = 10): Promise<AxiosResponse<BaseApiResponse<Page<UserSubscription>>>> => {
    return callAPI('GET', '/user-subscriptions', null, { page, size });
  },

  getById: (id: string): Promise<AxiosResponse<BaseApiResponse<UserSubscription>>> => {
    return callAPI('GET', `/user-subscriptions/${id}`);
  }
};

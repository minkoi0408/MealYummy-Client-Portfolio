import { callAPI } from './axios.client';
import type { AxiosResponse } from 'axios';
import type { BaseApiResponse } from '../types/auth.types';

export interface UserSubscription {
  id: string;
  userId: string;
  role: string;
  status: string;
  startDate: string;
  endDate: string;
}

export const subscriptionApi = {
  getCurrentSubscription: (): Promise<AxiosResponse<BaseApiResponse<UserSubscription>>> => 
    callAPI('GET', '/subscriptions/me'),
};

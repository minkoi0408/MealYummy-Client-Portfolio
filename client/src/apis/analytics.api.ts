import { callAPI } from './axios.client';
import type { AxiosResponse } from 'axios';
import type { BaseApiResponse } from '../types/auth.types';

export interface RevenueDataPointDTO {
  label: string;
  revenue: number;
}

export interface RecentTransactionDTO {
  transactionId: string;
  username: string;
  email: string;
  avatarUrl: string;
  bundleName: string;
  amount: number;
  date: string;
}

export interface DashboardOverviewDTO {
  totalUsers: number;
  totalRevenue: number;
  activeSubscriptions: number;
  totalMeals: number;
  
  userChangeStr: string;
  revenueChangeStr: string;
  subscriptionChangeStr: string;
  mealChangeStr: string;

  revenueChart: RevenueDataPointDTO[];
  recentTransactions: RecentTransactionDTO[];
}

export const analyticsApi = {
  getOverview: (): Promise<AxiosResponse<BaseApiResponse<DashboardOverviewDTO>>> => {
    return callAPI('GET', '/analytics/overview');
  }
};

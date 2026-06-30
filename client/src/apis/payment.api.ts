import { callAPI } from './axios.client';
import type { AxiosResponse } from 'axios';
import type { BaseApiResponse } from '../types/auth.types';
import type { Page } from './category.api';

export interface PaymentHistory {
  id: string;
  txId: string;
  userId: string;
  bundleId: string;
  durationCode: string;
  username?: string;
  bundleName?: string;
  amount: number;
  paymentStatus: string;
  transactionId?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export const paymentApi = {
  createPayment: (data: any): Promise<AxiosResponse<BaseApiResponse<any>>> => {
    return callAPI('POST', '/payments/create', data);
  },

  getAll: (page: number = 0, size: number = 10): Promise<AxiosResponse<BaseApiResponse<Page<PaymentHistory>>>> => {
    return callAPI('GET', '/payment-histories', null, { page, size });
  },

  getById: (id: string): Promise<AxiosResponse<BaseApiResponse<PaymentHistory>>> => {
    return callAPI('GET', `/payment-histories/${id}`);
  }
};

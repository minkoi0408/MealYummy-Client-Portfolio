import { callAPI } from './axios.client';
import type { AxiosResponse } from 'axios';
import type { BaseApiResponse } from '../types/auth.types'; // Reusing BaseApiResponse
import type { PaymentCreateRequest, PaymentCreateResponse } from '../types/payment.types';

export const paymentApi = {
  createPayment: (data: PaymentCreateRequest): Promise<AxiosResponse<BaseApiResponse<PaymentCreateResponse>>> =>
    callAPI('POST', '/payments/create', data, null, {}),
};

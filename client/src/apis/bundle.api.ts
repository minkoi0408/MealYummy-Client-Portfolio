import { callAPI } from './axios.client';
import type { AxiosResponse } from 'axios';
import type { BaseApiResponse } from '../types/auth.types'; // Reusing BaseApiResponse
import type { Bundle } from '../types/bundle.types';

export const bundleApi = {
  getAllActiveBundles: (): Promise<AxiosResponse<BaseApiResponse<Bundle[]>>> =>
    callAPI('GET', '/bundles', null),
};

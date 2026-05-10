import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type AxiosRequestConfig,
  type Method,
} from 'axios';

import queryString from 'query-string';
const baseUrl: string = import.meta.env.VITE_API_URL;

export {
  axiosInstance,
  callAPI,
//   callAPIWithFormData,
//   uploadFileAPI,
//   callAPIForExcel,
};


/**
 * @author Nonoru
 * @since 03-06-2026
 * Hàm này để
 */
const axiosInstance: AxiosInstance = axios.create({
  baseURL: baseUrl,
  paramsSerializer: {
    serialize: params => queryString.stringify(params),
  },
  withCredentials: true,
});

/**
 * @author Nonoru
 * @since 03-06-2026
 * Hàm này để call api truyền tham số phương thức http method, endpoint url, data , param
 */
const callAPI = async (
  method: Method | string,
  endPoint: string,
  data?: unknown,
  params?: Record<string, string | number | boolean> | null
): Promise<AxiosResponse> => {
  const options: AxiosRequestConfig = {
    method: method,
    url: endPoint,
    ...(data !== undefined ? { data } : {}),
    ...(params ? { params } : {}),
    headers: {
      'Content-Type': 'application/json',
    },
    responseType: 'json',
  };
  return axiosInstance(options);
};

/**
 * @author Nonoru
 * @since 03-06-2026
 * Hàm này để
 */
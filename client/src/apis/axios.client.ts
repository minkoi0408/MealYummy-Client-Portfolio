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

// Interceptor Request: Tự động đính kèm Token vào Header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue: { resolve: (v: any) => void; reject: (e: any) => void }[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(p => error ? p.reject(error) : p.resolve(token));
  failedQueue = [];
};

// Interceptor Response: Tự động refresh token khi gặp 401/403
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Các endpoint xác thực (đăng nhập, OTP) không được trigger logic refresh token
    const isAuthEndpoint = originalRequest.url?.includes('/auth/login') ||
                           originalRequest.url?.includes('/notification/otp-') ||
                           originalRequest.url?.includes('/auth/register');

    if (error.response && (error.response.status === 401 || error.response.status === 403) && !originalRequest._retry) {
      if (isAuthEndpoint) {
        // Trả thẳng lỗi về component để hiển thị thông báo (toast), không redirect
        return Promise.reject(error);
      }

      // Nếu refresh token fail -> logout và redirect
      if (originalRequest.url?.includes('/auth/refresh')) {
        localStorage.clear(); sessionStorage.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return axiosInstance(originalRequest);
        }).catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
      if (!refreshToken) {
        isRefreshing = false;
        localStorage.removeItem("accessToken"); localStorage.removeItem("refreshToken"); localStorage.removeItem("user");
        sessionStorage.removeItem("accessToken"); sessionStorage.removeItem("refreshToken"); sessionStorage.removeItem("user");
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(`${baseUrl}/auth/refresh`, { refreshToken });
        const newAccessToken = res.data?.data?.accessToken;
        const newRefreshToken = res.data?.data?.refreshToken;

        if (!newAccessToken) throw new Error('No access token in refresh response');

        // Lưu token mới vào đúng storage
        const isLocal = !!localStorage.getItem('refreshToken');
        const storage = isLocal ? localStorage : sessionStorage;
        storage.setItem('accessToken', newAccessToken);
        if (newRefreshToken) storage.setItem('refreshToken', newRefreshToken);

        axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken;
        processQueue(null, newAccessToken);

        originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem("accessToken"); localStorage.removeItem("refreshToken"); localStorage.removeItem("user");
        sessionStorage.removeItem("accessToken"); sessionStorage.removeItem("refreshToken"); sessionStorage.removeItem("user");
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

/**
 * @author Nonoru
 * @since 03-06-2026
 * Hàm này để call api truyền tham số phương thức http method, endpoint url, data , param
 */
const callAPI = async (
  method: Method | string,
  endPoint: string,
  data?: unknown,
  params?: Record<string, string | number | boolean> | null,
  headers?: Record<string, string>
): Promise<AxiosResponse> => {
  const options: AxiosRequestConfig = {
    method: method,
    url: endPoint,
    ...(data !== undefined ? { data } : {}),
    ...(params ? { params } : {}),
    headers: {
      'Content-Type': 'application/json',
      ...headers,
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
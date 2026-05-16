import { callAPI } from './axios.client';
import type { AxiosResponse } from 'axios';
import type { 
  BaseApiResponse,
  AuthResponseDTO,
  RegisterRequestDTO,
  VerifyLoginDTO,
  ResetPasswordDTO,
  RefreshTokenRequestDTO,
  GoogleTokenRequestDTO,
  SendOtpToEmailRequestDTO,
  LoginRequestDTO
} from '../types/auth.types';

export const authApi = {
  register: (data: RegisterRequestDTO): Promise<AxiosResponse<BaseApiResponse<string>>> => 
    callAPI('POST', '/auth/register', data),

  login: (data: VerifyLoginDTO): Promise<AxiosResponse<BaseApiResponse<AuthResponseDTO>>> => 
    callAPI('POST', '/auth/login', data),

  resetPassword: (data: ResetPasswordDTO): Promise<AxiosResponse<BaseApiResponse<string>>> => 
    callAPI('POST', '/auth/reset-password', data),

  logout: (token: string): Promise<AxiosResponse<BaseApiResponse<string>>> => 
    callAPI('GET', '/auth/logout', null, null, { Authorization: `Bearer ${token}` }),

  refresh: (data: RefreshTokenRequestDTO): Promise<AxiosResponse<BaseApiResponse<AuthResponseDTO>>> => 
    callAPI('POST', '/auth/refresh', data),

  loginWithGoogle: (data: GoogleTokenRequestDTO): Promise<AxiosResponse<BaseApiResponse<AuthResponseDTO>>> => 
    callAPI('POST', '/auth/google', data),

  setupTotp: (username: string): Promise<AxiosResponse<BaseApiResponse<string>>> =>
    callAPI('POST', '/auth/setup-totp', null, { username }),

  verifyTotpSetup: (username: string, code: string): Promise<AxiosResponse<BaseApiResponse<string>>> =>
    callAPI('POST', '/auth/verify-totp-setup', null, { username, code }),

  sendOtpRegistration: (data: SendOtpToEmailRequestDTO): Promise<AxiosResponse<BaseApiResponse<string>>> =>
    callAPI('POST', '/notification/otp-registration', data),

  sendOtpForgotPassword: (data: SendOtpToEmailRequestDTO): Promise<AxiosResponse<BaseApiResponse<string>>> =>
    callAPI('POST', '/notification/otp-forgot-password', data),

  sendOtpLogin: (data: LoginRequestDTO): Promise<AxiosResponse<BaseApiResponse<string>>> =>
    callAPI('POST', '/notification/otp-login', data),
};

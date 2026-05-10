import { callAPI } from './axios.client';
import type { 
  LoginRequestDTO,
  RegisterRequestDTO, 
  OtpVerifyDTO, 
  GoogleTokenRequestDTO,
} from '../types/auth.types';

export const authApi = {
  login: (data: LoginRequestDTO) => 
    callAPI('POST', '/auth/login', data),

  verifyMfaLogin: (data: any) =>
    callAPI('POST', '/auth/verify-mfa-login', data),
  
  register: (data: RegisterRequestDTO) => 
    callAPI('POST', '/auth/register', data),
  
  verifyOtp: (data: OtpVerifyDTO) => 
    callAPI('POST', '/auth/verify-otp', data),
  
  resendOtp: (email: string) => 
    callAPI('POST', `/auth/resend-otp?email=${email}`),
  
  logout: (accessToken: string) => 
    callAPI('POST', '/auth/logout', null, { accessToken }),

  sendLoginOtp: (email: string) =>
    callAPI('POST', `/auth/send-login-otp?email=${email}`),

  loginWithGoogle: (data: GoogleTokenRequestDTO) =>
    callAPI('POST', '/auth/google', data),

  sendOtpRegister: (email: string) =>
    callAPI('POST', `/auth/send-otp-register?email=${email}`),

  forgotPassword: (email: string) =>
    callAPI('POST', `/auth/forgot-password?email=${email}`),

  resetPassword: (data: any) =>
    callAPI('POST', '/auth/reset-password', data),

  setupTotp: (username: string) =>
    callAPI('POST', `/auth/setup-totp?username=${username}`),

  verifyTotpSetup: (username: string, code: string) =>
    callAPI('POST', `/auth/verify-totp-setup?username=${username}&code=${code}`),
};

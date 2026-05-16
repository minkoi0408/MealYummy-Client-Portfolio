export interface BaseApiResponse<T> {
  timestamp: string;
  message: string;
  data: T;
  errors?: Record<string, string>;
}

export interface AuthResponseDTO {
  username: string;
  email: string;
  avatarUrl: string;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterRequestDTO {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  otp?: string;
}

export interface VerifyLoginDTO {
  username: string;
  otp: string;
}

export interface ResetPasswordDTO {
  email: string;
  otp: string;
  newPassword: string;
}

export interface RefreshTokenRequestDTO {
  refreshToken: string;
}

export interface GoogleTokenRequestDTO {
  token: string;
}

export interface SendOtpToEmailRequestDTO {
  email: string;
  otpType?: string;
}

export interface LoginRequestDTO {
  username: string;
  password: string;
}

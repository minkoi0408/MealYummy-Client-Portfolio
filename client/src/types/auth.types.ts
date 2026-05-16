export interface LoginRequestDTO {
  username: string;
  password: string;
}

export interface RegisterRequestDTO {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  phone: string;
}

export interface OtpVerifyDTO {
  email: string;
  otp: string;
}

export interface AuthResponseDTO {
  username: string;
  email: string;
  accessToken: string;
  refreshToken: string;
}

export interface GoogleTokenRequestDTO {
  token: string;
}

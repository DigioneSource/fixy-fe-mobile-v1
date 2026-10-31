import {
  AUTH_ENDPOINTS,
  RegisterBody,
  buildChangePasswordBody,
  buildGoogleLoginBody,
  buildLoginBody,
  buildOtpSendBody,
  buildOtpVerifyBody,
  buildRefreshTokenBody,
  buildRegisterBody,
  buildResetPasswordBody,
} from '@/features/auth/request-builders';
import { FORGOT_PASSWORD_OTP_PURPOSE } from '@/features/auth/constants';

import { apiClient } from '@/services/api/client';

export async function register(input: RegisterBody) {
  const response = await apiClient.post(AUTH_ENDPOINTS.register, buildRegisterBody(input));
  return response.data;
}

export async function sendOtp(target: string, purpose: number) {
  const response = await apiClient.post(AUTH_ENDPOINTS.otpSend, buildOtpSendBody(target, purpose));
  return response.data;
}

export async function verifyOtp(target: string, otpCode: string) {
  const response = await apiClient.post(
    AUTH_ENDPOINTS.otpVerify,
    buildOtpVerifyBody(target, otpCode)
  );
  return response.data;
}

/** Lấy verifyToken (dùng một lần, 10 phút) từ phản hồi /auth/otp/verify. */
export function extractVerifyToken(response: any): string {
  return response?.data?.verifyToken ?? response?.verifyToken ?? '';
}

export async function login(target: string, password: string) {
  const response = await apiClient.post(AUTH_ENDPOINTS.login, buildLoginBody(target, password));
  return response.data;
}

export async function refreshToken(tokenValue: string) {
  const response = await apiClient.post(
    AUTH_ENDPOINTS.refreshToken,
    buildRefreshTokenBody(tokenValue)
  );
  return response.data;
}

export async function changePassword(target: string, oldPassword: string, newPassword: string) {
  const response = await apiClient.post(
    AUTH_ENDPOINTS.changePassword,
    buildChangePasswordBody(target, oldPassword, newPassword)
  );
  return response.data;
}

export async function resetPassword(target: string, newPassword: string, verifyToken: string) {
  const response = await apiClient.post(
    AUTH_ENDPOINTS.resetPassword,
    buildResetPasswordBody(target, newPassword, verifyToken)
  );
  return response.data;
}

// Backend không có /auth/forgot-password: quên mật khẩu = gửi OTP với mục đích FORGOT_PASSWORD.
export async function forgotPassword(target: string) {
  return sendOtp(target, FORGOT_PASSWORD_OTP_PURPOSE);
}

export async function loginGoogle(credential: string, roleRegister?: number) {
  const response = await apiClient.post(
    AUTH_ENDPOINTS.loginGoogle,
    buildGoogleLoginBody(credential, roleRegister)
  );
  return response.data;
}

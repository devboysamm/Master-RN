import { request } from './client';

export type AuthUser = { id: number; email: string; name: string | null; bio: string | null };
export type TokenResponse = { token: string; user: AuthUser };
export type MessageResponse = { message: string };

export const signup = (email: string, name: string, password: string) =>
  request<MessageResponse>('/api/auth/signup', {
    method: 'POST',
    body: { email, name, password },
  });

export const verifyOtp = (email: string, code: string) =>
  request<TokenResponse>('/api/auth/verify-otp', {
    method: 'POST',
    body: { email, code },
  });

export const login = (email: string, password: string) =>
  request<TokenResponse>('/api/auth/login', {
    method: 'POST',
    body: { email, password },
  });

export const forgotPassword = (email: string) =>
  request<MessageResponse>('/api/auth/forgot-password', {
    method: 'POST',
    body: { email },
  });

export const resetPassword = (email: string, code: string, newPassword: string) =>
  request<MessageResponse>('/api/auth/reset-password', {
    method: 'POST',
    body: { email, code, newPassword },
  });

export const me = (token: string) =>
  request<{ user: AuthUser }>('/api/auth/me', { method: 'GET', token });

export const updateMe = (
  token: string,
  fields: { name?: string; bio?: string },
) =>
  request<{ user: AuthUser }>('/api/auth/me', {
    method: 'PATCH',
    token,
    body: fields,
  });

// Permanently delete the signed-in user's own account and all personal data.
export const deleteAccount = (token: string) =>
  request<MessageResponse>('/api/account', { method: 'DELETE', token });

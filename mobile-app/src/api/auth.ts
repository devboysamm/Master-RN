import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
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

/* -------------------------------------------------------------------------- */
/* GitHub OAuth                                                               */
/* -------------------------------------------------------------------------- */

// The backend builds the authorize URL (so the client id never ships in the
// app) and returns a `state` we echo-check after the redirect.
export const githubStart = () =>
  request<{ url: string; state: string }>('/api/auth/github/start', { method: 'GET' });

// Deep link the backend redirects to once it has signed our JWT.
const GITHUB_RETURN_URL = 'masterrn://github-auth';

export type GithubAuthResult =
  | { type: 'success'; token: string }
  | { type: 'cancel' }
  | { type: 'error'; message: string };

// Reads a query param that expo-linking may surface as string | string[].
function firstParam(v: string | string[] | undefined): string {
  if (Array.isArray(v)) return v[0] ?? '';
  return typeof v === 'string' ? v : '';
}

/**
 * Runs the full GitHub OAuth browser flow:
 *   /start → open the GitHub authorize page → backend redirects back to
 *   masterrn://github-auth?token|error&state → parse + verify state.
 * Never throws for the normal cancel/deny paths — returns a tagged result.
 */
export async function runGithubAuth(): Promise<GithubAuthResult> {
  const { url, state } = await githubStart();

  const result = await WebBrowser.openAuthSessionAsync(url, GITHUB_RETURN_URL);
  // User dismissed/closed the in-app browser before finishing.
  if (result.type !== 'success' || !result.url) {
    return { type: 'cancel' };
  }

  const { queryParams } = Linking.parse(result.url);
  const q = queryParams ?? {};
  const error = firstParam(q.error);
  if (error) return { type: 'error', message: error };

  const token = firstParam(q.token);
  const returnedState = firstParam(q.state);
  if (!token) return { type: 'error', message: 'GitHub sign-in failed. Please try again.' };
  // CSRF guard: the state we got back must match the one /start issued.
  if (returnedState !== state) {
    return { type: 'error', message: 'Security check failed. Please try again.' };
  }
  return { type: 'success', token };
}

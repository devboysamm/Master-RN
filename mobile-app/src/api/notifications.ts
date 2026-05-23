import { request } from './client';

export type AppNotification = {
  id: number;
  title: string;
  body: string | null;
  created_at: string;
};

// Register this device's Expo push token for the signed-in user.
// `authToken` is the user's JWT; `expoToken` is the Expo push token.
export const registerPushToken = (authToken: string, expoToken: string, platform: string) =>
  request<{ success: boolean }>('/api/notifications/register-token', {
    method: 'POST',
    token: authToken,
    body: { token: expoToken, platform },
  });

// Recent notifications for the bell list (newest first). Authenticated.
export const getNotifications = (authToken: string) =>
  request<AppNotification[]>('/api/notifications', { method: 'GET', token: authToken });

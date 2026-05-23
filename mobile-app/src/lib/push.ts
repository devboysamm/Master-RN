import Constants from 'expo-constants';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { registerPushToken } from '../api/notifications';

// Show a banner/sound even when a notification arrives while the app is open.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// EAS projectId is required by getExpoPushTokenAsync. Read it from the Expo
// config (app.json → expo.extra.eas.projectId). Returns undefined if absent.
export function getProjectId(): string | undefined {
  const fromConfig = (Constants.expoConfig?.extra as { eas?: { projectId?: string } } | undefined)
    ?.eas?.projectId;
  // Fallback for some build types that surface it under easConfig.
  const fromEas = (Constants as unknown as { easConfig?: { projectId?: string } }).easConfig
    ?.projectId;
  return fromConfig ?? fromEas;
}

/**
 * Best-effort push registration for a signed-in user:
 *   ask permission → get the Expo push token → POST it to the backend.
 * Every failure path (denied, simulator, missing projectId, network) is
 * caught and logged — it NEVER throws or blocks the UI.
 */
export async function registerForPush(authToken: string): Promise<void> {
  try {
    const existing = await Notifications.getPermissionsAsync();
    let status = existing.status;
    if (status !== 'granted') {
      const requested = await Notifications.requestPermissionsAsync();
      status = requested.status;
    }
    if (status !== 'granted') {
      console.log('[push] permission not granted — skipping registration');
      return;
    }

    const projectId = getProjectId();
    if (!projectId) {
      console.warn('[push] no EAS projectId in app config — run `eas init`. Skipping.');
      return;
    }

    const { data: expoToken } = await Notifications.getExpoPushTokenAsync({ projectId });
    if (!expoToken) return;

    await registerPushToken(authToken, expoToken, Platform.OS);
    console.log('[push] Expo push token registered');
  } catch (err) {
    // Simulators (no push), offline, etc. — push is optional, never fatal.
    console.log('[push] registration skipped:', err);
  }
}

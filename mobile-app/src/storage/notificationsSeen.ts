import AsyncStorage from '@react-native-async-storage/async-storage';

// Highest notification id the user has seen (notifications open the bell
// screen, which records the newest id here). Unread = ids greater than this.
const KEY = 'mrn.notificationsLastSeenId';

export async function getLastSeenId(): Promise<number> {
  const raw = await AsyncStorage.getItem(KEY);
  const n = raw ? Number(raw) : 0;
  return Number.isFinite(n) ? n : 0;
}

// Monotonic: only advances the stored value so an older list never "unsees"
// newer notifications.
export async function setLastSeenId(id: number): Promise<void> {
  if (!Number.isFinite(id) || id <= 0) return;
  const current = await getLastSeenId();
  if (id > current) await AsyncStorage.setItem(KEY, String(id));
}

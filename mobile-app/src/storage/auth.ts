import AsyncStorage from '@react-native-async-storage/async-storage';

// Single key holds the whole authenticated session { token, user }.
const AUTH_KEY = 'mrn_auth';
const GUEST_KEY = 'mrn.guest';

export type StoredUser = {
  id: number;
  name: string | null;
  email: string;
  bio: string | null;
};

export type AuthSession = {
  token: string;
  user: StoredUser;
};

export async function getSession(): Promise<AuthSession | null> {
  const raw = await AsyncStorage.getItem(AUTH_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export async function setSession(session: AuthSession): Promise<void> {
  await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(session));
}

export async function clearSession(): Promise<void> {
  await AsyncStorage.removeItem(AUTH_KEY);
}

export async function getGuest(): Promise<boolean> {
  const raw = await AsyncStorage.getItem(GUEST_KEY);
  return raw === '1';
}

export async function setGuest(isGuest: boolean): Promise<void> {
  if (isGuest) await AsyncStorage.setItem(GUEST_KEY, '1');
  else await AsyncStorage.removeItem(GUEST_KEY);
}

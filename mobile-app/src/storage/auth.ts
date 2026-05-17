import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = 'mrn.user';
const GUEST_KEY = 'mrn.guest';

export type StoredUser = {
  id: string;
  name: string;
  email: string;
};

export async function getUser(): Promise<StoredUser | null> {
  const raw = await AsyncStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function setUser(user: StoredUser): Promise<void> {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}

export async function clearUser(): Promise<void> {
  await AsyncStorage.removeItem(USER_KEY);
}

export async function getGuest(): Promise<boolean> {
  const raw = await AsyncStorage.getItem(GUEST_KEY);
  return raw === '1';
}

export async function setGuest(isGuest: boolean): Promise<void> {
  if (isGuest) await AsyncStorage.setItem(GUEST_KEY, '1');
  else await AsyncStorage.removeItem(GUEST_KEY);
}

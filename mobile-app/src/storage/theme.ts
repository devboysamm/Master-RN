import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

export type ThemePref = 'light' | 'dark' | 'system';

const KEY = 'mrn.theme';

export async function getTheme(): Promise<ThemePref> {
  const raw = await AsyncStorage.getItem(KEY);
  if (raw === 'dark' || raw === 'light' || raw === 'system') return raw;
  return 'system';
}

export async function setTheme(v: ThemePref): Promise<void> {
  await AsyncStorage.setItem(KEY, v);
}

export function useThemePref(): [ThemePref, (v: ThemePref) => Promise<void>] {
  const [pref, setPref] = useState<ThemePref>('system');
  useEffect(() => { getTheme().then(setPref); }, []);
  const update = useCallback(async (v: ThemePref) => {
    await setTheme(v);
    setPref(v);
  }, []);
  return [pref, update];
}

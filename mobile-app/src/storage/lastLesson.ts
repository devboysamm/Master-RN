import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const KEY = 'mrn.lastLesson';

export type LastLesson = {
  lessonId: number;
  moduleId: number;
  lessonTitle: string;
  moduleTitle?: string | null;
  // 1-based lesson position within the module (e.g. "L03").
  lessonNumber?: number;
  // Total lessons in the module (denominator of "3/8").
  totalLessons?: number;
  // Module number for display as "M02".
  moduleNumber?: number;
  updatedAt: number;
};

let cache: LastLesson | null | undefined;
const listeners = new Set<(v: LastLesson | null) => void>();

async function read(): Promise<LastLesson | null> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as LastLesson; } catch { return null; }
}

async function load(): Promise<LastLesson | null> {
  if (cache === undefined) cache = await read();
  return cache ?? null;
}

function broadcast(v: LastLesson | null) {
  cache = v;
  listeners.forEach((l) => l(v));
}

export async function setLastLesson(v: LastLesson) {
  await AsyncStorage.setItem(KEY, JSON.stringify(v));
  broadcast(v);
}

export async function clearLastLesson() {
  await AsyncStorage.removeItem(KEY);
  broadcast(null);
}

export function useLastLesson() {
  const [value, setValue] = useState<LastLesson | null | undefined>(cache);
  useEffect(() => {
    if (cache === undefined) load().then((v) => setValue(v));
    const l = (v: LastLesson | null) => setValue(v);
    listeners.add(l);
    return () => { listeners.delete(l); };
  }, []);
  const update = useCallback(setLastLesson, []);
  const clear = useCallback(clearLastLesson, []);
  return { lastLesson: value === undefined ? null : value, setLastLesson: update, clearLastLesson: clear };
}

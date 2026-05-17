import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const KEY = 'mrn.completed';

async function readSet(): Promise<Set<number>> {
  const raw = await AsyncStorage.getItem(KEY);
  return new Set(raw ? (JSON.parse(raw) as number[]) : []);
}
async function writeSet(set: Set<number>) {
  await AsyncStorage.setItem(KEY, JSON.stringify(Array.from(set)));
}

let cache: Set<number> | null = null;
const listeners = new Set<(s: Set<number>) => void>();

async function load(): Promise<Set<number>> {
  if (!cache) cache = await readSet();
  return cache;
}
function broadcast(s: Set<number>) {
  cache = s;
  listeners.forEach((l) => l(s));
}

export function useCompleted() {
  const [set, setSet] = useState<Set<number>>(() => cache || new Set());
  useEffect(() => {
    if (!cache) load().then((s) => setSet(new Set(s)));
    const l = (s: Set<number>) => setSet(new Set(s));
    listeners.add(l);
    return () => { listeners.delete(l); };
  }, []);
  const markCompleted = useCallback(async (id: number) => {
    const current = await load();
    const next = new Set(current); next.add(id);
    await writeSet(next); broadcast(next);
  }, []);
  const unmark = useCallback(async (id: number) => {
    const current = await load();
    const next = new Set(current); next.delete(id);
    await writeSet(next); broadcast(next);
  }, []);
  const isCompleted = useCallback((id: number) => set.has(id), [set]);
  return { completed: Array.from(set), isCompleted, markCompleted, unmark };
}

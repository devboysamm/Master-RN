import { useCallback, useEffect, useState } from 'react';
import * as modulesApi from './modules';
import * as lessonsApi from './lessons';
import * as appContentApi from './appContent';
import * as categoriesApi from './categories';
import type { Module, Lesson, AppContent } from './mock';
import type { Category } from './categories';

type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
};

// A positive integer id is required before we hit an id-based endpoint.
// Anything else (undefined / null / 0 / NaN) means "no id yet" — we must NOT
// fetch and must NOT show placeholder data; the screen stays in its loading
// state until a real id arrives.
function isValidId(id?: number | null): id is number {
  return typeof id === 'number' && Number.isInteger(id) && id > 0;
}

function useAsync<T>(fetcher: () => Promise<T>, enabled = true): AsyncState<T> {
  const [data, setData] = useState<T | null>(null);
  // Start in loading until the first fetch resolves (or, when disabled, until
  // a valid id arrives) — never a "ready with no data" frame.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    // Not ready to fetch yet (e.g. id not known) → clean loading state.
    // Never fetch, never error, never substitute mock data.
    if (!enabled) {
      setData(null);
      setError(null);
      setLoading(true);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetcher()
      .then((d) => { if (!cancelled) setData(d); })
      .catch((e: Error) => {
        if (cancelled) return;
        // Surface the real error. We NEVER silently fall back to mock data —
        // a normal user must only ever see real content (or a clean error).
        setError(e.message || 'Network error');
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [fetcher, tick, enabled]);

  const refresh = useCallback(() => setTick((t) => t + 1), []);
  return { data, loading, error, refresh };
}

export function useModules() {
  const fetcher = useCallback(() => modulesApi.getModules(), []);
  return useAsync<Module[]>(fetcher);
}

export function useModule(id?: number | null) {
  const enabled = isValidId(id);
  const fetcher = useCallback(() => modulesApi.getModule(id as number), [id]);
  return useAsync<Module>(fetcher, enabled);
}

export function useModuleLessons(id?: number | null) {
  const enabled = isValidId(id);
  const fetcher = useCallback(() => modulesApi.getModuleLessons(id as number), [id]);
  return useAsync<Lesson[]>(fetcher, enabled);
}

export function useLesson(id?: number | null) {
  const enabled = isValidId(id);
  const fetcher = useCallback(() => lessonsApi.getLesson(id as number), [id]);
  return useAsync<Lesson>(fetcher, enabled);
}

export function useAppContent() {
  const fetcher = useCallback(() => appContentApi.getAppContent(), []);
  return useAsync<AppContent>(fetcher);
}

export function useCategories() {
  const fetcher = useCallback(() => categoriesApi.getCategories(), []);
  return useAsync<Category[]>(fetcher);
}

export function useCategoryModules(id: number | null) {
  // null = no category filter → resolve to an empty list (not an error, not mock).
  const fetcher = useCallback(
    () => (id == null ? Promise.resolve([] as Module[]) : categoriesApi.getCategoryModules(id)),
    [id],
  );
  return useAsync<Module[]>(fetcher);
}

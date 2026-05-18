import { useCallback, useEffect, useState } from 'react';
import * as modulesApi from './modules';
import * as lessonsApi from './lessons';
import * as appContentApi from './appContent';
import * as categoriesApi from './categories';
import {
  mockModules, mockAppContent, mockCategories, lessonsForModule, findLesson, findModule,
  type Module, type Lesson, type AppContent,
} from './mock';
import type { Category } from './categories';

type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
};

function useAsync<T>(fetcher: () => Promise<T>, fallback: T): AsyncState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetcher()
      .then((d) => { if (!cancelled) setData(d); })
      .catch((e: Error) => {
        if (cancelled) return;
        if (__DEV__) {
          // eslint-disable-next-line no-console
          console.warn('[api] falling back to mock:', e.message);
          setData(fallback);
        } else {
          setError(e.message || 'Network error');
        }
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [fetcher, tick]);

  const refresh = useCallback(() => setTick((t) => t + 1), []);
  return { data, loading, error, refresh };
}

export function useModules() {
  const fetcher = useCallback(() => modulesApi.getModules(), []);
  return useAsync<Module[]>(fetcher, mockModules);
}

export function useModule(id: number) {
  const fetcher = useCallback(() => modulesApi.getModule(id), [id]);
  const fallback = findModule(id) ?? mockModules[0];
  return useAsync<Module>(fetcher, fallback);
}

export function useModuleLessons(id: number) {
  const fetcher = useCallback(() => modulesApi.getModuleLessons(id), [id]);
  return useAsync<Lesson[]>(fetcher, lessonsForModule(id));
}

export function useLesson(id: number) {
  const fetcher = useCallback(() => lessonsApi.getLesson(id), [id]);
  const fallback = findLesson(id) ?? { id, module_id: 0, title: '', description: '', content: '', read_time: 0, lesson_order: 0 };
  return useAsync<Lesson>(fetcher, fallback);
}

export function useAppContent() {
  const fetcher = useCallback(() => appContentApi.getAppContent(), []);
  return useAsync<AppContent>(fetcher, mockAppContent);
}

export function useCategories() {
  const fetcher = useCallback(() => categoriesApi.getCategories(), []);
  return useAsync<Category[]>(fetcher, mockCategories);
}

export function useCategoryModules(id: number | null) {
  const fetcher = useCallback(
    () => (id == null ? Promise.resolve([]) : categoriesApi.getCategoryModules(id)),
    [id],
  );
  return useAsync<Module[]>(fetcher, []);
}

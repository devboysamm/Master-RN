import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { AppTabName } from '../navigation/types';

type TabHistoryState = {
  /** Tab the user was on immediately before the current one. */
  previousTab: AppTabName | null;
  setPreviousTab: (name: AppTabName | null) => void;
  clearPreviousTab: () => void;
};

const TabHistoryContext = createContext<TabHistoryState | null>(null);

export function TabHistoryProvider({ children }: { children: React.ReactNode }) {
  const [previousTab, setPreviousTab] = useState<AppTabName | null>(null);
  const clearPreviousTab = useCallback(() => setPreviousTab(null), []);

  const value = useMemo(
    () => ({ previousTab, setPreviousTab, clearPreviousTab }),
    [previousTab, clearPreviousTab],
  );

  return (
    <TabHistoryContext.Provider value={value}>{children}</TabHistoryContext.Provider>
  );
}

export function useTabHistory(): TabHistoryState {
  const ctx = useContext(TabHistoryContext);
  if (!ctx) throw new Error('useTabHistory must be used within TabHistoryProvider');
  return ctx;
}

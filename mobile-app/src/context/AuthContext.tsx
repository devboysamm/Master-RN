import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as auth from '../storage/auth';

type SignUpInput = { name: string; email: string; password: string };
type SignInInput = { email: string; password: string };

type AuthMode = 'signin' | 'signup';
type TabName = 'Home' | 'Explore' | 'Progress' | 'Chat' | 'Profile';

type AuthState = {
  user: auth.StoredUser | null;
  isGuest: boolean;
  hydrated: boolean;
  /**
   * If set, the AuthFlow's stack opens directly on the Auth screen in this
   * mode (rather than the Splash → Welcome path). Used when a guest taps
   * "Sign in" / "Create account" from inside the app.
   */
  pendingAuthMode: AuthMode | null;
  /**
   * Which tab to land on after the AuthFlow exits (whether the user signed
   * in/up, cancelled with the back button, or swiped back). AppTabs reads
   * this on mount as its `initialRouteName`, then clears it.
   */
  pendingReturnTab: TabName | null;
  signIn: (input: SignInInput) => Promise<void>;
  signUp: (input: SignUpInput) => Promise<void>;
  signOut: () => Promise<void>;
  continueAsGuest: () => Promise<void>;
  /** Drop into AuthFlow and land on Auth with the given mode pre-selected. */
  requestAuth: (mode: AuthMode, opts?: { returnTo?: TabName }) => Promise<void>;
  /** Bail out of AuthFlow back into the app tabs as a guest. */
  cancelAuth: () => Promise<void>;
  /** Consumed by AppTabs once it has applied `initialRouteName`. */
  clearPendingReturnTab: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<auth.StoredUser | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [pendingAuthMode, setPendingAuthMode] = useState<AuthMode | null>(null);
  const [pendingReturnTab, setPendingReturnTab] = useState<TabName | null>(null);

  useEffect(() => {
    (async () => {
      const [u, g] = await Promise.all([auth.getUser(), auth.getGuest()]);
      setUserState(u);
      setIsGuest(g);
      setHydrated(true);
    })();
  }, []);

  const value: AuthState = useMemo(() => ({
    user,
    isGuest,
    hydrated,
    pendingAuthMode,
    pendingReturnTab,
    signIn: async ({ email }) => {
      const u: auth.StoredUser = { id: `u_${Date.now()}`, name: email.split('@')[0] || 'Friend', email };
      await auth.setUser(u);
      await auth.setGuest(false);
      setUserState(u);
      setIsGuest(false);
      setPendingAuthMode(null);
      // pendingReturnTab intentionally preserved — AppTabs consumes it.
    },
    signUp: async ({ name, email }) => {
      const u: auth.StoredUser = { id: `u_${Date.now()}`, name, email };
      await auth.setUser(u);
      await auth.setGuest(false);
      setUserState(u);
      setIsGuest(false);
      setPendingAuthMode(null);
    },
    signOut: async () => {
      await auth.clearUser();
      await auth.setGuest(false);
      setUserState(null);
      setIsGuest(false);
      setPendingAuthMode(null);
      setPendingReturnTab(null);
    },
    continueAsGuest: async () => {
      await auth.setGuest(true);
      setIsGuest(true);
      setPendingAuthMode(null);
    },
    requestAuth: async (mode, opts) => {
      // Set the mode + returnTo hints *before* clearing auth state so the
      // AuthFlow re-mounts with the correct initial route on the very
      // next render.
      setPendingAuthMode(mode);
      setPendingReturnTab(opts?.returnTo ?? null);
      await auth.clearUser();
      await auth.setGuest(false);
      setUserState(null);
      setIsGuest(false);
    },
    cancelAuth: async () => {
      // Bail out of AuthFlow back into the tabs as a guest. pendingReturnTab
      // is preserved so AppTabs lands on the originating tab.
      await auth.setGuest(true);
      setIsGuest(true);
      setPendingAuthMode(null);
    },
    clearPendingReturnTab: () => setPendingReturnTab(null),
  }), [user, isGuest, hydrated, pendingAuthMode, pendingReturnTab]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as auth from '../storage/auth';

type SignUpInput = { name: string; email: string; password: string };
type SignInInput = { email: string; password: string };

type AuthMode = 'signin' | 'signup';

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
  signIn: (input: SignInInput) => Promise<void>;
  signUp: (input: SignUpInput) => Promise<void>;
  signOut: () => Promise<void>;
  continueAsGuest: () => Promise<void>;
  /** Drop into AuthFlow and land on Auth with the given mode pre-selected. */
  requestAuth: (mode: AuthMode) => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<auth.StoredUser | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [pendingAuthMode, setPendingAuthMode] = useState<AuthMode | null>(null);

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
    signIn: async ({ email }) => {
      const u: auth.StoredUser = { id: `u_${Date.now()}`, name: email.split('@')[0] || 'Friend', email };
      await auth.setUser(u);
      await auth.setGuest(false);
      setUserState(u);
      setIsGuest(false);
      setPendingAuthMode(null);
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
    },
    continueAsGuest: async () => {
      await auth.setGuest(true);
      setIsGuest(true);
      setPendingAuthMode(null);
    },
    requestAuth: async (mode) => {
      // Set the mode hint *before* clearing auth state so the AuthFlow
      // re-mounts with the correct initial route on the very next render.
      setPendingAuthMode(mode);
      await auth.clearUser();
      await auth.setGuest(false);
      setUserState(null);
      setIsGuest(false);
    },
  }), [user, isGuest, hydrated, pendingAuthMode]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

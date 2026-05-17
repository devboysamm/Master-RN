import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as auth from '../storage/auth';

type SignUpInput = { name: string; email: string; password: string };
type SignInInput = { email: string; password: string };

type AuthState = {
  user: auth.StoredUser | null;
  isGuest: boolean;
  hydrated: boolean;
  signIn: (input: SignInInput) => Promise<void>;
  signUp: (input: SignUpInput) => Promise<void>;
  signOut: () => Promise<void>;
  continueAsGuest: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<auth.StoredUser | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [hydrated, setHydrated] = useState(false);

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
    signIn: async ({ email }) => {
      const u: auth.StoredUser = { id: `u_${Date.now()}`, name: email.split('@')[0] || 'Friend', email };
      await auth.setUser(u);
      await auth.setGuest(false);
      setUserState(u);
      setIsGuest(false);
    },
    signUp: async ({ name, email }) => {
      const u: auth.StoredUser = { id: `u_${Date.now()}`, name, email };
      await auth.setUser(u);
      await auth.setGuest(false);
      setUserState(u);
      setIsGuest(false);
    },
    signOut: async () => {
      await auth.clearUser();
      await auth.setGuest(false);
      setUserState(null);
      setIsGuest(false);
    },
    continueAsGuest: async () => {
      await auth.setGuest(true);
      setIsGuest(true);
    },
  }), [user, isGuest, hydrated]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

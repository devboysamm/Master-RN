import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as auth from '../storage/auth';
import * as authApi from '../api/auth';
import { ApiError } from '../api/client';

type AuthMode = 'signin' | 'signup';
type TabName = 'Home' | 'Explore' | 'Progress' | 'Chat' | 'Profile';

function toStoredUser(u: authApi.AuthUser): auth.StoredUser {
  return { id: u.id, name: u.name, email: u.email, bio: u.bio ?? null };
}

type AuthState = {
  user: auth.StoredUser | null;
  /** Raw JWT — exposed so authenticated requests can attach it. */
  token: string | null;
  isGuest: boolean;
  hydrated: boolean;
  /**
   * If set, the AuthFlow's stack opens directly on the Auth screen in this
   * mode (rather than the Splash → Welcome path). Used when a guest taps
   * "Sign in" / "Create account" from inside the app.
   */
  pendingAuthMode: AuthMode | null;
  /**
   * Which tab to land on after the AuthFlow exits. AppTabs reads this on
   * mount as its `initialRouteName`, then clears it.
   */
  pendingReturnTab: TabName | null;

  /** Send a signup OTP. Does NOT authenticate — caller shows the OTP screen. */
  signUp: (email: string, name: string, password: string) => Promise<void>;
  /**
   * Verify the signup OTP. Resolves with a `commit()` you call when ready to
   * actually log the user in (so the screen can show a success animation
   * first). Throws on a bad/expired code. The committer always lands the
   * user on Home (a fresh signup ignores any stale pendingReturnTab).
   */
  verifyOtp: (email: string, code: string) => Promise<() => Promise<void>>;
  /** Log in with email + password → stores token+user → authenticated. */
  signIn: (email: string, password: string) => Promise<void>;
  /**
   * Finalize login from an already-issued JWT (e.g. the GitHub OAuth flow):
   * fetch the user via /me, store token+user, and flip to authenticated —
   * the same end state as an email sign-in.
   */
  finalizeTokenLogin: (token: string) => Promise<void>;
  /** Request a password-reset OTP. */
  forgotPassword: (email: string) => Promise<void>;
  /** Complete a password reset with the emailed OTP. */
  resetPassword: (email: string, code: string, newPassword: string) => Promise<void>;
  /** Update the signed-in user's profile (name / bio) and persist it. */
  updateProfile: (name: string, bio: string) => Promise<void>;

  signOut: () => Promise<void>;
  /**
   * Permanently delete the signed-in user's account on the server, then clear
   * the local session (same end state as signOut → back to the auth flow).
   * Throws if the server delete fails so the caller can show an error and
   * keep the user logged in.
   */
  deleteAccount: () => Promise<void>;
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
  const [token, setToken] = useState<string | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [pendingAuthMode, setPendingAuthMode] = useState<AuthMode | null>(null);
  const [pendingReturnTab, setPendingReturnTab] = useState<TabName | null>(null);

  // On launch: restore a stored session and validate it against /me.
  useEffect(() => {
    (async () => {
      const [session, g] = await Promise.all([auth.getSession(), auth.getGuest()]);
      if (session?.token) {
        // Optimistically restore so the UI doesn't flash the auth flow.
        setToken(session.token);
        setUserState(session.user);
        try {
          const { user: fresh } = await authApi.me(session.token);
          const stored = toStoredUser(fresh);
          await auth.setSession({ token: session.token, user: stored });
          setUserState(stored);
        } catch (err) {
          // Only log out on an actual 401 — a network blip shouldn't nuke
          // the session and force a re-login when offline.
          if (err instanceof ApiError && err.status === 401) {
            await auth.clearSession();
            setToken(null);
            setUserState(null);
          }
        }
      }
      setIsGuest(g);
      setHydrated(true);
    })();
  }, []);

  const value: AuthState = useMemo(() => {
    const applySession = async (resp: authApi.TokenResponse) => {
      const stored = toStoredUser(resp.user);
      await auth.setSession({ token: resp.token, user: stored });
      await auth.setGuest(false);
      setToken(resp.token);
      setUserState(stored);
      setIsGuest(false);
      setPendingAuthMode(null);
      // pendingReturnTab intentionally preserved — AppTabs consumes it.
    };

    return {
      user,
      token,
      isGuest,
      hydrated,
      pendingAuthMode,
      pendingReturnTab,

      signUp: async (email, name, password) => {
        // Sends the OTP email; intentionally does not authenticate.
        await authApi.signup(email, name, password);
      },
      verifyOtp: async (email, code) => {
        // Verify the code immediately (throws on failure), but defer the
        // visible auth flip so the screen can play its success animation.
        const resp = await authApi.verifyOtp(email, code);
        const stored = toStoredUser(resp.user);
        return async () => {
          await auth.setSession({ token: resp.token, user: stored });
          await auth.setGuest(false);
          // Fresh signup always lands on Home — clear any stale
          // pendingReturnTab (e.g. 'Profile' from a guest deep-link).
          setPendingReturnTab(null);
          setToken(resp.token);
          setUserState(stored);
          setIsGuest(false);
          setPendingAuthMode(null);
        };
      },
      signIn: async (email, password) => {
        const resp = await authApi.login(email, password);
        await applySession(resp);
      },
      finalizeTokenLogin: async (jwt) => {
        // Validate the token + load the canonical user, then reuse the exact
        // same session-applying path as email login.
        const { user: fresh } = await authApi.me(jwt);
        await applySession({ token: jwt, user: fresh });
      },
      forgotPassword: async (email) => {
        await authApi.forgotPassword(email);
      },
      resetPassword: async (email, code, newPassword) => {
        await authApi.resetPassword(email, code, newPassword);
      },
      updateProfile: async (name, bio) => {
        if (!token) throw new Error('You must be signed in to edit your profile');
        const { user: updated } = await authApi.updateMe(token, { name, bio });
        const stored = toStoredUser(updated);
        // Keep the in-memory user and the persisted session in sync.
        await auth.setSession({ token, user: stored });
        setUserState(stored);
      },

      signOut: async () => {
        await auth.clearSession();
        await auth.setGuest(false);
        setToken(null);
        setUserState(null);
        setIsGuest(false);
        setPendingAuthMode(null);
        setPendingReturnTab(null);
      },
      deleteAccount: async () => {
        if (!token) throw new Error('You must be signed in to delete your account');
        // Delete server-side first; if this throws the caller keeps the user
        // logged in and surfaces the error. Only on success do we clear the
        // local session (mirrors signOut → returns to the auth flow).
        await authApi.deleteAccount(token);
        await auth.clearSession();
        await auth.setGuest(false);
        setToken(null);
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
        await auth.clearSession();
        await auth.setGuest(false);
        setToken(null);
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
    };
  }, [user, token, isGuest, hydrated, pendingAuthMode, pendingReturnTab]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

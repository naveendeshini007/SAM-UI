/**
 * AuthContext — single source of truth for authentication state.
 *
 * What lives here:
 *  - accessToken: stored IN MEMORY ONLY (never localStorage/sessionStorage)
 *  - user: basic profile info (id, username, email, full_name, is_admin)
 *  - isLoading: true while we attempt to re-hydrate user session on app load
 *  - login(): calls POST /login, returns the raw LoginResponse for the page to inspect
 *  - logout(): calls POST /logout, clears state, redirects to /login
 *  - setAccessToken(): exposed so the axios interceptor can update the token
 *    after a successful /refresh call (outside the React tree)
 *
 * On mount (useEffect):
 *  - We attempt GET /me to re-hydrate the user if a valid session cookie exists.
 *  - This means page refreshes don't force re-login as long as the refresh cookie is valid.
 *  - If /me fails (no cookie / expired), we silently stay logged out.
 *
 * FUTURE COGNITO MIGRATION:
 * - Replace accessToken state with Amplify.Auth.currentSession().getAccessToken()
 * - Replace login() with Amplify.Auth.signIn()
 * - Replace logout() with Amplify.Auth.signOut()
 * - Remove setAccessToken — Amplify manages token refresh internally
 * - Remove the /me re-hydration; use Amplify.Auth.currentAuthenticatedUser()
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import { injectTokenAccessor, markAppReady } from "../services/axiosInstance";
import { login as loginApi, logoutApi, getMe, refreshToken } from "../services/authService";
import type { AuthContextValue, AuthUser, LoginResponse } from "../types/Interfaces";

// ---------------------------------------------------------------------------
// Context creation
// ---------------------------------------------------------------------------

const AuthContext = createContext<AuthContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function AuthProvider({ children }: { children: ReactNode }) {
  // Access token lives ONLY here — never written to localStorage/sessionStorage
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const navigate = useNavigate();


  const tokenRef = useRef<string | null>(null);

  const setAccessToken = useCallback((token: string | null) => {
    tokenRef.current = token;
    setAccessTokenState(token);
  }, []);

  useEffect(() => {
    injectTokenAccessor(
      () => tokenRef.current,
      (token) => setAccessToken(token)
    );
  }, [setAccessToken]);

  useEffect(() => {
    let cancelled = false;

    async function rehydrate() {
      try {
        const refreshData = await refreshToken();
        if (!cancelled) setAccessToken(refreshData.access_token);
        const me = await getMe();
        if (!cancelled) {
          setUser({
            id: me.id,
            username: me.username,
            email: me.email,
            full_name: me.full_name,
            is_admin: me.is_admin,
          });
        }
      } catch {
        if (!cancelled) {
          setAccessToken(null);
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
          markAppReady();
        }
      }
    }

    rehydrate();
    return () => { cancelled = true; };
  }, []); 

  const login = useCallback(
    async (usernameOrEmail: string, password: string): Promise<LoginResponse> => {
      const response = await loginApi(usernameOrEmail, password);

      if (!response.require_password_change && response.access_token) {
        setAccessToken(response.access_token);

        const me = await getMe();
        setUser({
          id: me.id,
          username: me.username,
          email: me.email,
          full_name: me.full_name,
          is_admin: me.is_admin,
        });
      }

      return response;
    },
    [setAccessToken]
  );

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch {
      // Ignore errors — clear local state regardless
    } finally {
      setAccessToken(null);
      setUser(null);
      navigate("/login", { replace: true });
    }
  }, [setAccessToken, navigate]);

  const value: AuthContextValue = {
    accessToken,
    setAccessToken,
    user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}

export default AuthContext;

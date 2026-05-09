import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import * as authService from '../services/authService.js';
import { setAuthToken } from '../services/axiosConfig.js';
import { isLocalSessionUserId } from '../utils/isLocalSession.js';

const STORAGE_KEY = 'sweetmoment_auth';

const AuthContext = createContext(null);

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { user: null, token: null };
    const parsed = JSON.parse(raw);
    return {
      user: parsed.user || null,
      token: parsed.token || null,
    };
  } catch {
    return { user: null, token: null };
  }
}

function normalizeBackendUserId(...candidates) {
  for (const c of candidates) {
    const n = Number(c);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const { user: u, token: t } = readStored();
    // Force real backend auth for integration testing: clear legacy local-demo sessions.
    const isLegacyLocalSession = u && isLocalSessionUserId(u.id);
    if (isLegacyLocalSession) {
      setUser(null);
      setToken(null);
      setAuthToken(null);
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('sweetmoment_token');
    } else {
      setUser(u);
      setToken(t);
      setAuthToken(t);
    }
    setReady(true);
  }, []);

  const persist = useCallback((u, t) => {
    setUser(u);
    setToken(t);
    setAuthToken(t);
    if (u && t) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: u, token: t }));
    } else {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('sweetmoment_token');
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await authService.login(email, password);
    const raw = data.user || {};
    const normalizedId = normalizeBackendUserId(raw.id, raw._id, data.userId, data.id);
    if (!normalizedId) {
      throw new Error('Identifiant utilisateur invalide dans la réponse backend');
    }
    const nextUser = {
      id: normalizedId,
      email: raw.email || email,
      firstName: raw.firstName || data.firstName || 'Client',
      lastName: raw.lastName || data.lastName || 'Sweet',
      city: raw.city,
      phone: raw.phone,
      createdAt: raw.createdAt || new Date().toISOString(),
    };
    const tok = data.token || data.accessToken;
    persist(nextUser, tok);
    return data;
  }, [persist]);

  const register = useCallback(async (data) => {
    const res = await authService.register(data);
    const raw = res.user || {};
    const normalizedId = normalizeBackendUserId(raw.id, raw._id, res.userId, res.id);
    if (!normalizedId) {
      throw new Error('Identifiant utilisateur invalide dans la réponse backend');
    }
    const nextUser = {
      id: normalizedId,
      email: raw.email || data.email,
      firstName: raw.firstName || data.firstName,
      lastName: raw.lastName || data.lastName,
      city: data.city,
      phone: data.phone,
      createdAt: raw.createdAt || new Date().toISOString(),
    };
    const tok = res.token || res.accessToken;
    persist(nextUser, tok);
    return res;
  }, [persist]);

  const logout = useCallback(() => {
    persist(null, null);
  }, [persist]);

  const signInLocal = useCallback(
    (email) => {
      const safe = String(email || 'client@local.test').toLowerCase();
      const id = `local-${safe.replace(/[^a-z0-9]/gi, '').slice(0, 28) || 'user'}`;
      persist(
        {
          id,
          email: safe,
          firstName: 'Client',
          lastName: 'Local',
          createdAt: new Date().toISOString(),
        },
        'sweetmoment-local-token'
      );
    },
    [persist]
  );

  const signUpLocal = useCallback(
    (data) => {
      const safe = String(data.email || '').toLowerCase();
      const id = `local-${safe.replace(/[^a-z0-9]/gi, '').slice(0, 28) || 'user'}`;
      persist(
        {
          id,
          email: safe,
          firstName: data.firstName,
          lastName: data.lastName,
          city: data.city,
          phone: data.phone,
          createdAt: new Date().toISOString(),
        },
        'sweetmoment-local-token'
      );
    },
    [persist]
  );

  const setUserProfile = useCallback(
    (nextUser) => {
      persist(nextUser, token);
    },
    [persist, token]
  );

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      ready,
      login,
      register,
      logout,
      signInLocal,
      signUpLocal,
      setUserProfile,
    }),
    [
      user,
      token,
      ready,
      login,
      register,
      logout,
      signInLocal,
      signUpLocal,
      setUserProfile,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import {
  AUTH_SESSION_CLEARED_EVENT,
  clearAuthStorage,
  getStoredUser,
  getToken,
  saveStoredUser,
  saveToken,
} from '../utils/tokenStorage';
import { AUTH_BYPASS_ENABLED, DEV_AUTH_TOKEN, DEV_AUTH_USER } from '../config/auth';
import { getProfile } from '../services/authService';

const AuthContext = createContext(null);
const isDevAuthBypassActive = AUTH_BYPASS_ENABLED;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    if (isDevAuthBypassActive) {
      saveToken(DEV_AUTH_TOKEN);
      saveStoredUser(DEV_AUTH_USER);
      return DEV_AUTH_USER;
    }

    const storedUser = getStoredUser();
    const token = getToken();
    return storedUser && token ? storedUser : null;
  });
  const [loading, setLoading] = useState(() => Boolean(getToken() && !isDevAuthBypassActive));

  useEffect(() => {
    if (isDevAuthBypassActive) {
      return undefined;
    }

    const token = getToken();

    if (!token) {
      return undefined;
    }

    let isMounted = true;

    getProfile()
      .then((result) => {
        if (!isMounted) return;
        saveStoredUser(result.user);
        setUser(result.user);
      })
      .catch(() => {
        if (!isMounted) return;
        clearAuthStorage();
        setUser(null);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handleSessionCleared = () => {
      setUser(null);
    };

    window.addEventListener(AUTH_SESSION_CLEARED_EVENT, handleSessionCleared);

    return () => {
      window.removeEventListener(AUTH_SESSION_CLEARED_EVENT, handleSessionCleared);
    };
  }, []);

  const setAuthSession = useCallback((userData, token) => {
    saveToken(token);
    saveStoredUser(userData);
    setUser(userData);
  }, []);

  const updateUser = useCallback((userData) => {
    saveStoredUser(userData);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    clearAuthStorage();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      login: setAuthSession,
      register: setAuthSession,
      setAuthSession,
      updateUser,
      logout,
      isAuthBypassed: isDevAuthBypassActive,
      isAuthenticated: isDevAuthBypassActive || Boolean(user && getToken()),
    }),
    [user, loading, setAuthSession, updateUser, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;

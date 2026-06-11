import { createContext, useCallback, useMemo, useState } from 'react';

const STORAGE_KEY = 'app-user';

function loadStoredUser() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(loadStoredUser);

  const saveSession = useCallback((userData, token) => {
    const nextUser = { ...userData, token };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading: false, login: saveSession, register: saveSession, logout, isAuthenticated: Boolean(user) }),
    [user, saveSession, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;

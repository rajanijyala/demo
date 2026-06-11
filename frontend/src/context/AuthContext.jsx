import { createContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

function loadStoredUser() {
  try {
    const raw = localStorage.getItem('app-user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    localStorage.removeItem('app-user');
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(loadStoredUser);
  const loading = false;

  const login = (userData, token) => {
    const nextUser = { ...userData, token };
    try {
      localStorage.setItem('app-user', JSON.stringify(nextUser));
    } catch {
      throw new Error('Unable to save session. Storage may be full.');
    }
    setUser(nextUser);
  };

  const register = (userData, token) => {
    const nextUser = { ...userData, token };
    try {
      localStorage.setItem('app-user', JSON.stringify(nextUser));
    } catch {
      throw new Error('Unable to save session. Storage may be full.');
    }
    setUser(nextUser);
  };

  const logout = () => {
    try {
      localStorage.removeItem('app-user');
    } catch {
      // Proceed with logout even if storage clear fails
    }
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, register, logout, isAuthenticated: Boolean(user) }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;

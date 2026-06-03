import { createContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('app-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    const nextUser = { ...userData, token };
    localStorage.setItem('app-user', JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const register = (userData, token) => {
    const nextUser = { ...userData, token };
    localStorage.setItem('app-user', JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const logout = () => {
    localStorage.removeItem('app-user');
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, register, logout, isAuthenticated: Boolean(user) }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;

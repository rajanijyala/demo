const TOKEN_KEY = "auth-token";
const USER_KEY = "auth-user";

export const AUTH_SESSION_CLEARED_EVENT = "auth-session-cleared";

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const saveToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const getStoredUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const saveStoredUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const removeStoredUser = () => {
  localStorage.removeItem(USER_KEY);
};

export const clearAuthStorage = () => {
  removeToken();
  removeStoredUser();
};

import axios from 'axios';
import { AUTH_BYPASS_ENABLED, DEV_AUTH_TOKEN } from '../config/auth';
import { AUTH_SESSION_CLEARED_EVENT, clearAuthStorage, getToken } from '../utils/tokenStorage';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = AUTH_BYPASS_ENABLED ? DEV_AUTH_TOKEN : getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const responseData = error.response?.data;
    if (error.response?.status === 401 && !window.location.pathname.startsWith('/login')) {
      clearAuthStorage();
      window.dispatchEvent(new Event(AUTH_SESSION_CLEARED_EVENT));
    }
    const fallbackMessage = error.response
      ? 'Something went wrong while requesting the API.'
      : `Backend is not reachable at ${api.defaults.baseURL}. Make sure the backend server is running.`;
    const nextError = new Error(responseData?.message || fallbackMessage);
    nextError.status = error.response?.status;
    nextError.data = responseData;
    return Promise.reject(nextError);
  },
);

export default api;

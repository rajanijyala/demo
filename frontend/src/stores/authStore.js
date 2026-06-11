import { create } from 'zustand';
import api from '../lib/axios';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: true,

  setUser: (user) => set({ user, isAuthenticated: Boolean(user), loading: false }),

  login: async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    localStorage.setItem('accessToken', data.data.accessToken);
    localStorage.setItem('refreshToken', data.data.refreshToken);
    set({ user: data.data.user, isAuthenticated: true });
    return data.data;
  },

  register: async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    localStorage.setItem('accessToken', data.data.accessToken);
    localStorage.setItem('refreshToken', data.data.refreshToken);
    set({ user: data.data.user, isAuthenticated: true });
    return data.data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // proceed regardless
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({ user: null, isAuthenticated: false });
  },

  fetchProfile: async () => {
    try {
      const { data } = await api.get('/auth/profile');
      set({ user: data.data, isAuthenticated: true, loading: false });
    } catch {
      set({ user: null, isAuthenticated: false, loading: false });
    }
  },

  updateProfile: async (payload) => {
    const { data } = await api.put('/auth/profile', payload);
    set({ user: data.data });
    return data.data;
  },

  changePassword: async (payload) => {
    await api.put('/auth/change-password', payload);
  },

  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const { data } = await api.post('/auth/upload-avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    set({ user: data.data });
    return data.data;
  },
}));

export default useAuthStore;

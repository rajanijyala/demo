import { create } from 'zustand';
import api from '../lib/axios';

const useAnalyticsStore = create((set) => ({
  dashboard: null,
  loading: false,

  fetchDashboard: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get('/analytics/dashboard');
      set({ dashboard: data.data, loading: false });
      return data.data;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
}));

export default useAnalyticsStore;

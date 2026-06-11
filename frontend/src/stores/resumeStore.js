import { create } from 'zustand';
import api from '../lib/axios';

const useResumeStore = create((set) => ({
  resumes: [],
  loading: false,

  uploadResume: async (file, extractedText) => {
    set({ loading: true });
    const formData = new FormData();
    formData.append('resume', file);
    if (extractedText) formData.append('extractedText', extractedText);
    const { data } = await api.post('/resume/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    set((state) => ({ resumes: [data.data, ...state.resumes], loading: false }));
    return data.data;
  },

  fetchResumes: async () => {
    set({ loading: true });
    const { data } = await api.get('/resume');
    set({ resumes: data.data, loading: false });
    return data.data;
  },

  deleteResume: async (id) => {
    await api.delete(`/resume/${id}`);
    set((state) => ({ resumes: state.resumes.filter((r) => r._id !== id) }));
  },
}));

export default useResumeStore;

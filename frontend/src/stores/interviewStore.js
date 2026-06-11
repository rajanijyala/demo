import { create } from 'zustand';
import api from '../lib/axios';

const useInterviewStore = create((set, get) => ({
  interviews: [],
  currentInterview: null,
  questions: [],
  responses: [],
  currentQuestionIndex: 0,
  loading: false,

  setLoading: (loading) => set({ loading }),

  generateInterview: async (payload) => {
    set({ loading: true });
    const { data } = await api.post('/interview/generate', payload);
    set({ loading: false });
    return data.data;
  },

  startInterview: async (interviewId) => {
    set({ loading: true });
    const { data } = await api.post(`/interview/start/${interviewId}`);
    set({
      currentInterview: data.data.interview,
      questions: data.data.questions,
      currentQuestionIndex: 0,
      responses: [],
      loading: false,
    });
    return data.data;
  },

  submitAnswer: async (questionId, answer) => {
    const { data } = await api.post('/interview/answer', { questionId, answer });
    set((state) => ({ responses: [...state.responses, data.data] }));
    return data.data;
  },

  finishInterview: async (interviewId) => {
    const { data } = await api.post(`/interview/finish/${interviewId}`);
    set({ currentInterview: data.data });
    return data.data;
  },

  getInterview: async (interviewId) => {
    set({ loading: true });
    const { data } = await api.get(`/interview/${interviewId}`);
    set({
      currentInterview: data.data.interview,
      questions: data.data.questions,
      responses: data.data.responses,
      loading: false,
    });
    return data.data;
  },

  getUserInterviews: async () => {
    set({ loading: true });
    const { data } = await api.get('/interview/list');
    set({ interviews: data.data, loading: false });
    return data.data;
  },

  nextQuestion: () => {
    const { currentQuestionIndex, questions } = get();
    if (currentQuestionIndex < questions.length - 1) {
      set({ currentQuestionIndex: currentQuestionIndex + 1 });
    }
  },

  prevQuestion: () => {
    const { currentQuestionIndex } = get();
    if (currentQuestionIndex > 0) {
      set({ currentQuestionIndex: currentQuestionIndex - 1 });
    }
  },

  resetInterview: () =>
    set({ currentInterview: null, questions: [], responses: [], currentQuestionIndex: 0 }),
}));

export default useInterviewStore;

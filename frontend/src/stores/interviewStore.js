import { create } from 'zustand';

export const useInterviewStore = create((set) => ({
  config: {
    role: 'Full Stack Developer',
    experienceLevel: 'fresher',
    interviewType: 'mixed',
    durationMinutes: 30,
    questionCount: 6,
  },
  setConfig: (config) => set((state) => ({ config: { ...state.config, ...config } })),
  clearConfig: () =>
    set({
      config: {
        role: 'Full Stack Developer',
        experienceLevel: 'fresher',
        interviewType: 'mixed',
        durationMinutes: 30,
        questionCount: 6,
      },
    }),
}));

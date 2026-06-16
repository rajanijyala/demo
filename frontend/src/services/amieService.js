import api from './api';

export const configureInterview = async (payload) => {
  const { data } = await api.post('/v1/interview/configure', payload);
  return data;
};

export const getInterviewTemplates = async () => {
  const { data } = await api.get('/v1/interview/templates');
  return data;
};

export const startInterview = async (payload) => {
  const { data } = await api.post('/v1/interview/start', payload);
  return data;
};

export const startResumeInterview = async (payload) => {
  const { data } = await api.post('/v1/resume-interview/start', payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const saveInterviewResponse = async (sessionId, payload) => {
  const { data } = await api.post(`/v1/interview/${sessionId}/responses`, payload);
  return data;
};

export const submitInterview = async (payload) => {
  const { data } = await api.post('/v1/interview/submit', payload);
  return data;
};

export const getInterviewHistory = async () => {
  const { data } = await api.get('/v1/interview/history');
  return data;
};

export const getInterview = async (id) => {
  const { data } = await api.get(`/v1/interview/${id}`);
  return data;
};

export const generateQuestions = async (payload) => {
  const { data } = await api.post('/v1/questions/generate', payload);
  return data;
};

export const getQuestions = async () => {
  const { data } = await api.get('/v1/questions');
  return data;
};

export const getDashboard = async () => {
  const { data } = await api.get('/v1/dashboard');
  return data;
};

export const getNotifications = async () => {
  const { data } = await api.get('/v1/notifications');
  return data;
};

import api from './api';

export const registerUser = async (payload) => {
  const { data } = await api.post('/auth/register', payload);
  return data;
};

export const verifyRegisterOtp = async (payload) => {
  const { data } = await api.post('/auth/verify-register-otp', payload);
  return data;
};

export const loginUser = async (credentials) => {
  const { data } = await api.post('/auth/login', credentials);
  return data;
};

export const verifyLoginOtp = async (payload) => {
  const { data } = await api.post('/auth/verify-login-otp', payload);
  return data;
};

export const getProfile = async () => {
  const { data } = await api.get('/auth/profile');
  return data;
};

import api from './api';
import { delay } from '../utils/helpers';

export const loginUser = async (credentials) => {
  await delay(500);
  const { data } = await api.get('/users');
  const user = data.find((item) => item.email === credentials.email);

  if (!user) {
    throw new Error('No user found for that email.');
  }

  return { user: { id: user.id, name: user.name, email: user.email }, token: 'demo-token' };
};

export const registerUser = async (payload) => {
  await delay(600);
  return { user: { id: Date.now(), name: payload.name, email: payload.email }, token: 'demo-token' };
};

import api from './api';
import { delay, sanitizeEmail, generateToken } from '../utils/helpers';

export const loginUser = async (credentials) => {
  const email = sanitizeEmail(credentials.email);
  if (!email) {
    throw new Error('Invalid email address.');
  }

  await delay(500);
  const { data } = await api.get('/users');
  const user = data.find((item) => item.email === email);

  if (!user) {
    throw new Error('No user found for that email.');
  }

  return { user: { id: user.id, name: user.name, email: user.email }, token: generateToken() };
};

export const registerUser = async (payload) => {
  const email = sanitizeEmail(payload.email);
  if (!email) {
    throw new Error('Invalid email address.');
  }

  await delay(600);
  return { user: { id: Date.now(), name: payload.name, email }, token: generateToken() };
};

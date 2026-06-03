import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://jsonplaceholder.typicode.com',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong while requesting the API.';
    return Promise.reject(new Error(message));
  },
);

export default api;

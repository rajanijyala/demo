export const AUTH_BYPASS_ENABLED = import.meta.env.VITE_BYPASS_AUTH === 'true';

export const DEV_AUTH_TOKEN = 'dev-bypass-token';

export const DEV_AUTH_USER = {
  id: 'dev-candidate',
  name: 'Demo Candidate',
  email: 'demo.candidate@example.com',
  role: 'candidate',
  isEmailVerified: true,
};

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const AUTH_ENDPOINTS = {
  LOGIN: `${API_URL}/auth/login`,
  REGISTER: `${API_URL}/auth/register`,
  FORGOT_PASSWORD: `${API_URL}/auth/forgot-password`,
  RESET_PASSWORD: `${API_URL}/auth/reset-password`,
};

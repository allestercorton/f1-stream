export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const AUTH_ENDPOINTS = {
  STATUS: `${API_URL}/auth/status`,
  LOGIN: `${API_URL}/auth/google`,
  LOGOUT: `${API_URL}/auth/logout`,
  PROFILE: `${API_URL}/api/user/profile`,
};

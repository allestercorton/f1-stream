import { create } from 'zustand';
import { AuthState } from '@/types/auth';
import api from '@/utils/api';

const API_URL = `${import.meta.env.VITE_API_URL}` || 'http://localhost:5000';

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  isPending: false,
  hasCheckedAuth: false,

  checkAuthStatus: async () => {
    try {
      const response = await api.get(`${API_URL}/auth/status`);
      set({ isAuthenticated: response.data.isAuthenticated });

      // If authenticated, fetch user profile
      if (response.data.isAuthenticated) {
        const profileResponse = await api.get(`${API_URL}/api/user/profile`);
        set({ user: profileResponse.data });
      }
    } catch (error) {
      console.error(error);
      set({ isAuthenticated: false });
    } finally {
      set({ hasCheckedAuth: true });
    }
  },

  login: () => {
    set({ isPending: true, isAuthenticated: true });
    window.location.href = `${API_URL}/auth/google`;
  },

  logout: async () => {
    try {
      await api.get(`${API_URL}/auth/logout`);
      set({ isAuthenticated: false, user: null });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  },
}));

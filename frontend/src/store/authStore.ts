import { create } from 'zustand';
import toast from 'react-hot-toast';
import { AuthState } from '@/types/auth';
import api from '@/utils/api';
import { AUTH_ENDPOINTS } from '@/constants/api';

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  isPending: false,
  hasCheckedAuth: false,

  // check the user's authentication status
  checkAuthStatus: async () => {
    try {
      set({ isPending: true });
      const response = await api.get(AUTH_ENDPOINTS.STATUS);
      set({ isAuthenticated: response.data.isAuthenticated });

      // if authenticated, fetch user profile
      if (response.data.isAuthenticated) {
        const profileResponse = await api.get(AUTH_ENDPOINTS.PROFILE);
        set({ user: profileResponse.data });
      }
    } catch (error) {
      console.error(error);
      set({ isAuthenticated: false, user: null });
    } finally {
      set({ isPending: false, hasCheckedAuth: true });
    }
  },

  // initiate login process
  login: () => {
    // prevent duplicate clicks
    if (useAuthStore.getState().isPending) return;

    set({ isPending: true });
    window.location.href = AUTH_ENDPOINTS.LOGIN;
  },

  // handle logout
  logout: async () => {
    try {
      set({ isPending: true });
      await api.get(AUTH_ENDPOINTS.LOGOUT);
      set({ isPending: false, isAuthenticated: false, user: null });
      toast.success('Logged out successfully.');
    } catch (error) {
      set({ isPending: false });
      console.error('Logout failed:', error);
      toast.error('Logout failed. Please try again.');
    }
  },
}));

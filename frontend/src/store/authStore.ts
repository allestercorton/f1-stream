import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
import type {
  AuthState,
  LoginCredentials,
  RegisterCredentials,
} from '@/types/auth';
import getErrorMessage from '@/utils/handleError';

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  error: null,
};

export const useAuthStore = create<
  AuthState & {
    login: (credentials: LoginCredentials) => Promise<boolean>;
    register: (credentials: RegisterCredentials) => Promise<boolean>;
    logout: () => void;
    clearError: () => void;
  }
>()(
  persist(
    devtools((set) => ({
      ...initialState,

      login: async (credentials) => {
        try {
          set({ error: null });

          const { data } = await api.post('/auth/login', credentials);

          // Save token to localStorage
          localStorage.setItem('token', data.token);

          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
          });

          toast.success('Welcome back to F1Stream!');
          return true;
        } catch (error) {
          set({
            error: getErrorMessage(error, 'Failed to login'),
          });
          return false;
        }
      },

      register: async (credentials) => {
        try {
          set({ error: null });
          const { data } = await api.post('/auth/register', credentials);

          // Save token to localStorage
          localStorage.setItem('token', data.token);

          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
          });

          toast.success('Account created! Enjoy the race.');
          return true;
        } catch (error) {
          set({
            error: getErrorMessage(error, 'Failed to register'),
          });
          return false;
        }
      },

      logout: () => {
        // Remove token from localStorage
        localStorage.removeItem('token');
        set(initialState);
        toast.success('Logged out successfully');
      },

      clearError: () => set({ error: null }),
    })),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

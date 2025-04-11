import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import toast from 'react-hot-toast';
import type { AuthState } from '@/types/auth';
import getErrorMessage from '@/utils/handleError';
import { loginAPI, registerAPI } from '@/api/authApi';
import { LoginFormValues, RegisterFormValues } from '@/utils/validation';

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isPending: false,
  error: null,
};

export const useAuthStore = create<
  AuthState & {
    login: (credentials: LoginFormValues) => Promise<boolean>;
    register: (credentials: RegisterFormValues) => Promise<boolean>;
    logout: () => void;
    clearError: () => void;
  }
>()(
  persist(
    devtools((set) => ({
      ...initialState,

      login: async (credentials) => {
        set({ isPending: true });
        try {
          const { data } = await loginAPI(credentials);
          localStorage.setItem('token', data.token);
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isPending: false,
          });
          toast.success('Welcome to F1Stream!');
          return true;
        } catch (error) {
          set({ isPending: false });
          toast.error(
            getErrorMessage(
              error,
              'Login failed. Please check your credentials.',
            ),
          );
          return false;
        }
      },

      register: async (credentials) => {
        set({ isPending: true });
        try {
          const { data } = await registerAPI(credentials);
          localStorage.setItem('token', data.token);
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isPending: false,
          });
          toast.success('Account created! Enjoy the race.');
          return true;
        } catch (error) {
          set({ isPending: false });
          toast.error(
            getErrorMessage(error, 'Registration failed. Please try again.'),
          );
          return false;
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        set(initialState);
        toast.success('Logged out successfully.');
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

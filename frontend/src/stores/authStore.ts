import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import axios from 'axios';
import { AuthState } from '../types/auth.types';
import { loginAPI, registerAPI } from '../api/authApi';

const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        login: async (email, password) => {
          set({ isLoading: true, error: null });

          try {
            const userData = await loginAPI({ email, password });
            localStorage.setItem('token', userData.token);
            set({ user: userData, isAuthenticated: true, isLoading: false });
            return true;
          } catch (error) {
            const errorMessage = axios.isAxiosError(error)
              ? error.response?.data?.message || 'Login failed'
              : 'Login failed';
            set({ isLoading: false, error: errorMessage });
            return false;
          }
        },

        register: async (name, email, password, confirmPassword) => {
          set({ isLoading: true, error: null });

          try {
            const userData = await registerAPI({
              name,
              email,
              password,
              confirmPassword,
            });
            localStorage.setItem('token', userData.token);
            set({ user: userData, isAuthenticated: true, isLoading: false });
            return true;
          } catch (error) {
            const errorMessage = axios.isAxiosError(error)
              ? error.response?.data?.message || 'Registration failed'
              : 'Registration failed';
            set({ isLoading: false, error: errorMessage });
            return false;
          }
        },

        logout: () => {
          localStorage.removeItem('token');
          set({ user: null, isAuthenticated: false });
        },

        clearError: () => set({ error: null }),
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      },
    ),
  ),
);

export default useAuthStore;

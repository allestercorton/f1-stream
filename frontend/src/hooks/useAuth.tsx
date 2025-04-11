import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { forgotPasswordAPI, resetPasswordAPI } from '@/api/authApi';
import getErrorMessage from '@/utils/handleError';

// Mutation to handle forgot password API request
export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: forgotPasswordAPI,
    onSuccess: () => {
      toast.success('Reset password link sent to your email.');
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(
          error,
          'Failed to send reset password link. Please try again.',
        ),
      );
    },
  });
};

// Mutation to handle reset password API request
export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: resetPasswordAPI,
    onSuccess: () => {
      toast.success('Password successfully reset. You can now log in.');
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(error, 'Password reset failed. Please try again.'),
      );
    },
  });
};

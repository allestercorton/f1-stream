import api from '../utils/api';
import {
  RegisterFormValues,
  LoginFormValues,
  ForgotPasswordFormValue,
  ResetPasswordFormValues,
} from '../utils/validation';
import { AUTH_ENDPOINTS } from '@/constants/api';

export const loginAPI = (data: LoginFormValues) =>
  api.post(AUTH_ENDPOINTS.LOGIN, data);

export const registerAPI = (data: RegisterFormValues) =>
  api.post(AUTH_ENDPOINTS.REGISTER, data);

export const forgotPasswordAPI = (data: ForgotPasswordFormValue) =>
  api.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, data);

export const resetPasswordAPI = ({
  data,
  token,
}: {
  data: ResetPasswordFormValues;
  token: string;
}) => api.post(`${AUTH_ENDPOINTS.RESET_PASSWORD}/${token}`, data);

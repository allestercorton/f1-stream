import api from '../lib/api';
import {
  RegisterFormValues,
  LoginFormValues,
  ForgotPasswordFormValue,
  ResetPasswordFormValues,
} from '../utils/validation';

const AUTH_URL = '/auth';

export const loginAPI = (data: LoginFormValues) =>
  api.post(`${AUTH_URL}/login`, data);

export const registerAPI = (data: RegisterFormValues) =>
  api.post(`${AUTH_URL}/register`, data);

export const forgotPasswordAPI = (data: ForgotPasswordFormValue) =>
  api.post(`${AUTH_URL}/forgot-password`, data);

export const resetPasswordAPI = ({
  data,
  token,
}: {
  data: ResetPasswordFormValues;
  token: string;
}) => api.post(`${AUTH_URL}/reset-password/${token}`, data);

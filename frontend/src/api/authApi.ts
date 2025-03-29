import api from '../lib/api';
import { RegisterFormValues, LoginFormValues } from '../utils/validation';

const AUTH_URL = '/auth';

export const loginAPI = (data: LoginFormValues) => {
  return api.post(`${AUTH_URL}/login`, data);
};

export const registerAPI = (data: RegisterFormValues) => {
  return api.post(`${AUTH_URL}/register`, data);
};

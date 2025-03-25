import axios from 'axios';
import axiosInstance from '../utils/axiosConfig';
import {
  ApiResponse,
  User,
  LoginFormData,
  RegisterFormData,
} from '../types/auth.types';

const AUTH_URL = '/v1/auth';

const handleRequest = async <T>(
  request: Promise<{ data: ApiResponse<T> }>,
): Promise<T> => {
  try {
    const { data } = await request;
    return data.data;
  } catch (error) {
    throw (
      (axios.isAxiosError(error) && error.response?.data?.message) ||
      'Something went wrong'
    );
  }
};

export const loginAPI = (data: LoginFormData): Promise<User> =>
  handleRequest(
    axiosInstance.post<ApiResponse<User>>(`${AUTH_URL}/login`, data),
  );

export const registerAPI = (data: RegisterFormData): Promise<User> =>
  handleRequest(
    axiosInstance.post<ApiResponse<User>>(`${AUTH_URL}/register`, data),
  );

export const getUserProfileAPI = (): Promise<User> =>
  handleRequest(axiosInstance.get<ApiResponse<User>>(`${AUTH_URL}/profile`));

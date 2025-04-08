import axios from 'axios';
import { API_URL } from '@/constants/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

export default api;

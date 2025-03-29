export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isPending: boolean;
  error: string | null;
}

export interface AuthResponse {
  user: User;
  token: string;
}

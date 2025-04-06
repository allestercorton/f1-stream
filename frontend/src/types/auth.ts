export interface User {
  _id: string;
  googleId: string;
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isPending: boolean;
  checkAuthStatus: () => Promise<void>;
  login: () => void;
  logout: () => Promise<void>;
}

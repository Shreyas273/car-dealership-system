import { api } from './axios';
import type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  User,
} from '../types/auth';
import type { ApiResponse } from '../types/vehicle';

export const authApi = {
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const { data } = await api.post<ApiResponse<AuthResponse>>(
      '/api/auth/register',
      credentials,
    );
    return data.data;
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await api.post<ApiResponse<AuthResponse>>(
      '/api/auth/login',
      credentials,
    );
    return data.data;
  },

  getMe: async (): Promise<User> => {
    const { data } = await api.get<ApiResponse<{ user: User }>>('/api/auth/me');
    return data.data.user;
  },
};

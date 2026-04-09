import { api } from './client';
import { AuthResponse, LoginRequest, RegisterRequest } from '../types/api';
import { getAuthErrorMessage } from '../utils/apiError';

export async function login(payload: LoginRequest) {
  const { data } = await api.post<AuthResponse>('auth/login', payload);
  return data;
}

export async function register(payload: RegisterRequest) {
  const { data } = await api.post<AuthResponse>('auth/register', payload);
  return data;
}

export { getAuthErrorMessage as getApiErrorMessage };

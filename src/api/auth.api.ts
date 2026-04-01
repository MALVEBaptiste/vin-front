import client from './client';
import type { LoginDto, RegisterDto, AuthResponse } from '../types/auth.types';

export const register = (data: RegisterDto) =>
  client.post<AuthResponse>('/auth/register', data).then((r) => r.data);

export const login = (data: LoginDto) =>
  client.post<AuthResponse>('/auth/login', data).then((r) => r.data);

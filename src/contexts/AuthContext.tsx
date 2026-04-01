import { createContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { Player } from '../types/auth.types';
import * as authApi from '../api/auth.api';
import type { LoginDto, RegisterDto } from '../types/auth.types';

export interface AuthContextValue {
  user: Player | null;
  token: string | null;
  isAdmin: boolean;
  login: (dto: LoginDto) => Promise<void>;
  register: (dto: RegisterDto) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Player | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? (JSON.parse(stored) as Player) : null;
  });
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem('token'),
  );

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [token]);

  const login = useCallback(async (dto: LoginDto) => {
    const res = await authApi.login(dto);
    setUser({ id: res.id, username: res.username, isAdmin: res.isAdmin });
    setToken(res.accessToken);
  }, []);

  const register = useCallback(async (dto: RegisterDto) => {
    const res = await authApi.register(dto);
    setUser({ id: res.id, username: res.username });
    setToken(res.accessToken);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, isAdmin: user?.isAdmin ?? false, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

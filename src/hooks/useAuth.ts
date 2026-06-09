import { useState, useCallback, useEffect } from 'react';
import type { User, AuthState, LoginCredentials, RegisterData } from '../types/auth';
import { authService } from '../services/authService';

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    token: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService.init();
    const user = authService.getSession();
    const token = authService.getToken();
    if (user && token) {
      setAuthState({ user, isAuthenticated: true, token });
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const result = await authService.login(credentials);
    if (result.success && result.user && result.token) {
      setAuthState({ user: result.user, isAuthenticated: true, token: result.token });
    }
    return result;
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    const result = await authService.register(data);
    if (result.success && result.user && result.token) {
      setAuthState({ user: result.user, isAuthenticated: true, token: result.token });
    }
    return result;
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setAuthState({ user: null, isAuthenticated: false, token: null });
  }, []);

  const updateUser = useCallback((user: User) => {
    setAuthState((prev) => ({ ...prev, user }));
  }, []);

  return { authState, loading, login, register, logout, updateUser };
}

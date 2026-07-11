import { createContext, useCallback, useEffect, useState } from 'react';
import { api, setAccessToken } from '../api/client';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const bootstrap = useCallback(async () => {
    try {
      const { data } = await api.post('/auth/refresh');
      setAccessToken(data.accessToken);
      setUser(data.user);
    } catch {
      setAccessToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    bootstrap();
    const onExpired = () => setUser(null);
    window.addEventListener('auth:expired', onExpired);
    return () => window.removeEventListener('auth:expired', onExpired);
  }, [bootstrap]);

  const register = async ({ name, email, password, reminderTime }) => {
    const { data } = await api.post('/auth/register', { name, email, password, reminderTime });
    setAccessToken(data.accessToken);
    setUser(data.user);
    return data.user;
  };

  const login = async ({ email, password }) => {
    const { data } = await api.post('/auth/login', { email, password });
    setAccessToken(data.accessToken);
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  };

  const refreshUser = async () => {
    const { data } = await api.get('/auth/me');
    setUser(data.user);
    return data.user;
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, register, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
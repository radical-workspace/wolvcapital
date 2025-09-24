import { useState, useEffect } from 'react';
import { laravelApi } from '../lib/laravel-api';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    laravelApi.get('/me')
      .then(res => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await laravelApi.post('/login', { email, password });
    setUser(res.data.user);
    return res.data;
  };

  const register = async (data: { name: string, email: string, password: string, password_confirmation: string }) => {
    const res = await laravelApi.post('/register', data);
    setUser(res.data.user);
    return res.data;
  };

  const logout = async () => {
    await laravelApi.post('/logout');
    setUser(null);
  };

  return { user, loading, login, register, logout };
}
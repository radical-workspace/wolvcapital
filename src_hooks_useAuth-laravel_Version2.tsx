import { useState, useEffect } from 'react';
import { apiRequest } from './src/lib/api';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest('/me')
      .then((res: { data: any }) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await apiRequest('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' }
    });
    setUser(res.data.user);
    return res.data;
  };

  const register = async (data: { name: string, email: string, password: string, password_confirmation: string }) => {
    const res = await apiRequest('/register', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    });
    setUser(res.data.user);
    return res.data;
  };

  const logout = async () => {
    await apiRequest('/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    setUser(null);
  };

  return { user, loading, login, register, logout };
}
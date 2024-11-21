import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { UserInfo } from '@/types/api';

export function useAuth() {
  const navigate = useNavigate();

  const getToken = useCallback(() => {
    return localStorage.getItem('token');
  }, []);

  const getUserInfo = useCallback(() => {
    const userInfoStr = localStorage.getItem('userInfo');
    if (!userInfoStr) return null;
    
    try {
      return JSON.parse(userInfoStr) as UserInfo;
    } catch (error) {
      console.error('Failed to parse user info:', error);
      return null;
    }
  }, []);

  const setAuth = useCallback((token: string, userInfo: UserInfo) => {
    try {
      localStorage.setItem('token', token);
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    } catch (error) {
      console.error('Failed to set auth info:', error);
    }
  }, []);

  const clearAuth = useCallback(() => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      navigate('/login');
    } catch (error) {
      console.error('Failed to clear auth info:', error);
    }
  }, [navigate]);

  return {
    getToken,
    getUserInfo,
    setAuth,
    clearAuth,
  };
} 
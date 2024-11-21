import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { UserInfo } from '@/types/api';

/**
 * 认证相关的自定义 Hook
 * 提供用户认证状态管理的方法，包括获取/设置 token 和用户信息
 */
export function useAuth() {
  const navigate = useNavigate();

  /**
   * 获取存储在 localStorage 中的 token
   * @returns {string | null} 认证 token，如果不存在则返回 null
   */
  const getToken = useCallback(() => {
    return localStorage.getItem('token');
  }, []);

  /**
   * 获取存储在 localStorage 中的用户信息
   * @returns {UserInfo | null} 用户信息对象，解析失败则返回 null
   */
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

  /**
   * 设置用户认证信息
   * @param {string} token - 用户认证 token
   * @param {UserInfo} userInfo - 用户信息对象
   */
  const setAuth = useCallback((token: string, userInfo: UserInfo) => {
    try {
      localStorage.setItem('token', token);
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    } catch (error) {
      console.error('Failed to set auth info:', error);
    }
  }, []);

  /**
   * 清除用户认证信息并跳转到登录页
   */
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
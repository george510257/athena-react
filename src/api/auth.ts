import axios from 'axios';
import { CONFIG } from '@/config';

// 创建axios实例
const authApi = axios.create(CONFIG);

// 定义登录响应类型
export interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email?: string;
    phone?: string;
  };
}

// 定义登录参数类型
export interface LoginParams {
  username: string;
  password: string;
}

// API 接口定义
export const AuthApi = {
  // 用户名密码登录
  login: async (params: LoginParams) => {
    const response = await authApi.post<LoginResponse>('/auth/login', params);
    return response.data;
  },

  // 手机号验证码登录
  loginWithPhone: async (phone: string, code: string) => {
    const response = await authApi.post<LoginResponse>('/auth/login/phone', {
      phone,
      code,
    });
    return response.data;
  },

  // 发送手机验证码
  sendVerifyCode: async (phone: string) => {
    const response = await authApi.post<{ message: string }>('/auth/send-code', {
      phone,
    });
    return response.data;
  },

  // 飞书登录
  loginWithFeishu: async (code: string) => {
    const response = await authApi.post<LoginResponse>('/auth/feishu', { code });
    return response.data;
  },

  // 微信登录
  loginWithWechat: async (code: string) => {
    const response = await authApi.post<LoginResponse>('/auth/wechat', { code });
    return response.data;
  },

  // 获取飞书登录URL
  getFeishuLoginUrl: async () => {
    const response = await authApi.get<{ url: string }>('/auth/feishu/url');
    return response.data.url;
  },

  // 获取微信登录URL
  getWechatLoginUrl: async () => {
    const response = await authApi.get<{ url: string }>('/auth/wechat/url');
    return response.data.url;
  },

  // 登出
  logout: async () => {
    const response = await authApi.post('/auth/logout');
    return response.data;
  },

  // 获取当前用户信息
  getCurrentUser: async () => {
    const response = await authApi.get<LoginResponse['user']>('/auth/me');
    return response.data;
  },

  // Google登录
  loginWithGoogle: async (code: string) => {
    const response = await authApi.post<LoginResponse>('/auth/google', { code });
    return response.data;
  },

  // GitHub登录
  loginWithGithub: async (code: string) => {
    const response = await authApi.post<LoginResponse>('/auth/github', { code });
    return response.data;
  },

  // 获取Google登录URL
  getGoogleLoginUrl: async () => {
    const response = await authApi.get<{ url: string }>('/auth/google/url');
    return response.data.url;
  },

  // 获取GitHub登录URL
  getGithubLoginUrl: async () => {
    const response = await authApi.get<{ url: string }>('/auth/github/url');
    return response.data.url;
  },
};

// 请求拦截器
authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
); 
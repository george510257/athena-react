import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // 根据实际后端地址配置
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export interface LoginParams {
  username?: string;
  password?: string;
  phone?: string;
  verifyCode?: string;
  loginType: 'account' | 'phone';
}

export interface LoginResult {
  token: string;
  userInfo: {
    id: string;
    username: string;
    avatar?: string;
    // ... 其他用户信息字段
  };
}

export const login = async (params: LoginParams): Promise<LoginResult> => {
  const { data } = await api.post<LoginResult>('/auth/login', params);
  return data;
};

export const sendVerifyCode = async (phone: string): Promise<void> => {
  await api.post('/auth/verify-code', { phone });
};

// 处理请求和响应拦截
api.interceptors.request.use(
  (config) => {
    // 可以在这里添加 token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // 处理错误响应
      switch (error.response.status) {
        case 401:
          // 未授权，清除 token 并跳转到登录页
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          // 权限不足
          console.error('没有权限访问该资源');
          break;
        case 500:
          // 服务器错误
          console.error('服务器错误');
          break;
        default:
          console.error('请求失败:', error.response.data?.message || '未知错误');
      }
    }
    return Promise.reject(error);
  }
);

export default api; 
import { message } from 'antd';
import type { ApiResponse } from '@/types/api';

const BASE_URL = '/api';

interface RequestOptions extends RequestInit {
  data?: any;
}

export class RequestError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { data, headers = {}, ...rest } = options;
  const token = localStorage.getItem('token');

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };

  const config: RequestInit = {
    headers: defaultHeaders,
    ...rest,
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const result = await response.json() as ApiResponse<T>;

    if (!response.ok) {
      throw new RequestError(response.status, result.message || '请求失败');
    }

    if (result.code !== 200) {
      throw new Error(result.message || '操作失败');
    }

    return result.data;
  } catch (error) {
    if (error instanceof RequestError && error.status === 401) {
      // 处理未授权
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      window.location.href = '/login';
    }
    message.error((error as Error).message || '网络错误');
    throw error;
  }
} 
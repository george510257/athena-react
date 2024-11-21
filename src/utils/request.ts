import { message } from 'antd';
import type { ApiResponse } from '@/types/api';

const BASE_URL = '/api';

interface RequestOptions extends Omit<RequestInit, 'body'> {
  data?: Record<string, any>;
}

export async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { data, headers = {}, ...rest } = options;
  const token = localStorage.getItem('token');

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers,
    },
    ...rest,
    ...(data && { body: JSON.stringify(data) })
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const result = await response.json() as ApiResponse<T>;

    if (!response.ok || result.code !== 200) {
      throw new Error(result.message || '请求失败');
    }

    return result.data;
  } catch (error) {
    message.error((error as Error).message);
    throw error;
  }
} 
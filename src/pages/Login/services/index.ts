import { message } from 'antd';
import type { 
  AccountLoginParams, 
  PhoneLoginParams, 
  LoginResult,
  CaptchaResult 
} from '../types';

// 处理 API 请求错误
const handleApiError = (error: unknown): never => {
  const errorMessage = error instanceof Error ? error.message : '网络请求失败';
  message.error(errorMessage);
  throw error;
};

// 封装请求函数
const request = async <T>(url: string, options?: RequestInit): Promise<T> => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    return handleApiError(error);
  }
};

// 导出登录相关的 API 请求函数
export const loginApi = {

  // 账号登录
  async withAccount(params: AccountLoginParams): Promise<LoginResult> {
    return request('/api/rest/login', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  // 手机登录
  async withPhone(params: PhoneLoginParams): Promise<LoginResult> {
    return request('/api/rest/login', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  // 获取图片验证码
  getCaptchaUrl(uuid: string): string {
    return `/api/captcha/image?uuid=${uuid}`;
  },

  // 获取手机验证码
  async getPhoneCaptcha(mobile: string): Promise<CaptchaResult> {
    return request('/api/captcha/sms', {
      method: 'POST',
      body: JSON.stringify({ mobile }),
    });
  },
}; 
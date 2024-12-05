import { message } from 'antd';
import type { 
  AccountLoginParams, 
  PhoneLoginParams, 
  LoginResult,
  CaptchaResult 
} from '../types';

const handleApiError = (error: unknown): never => {
  const errorMessage = error instanceof Error ? error.message : '网络请求失败';
  message.error(errorMessage);
  throw error;
};

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

export const loginApi = {
  async withAccount(params: AccountLoginParams): Promise<LoginResult> {
    return request('/api/login/account', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  async withPhone(params: PhoneLoginParams): Promise<LoginResult> {
    return request('/api/login/phone', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  getCaptchaUrl(uuid: string): string {
    return `/api/captcha/image?uuid=${uuid}`;
  },

  async getPhoneCaptcha(mobile: string): Promise<CaptchaResult> {
    return request('/api/captcha/sms', {
      method: 'POST',
      body: JSON.stringify({ mobile }),
    });
  },
}; 
import { request } from '@/utils/request';
import type { LoginResponse } from '@/types/api';

export type LoginType = 'account' | 'phone';
export type SocialPlatform = 'wechat' | 'feishu' | 'google' | 'github';

export interface LoginFormData {
  loginType: LoginType;
  username?: string;
  password?: string;
  phone?: string;
  verifyCode?: string;
  captchaId?: string;
  captcha?: string;
}

export const authService = {
  async handleLogin(data: LoginFormData): Promise<LoginResponse> {
    return request<LoginResponse>('/auth/login', {
      method: 'POST',
      data
    });
  },

  async handleSocialLogin(platform: SocialPlatform): Promise<void> {
    return request<void>(`/auth/${platform}/login`, {
      method: 'GET'
    });
  },

  async sendVerifyCode(phone: string, captcha?: string, captchaId?: string): Promise<boolean> {
    return request<boolean>('/auth/verify-code', {
      method: 'POST',
      data: { phone, captcha, captchaId }
    });
  },

  async getCaptcha(): Promise<{ captchaId: string; captchaUrl: string }> {
    return request<{ captchaId: string; captchaUrl: string }>('/auth/captcha', {
      method: 'GET'
    });
  }
}; 
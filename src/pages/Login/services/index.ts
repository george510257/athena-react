import type { LoginParams, LoginResult } from '../types';

export async function loginWithAccount(params: LoginParams): Promise<LoginResult> {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      message: '网络请求失败',
    };
  }
}

export function getCaptchaUrl(uuid: string): string {
  return `http://localhost:8082/captcha/image?uuid=${uuid}`;
}

export async function getPhoneCaptcha(): Promise<string> {
  return '1234'; // 模拟获取手机验证码
} 
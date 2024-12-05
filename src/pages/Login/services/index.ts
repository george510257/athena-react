import type { AccountLoginParams, PhoneLoginParams, LoginResult } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8082';

export async function loginWithAccount(params: AccountLoginParams): Promise<LoginResult> {
  try {
    const response = await fetch(`${BASE_URL}/api/login/account`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    
    return await response.json();
  } catch (error) {
    return {
      success: false,
      message: '网络请求失败',
    };
  }
}

export async function loginWithPhone(params: PhoneLoginParams): Promise<LoginResult> {
  try {
    const response = await fetch(`${BASE_URL}/api/login/phone`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    
    return await response.json();
  } catch (error) {
    return {
      success: false,
      message: '网络请求失败',
    };
  }
}

export function getCaptchaUrl(uuid: string): string {
  return `${BASE_URL}/captcha/image?uuid=${uuid}`;
}

export async function getPhoneCaptcha(mobile: string): Promise<LoginResult> {
  try {
    const response = await fetch(`${BASE_URL}/api/sms/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mobile }),
    });
    
    return await response.json();
  } catch (error) {
    return {
      success: false,
      message: '获取验证码失败',
    };
  }
} 
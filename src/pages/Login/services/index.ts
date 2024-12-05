import type { AccountLoginParams, PhoneLoginParams, LoginResult } from '../types';

export async function loginWithAccount(params: AccountLoginParams): Promise<LoginResult> {
  try {
    const response = await fetch('/api/login/account', {
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
    const response = await fetch('/api/login/phone', {
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
  return `/api/captcha/image?uuid=${uuid}`;
}

export async function getPhoneCaptcha(mobile: string): Promise<LoginResult> {
  try {
    const response = await fetch('/api/captcha/sms', {
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
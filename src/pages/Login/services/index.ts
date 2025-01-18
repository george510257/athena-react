import { message } from 'antd';
import type { 
  AccountLoginParams, 
  PhoneLoginParams, 
  LoginResult,
  CaptchaResult 
} from '../types';

/**
 * 统一处理 API 请求错误
 * @param error - 捕获到的错误对象
 * @throws 将错误抛出以便上层处理
 */
const handleApiError = (error: unknown): never => {
  const errorMessage = error instanceof Error ? error.message : '网络请求失败';
  message.error(errorMessage);
  throw error;
};

/**
 * 封装通用请求方法
 * @param url - 请求地址
 * @param options - 请求配置选项
 * @returns Promise<T> 返回请求结果
 */
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

/**
 * 登录相关 API 接口封装
 */
export const loginApi = {

  /**
   * 账号密码登录
   * @param params - 登录参数，包含用户名和密码
   * @returns Promise<LoginResult> 登录结果
   */
  async withAccount(params: AccountLoginParams): Promise<LoginResult> {
    return request('/api/rest/login', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  /**
   * 手机验证码登录
   * @param params - 登录参数，包含手机号和验证码
   * @returns Promise<LoginResult> 登录结果
   */
  async withPhone(params: PhoneLoginParams): Promise<LoginResult> {
    return request('/api/rest/login', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  /**
   * 获取图片验证码 URL
   * @param uuid - 用户会话唯一标识
   * @returns string 验证码图片 URL
   */
  getCaptchaUrl(uuid: string): string {
    return `/api/captcha/image?uuid=${uuid}`;
  },

  /**
   * 发送手机验证码
   * @param mobile - 手机号码
   * @returns Promise<CaptchaResult> 发送结果
   */
  async getPhoneCaptcha(mobile: string): Promise<CaptchaResult> {
    return request('/api/captcha/sms', {
      method: 'POST',
      body: JSON.stringify({ mobile }),
    });
  },
};
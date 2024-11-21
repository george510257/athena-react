import { message } from 'antd';
import { AuthApi, type LoginResponse } from '@/api/auth';

export type LoginType = 'account' | 'phone';

export interface LoginFormData {
  username?: string;
  password?: string;
  phone?: string;
  verifyCode?: string;
  loginType: LoginType;
}

export type SocialPlatform = 'feishu' | 'wechat' | 'google' | 'github';

class AuthService {
  // 处理登录逻辑
  async handleLogin(formData: LoginFormData): Promise<LoginResponse | null> {
    try {
      let result: LoginResponse;

      if (formData.loginType === 'account') {
        if (!formData.username || !formData.password) {
          message.error('请输入用户名和密码');
          return null;
        }
        result = await AuthApi.login({
          username: formData.username,
          password: formData.password,
        });
      } else {
        if (!formData.phone || !formData.verifyCode) {
          message.error('请输入手机号和验证码');
          return null;
        }
        result = await AuthApi.loginWithPhone(formData.phone, formData.verifyCode);
      }

      if (result) {
        this.saveLoginInfo(result);
        message.success('登录成功');
      }
      
      return result;
    } catch (error: any) {
      message.error(error.response?.data?.message || '登录失败');
      return null;
    }
  }

  // 发送验证码
  async sendVerifyCode(phone: string): Promise<boolean> {
    try {
      await AuthApi.sendVerifyCode(phone);
      message.success('验证码已发送');
      return true;
    } catch (error: any) {
      message.error(error.response?.data?.message || '验证码发送失败');
      return false;
    }
  }

  // 处理社交登录
  async handleSocialLogin(platform: SocialPlatform): Promise<void> {
    try {
      let url: string;
      
      switch (platform) {
        case 'feishu':
          url = await AuthApi.getFeishuLoginUrl();
          break;
        case 'wechat':
          url = await AuthApi.getWechatLoginUrl();
          break;
        case 'google':
          url = await AuthApi.getGoogleLoginUrl();
          break;
        case 'github':
          url = await AuthApi.getGithubLoginUrl();
          break;
      }
      
      if (url) {
        window.location.href = url;
      }
    } catch (error: any) {
      message.error('获取登录链接失败');
    }
  }

  // 保存登录信息
  private saveLoginInfo(loginInfo: LoginResponse) {
    localStorage.setItem('token', loginInfo.token);
    localStorage.setItem('userInfo', JSON.stringify(loginInfo.user));
  }

  // 获取用户信息
  getUserInfo() {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  }

  // 检查是否已登录
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // 登出
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
  }

  // 获取 token
  getToken(): string | null {
    return localStorage.getItem('token');
  }
}

export const authService = new AuthService(); 
// 登录方式枚举
export enum LoginTypeEnum {
  ACCOUNT = 'account',
  PHONE = 'phone'
}

// 登录状态
export interface LoginState {
  loginType: LoginTypeEnum;
  loading: boolean;
  captchaUuid: string;
  imageCaptchaUrl: string;
}

// 账号密码登录参数
export interface AccountLoginParams {
  username: string;
  password: string;
  imageCaptcha: string;
  uuid: string;
  rememberMe?: boolean;
}

// 手机登录参数
export interface PhoneLoginParams {
  mobile: string;
  smsCaptcha: string;
}

// 登录响应
export interface LoginResult {
  success: boolean;
  message?: string;
  token?: string;
} 
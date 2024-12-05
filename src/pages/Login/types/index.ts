// 枚举类型
export enum LoginTypeEnum {
  ACCOUNT = 'account',
  PHONE = 'phone'
}

// 状态类型
export interface LoginState {
  loginType: LoginTypeEnum;
  loading: boolean;
  captchaUuid: string;
  imageCaptchaUrl: string;
}

// 请求参数类型
export interface BaseLoginParams {
  rememberMe?: boolean;
}

export interface AccountLoginParams extends BaseLoginParams {
  username: string;
  password: string;
  imageCaptcha: string;
  uuid: string;
}

export interface PhoneLoginParams extends BaseLoginParams {
  mobile: string;
  smsCaptcha: string;
}

// API 响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface LoginResponse {
  token: string;
  // 其他登录返回的数据...
}

export type LoginResult = ApiResponse<LoginResponse>;
export type CaptchaResult = ApiResponse<void>; 
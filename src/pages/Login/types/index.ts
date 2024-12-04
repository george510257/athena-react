export type LoginType = 'account' | 'phone';

export interface LoginState {
  loginType: LoginType;
  loading: boolean;
  captchaUuid: string;
  imageCaptchaUrl: string;
}

export interface LoginParams {
  username: string;
  password: string;
  imageCaptcha: string;
  uuid: string;
}

export interface LoginResult {
  success: boolean;
  message?: string;
  token?: string;
} 
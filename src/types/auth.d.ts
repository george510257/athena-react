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
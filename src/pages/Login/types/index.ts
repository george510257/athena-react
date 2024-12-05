// 枚举类型，用于定义登录类型
export enum LoginTypeEnum {
  ACCOUNT = 'account', // 账号登录
  PHONE = 'phone' // 手机登录
}

// 状态类型，用于定义登录状态
export interface LoginState {
  loginType: LoginTypeEnum; // 登录类型
  loading: boolean; // 加载状态
  captchaUuid: string; // 验证码UUID
  imageCaptchaUrl: string; // 图片验证码URL
}

// 请求参数类型的基础接口
export interface BaseLoginParams {
  rememberMe?: boolean; // 是否记住登录状态
}

// 账号登录请求参数接口，继承自BaseLoginParams
export interface AccountLoginParams extends BaseLoginParams {
  username: string; // 用户名
  password: string; // 密码
  imageCaptcha: string; // 图片验证码
  uuid: string; // 验证码UUID
}

// 手机登录请求参数接口，继承自BaseLoginParams
export interface PhoneLoginParams extends BaseLoginParams {
  mobile: string; // 手机号
  smsCaptcha: string; // 短信验证码
}

// API 响应类型接口，泛型T表示响应数据的类型
export interface ApiResponse<T = any> {
  success: boolean; // 请求是否成功
  message?: string; // 消息
  data?: T;  // 数据
}

// 登录响应数据接口，继承自ApiResponse
export interface LoginResponse {
  token: string;
  // 其他登录返回的数据...
}

// 登录结果类型，继承自ApiResponse
export type LoginResult = ApiResponse<LoginResponse>;
// 验证码结果类型，继承自ApiResponse
export type CaptchaResult = ApiResponse<void>;
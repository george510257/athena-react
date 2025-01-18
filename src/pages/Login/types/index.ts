/**
 * @file 登录模块类型定义
 * @description 包含登录相关的枚举、接口和类型定义
 */

/** 登录方式枚举 */
export enum LoginTypeEnum {
  /** 账号密码登录 */
  ACCOUNT = 'account',
  /** 手机验证码登录 */
  PHONE = 'phone'
}

/** 登录页面状态接口 */
export interface LoginState {
  /** 当前选择的登录方式 */
  loginType: LoginTypeEnum;
  /** 登录请求loading状态 */
  loading: boolean;
  /** 图形验证码标识符 */
  captchaUuid: string;
  /** 图形验证码图片地址 */
  imageCaptchaUrl: string;
}

/** 登录参数基础接口 */
export interface BaseLoginParams {
  /** 是否记住登录状态，用于持久化登录信息 */
  rememberMe?: boolean;
}

/** 账号密码登录参数接口 */
export interface AccountLoginParams extends BaseLoginParams {
  /** 登录用户名 */
  username: string;
  /** 登录密码 */
  password: string;
  /** 图形验证码答案 */
  imageCaptcha: string;
  /** 图形验证码标识符 */
  uuid: string;
}

/** 手机验证码登录参数接口 */
export interface PhoneLoginParams extends BaseLoginParams {
  /** 手机号码 */
  mobile: string;
  /** 短信验证码 */
  smsCaptcha: string;
}

/**
 * API响应数据通用接口
 * @template T 响应数据类型
 */
export interface ApiResponse<T = any> {
  /** 请求是否成功 */
  success: boolean;
  /** 响应消息 */
  message?: string;
  /** 响应数据 */
  data?: T;
}

/** 登录成功返回数据接口 */
export interface LoginResponse {
  /** JWT访问令牌 */
  token: string;
}

/** 登录API响应类型 */
export type LoginResult = ApiResponse<LoginResponse>;

/** 验证码API响应类型 */
export type CaptchaResult = ApiResponse<void>;
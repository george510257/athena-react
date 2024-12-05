import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { App } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import type { 
  LoginState, 
  AccountLoginParams, 
  PhoneLoginParams,
  LoginResult,
  BaseLoginParams 
} from '../types';
import { LoginTypeEnum } from '../types';
import { loginApi } from '../services';

/**
 * 登录页面的核心逻辑 Hook
 * 处理登录相关的状态管理和业务逻辑
 */
export default function useLogin() {
  // ================ Hooks 声明 ================
  /**
   * 登录状态管理
   * - loginType: 当前登录方式（账号密码/手机号）
   * - loading: 登录加载状态
   * - captchaUuid: 验证码唯一标识
   * - imageCaptchaUrl: 图形验证码URL
   */
  const [loginState, setLoginState] = useState<LoginState>({
    loginType: LoginTypeEnum.ACCOUNT,
    loading: false,
    captchaUuid: uuidv4(),
    imageCaptchaUrl: '',
  });

  const navigate = useNavigate();
  const { message: antMessage } = App.useApp();

  // ================ 状态更新函数 ================
  /**
   * 更新登录状态
   * @param updates 需要更新的状态字段
   */
  const updateLoginState = useCallback((updates: Partial<LoginState>) => {
    setLoginState(prev => ({ ...prev, ...updates }));
  }, []);

  /**
   * 刷新图形验证码
   * 生成新的UUID并更新验证码图片
   */
  const refreshCaptcha = useCallback(() => {
    const newUuid = uuidv4();
    updateLoginState({
      captchaUuid: newUuid,
      imageCaptchaUrl: loginApi.getCaptchaUrl(newUuid),
    });
  }, [updateLoginState]);

  // ================ 事件处理函数 ================
  /**
   * 切换登录方式
   * @param type 登录类型（账号密码/手机号）
   */
  const handleLoginTypeChange = useCallback((type: LoginTypeEnum) => {
    updateLoginState({ loginType: type });
  }, [updateLoginState]);

  /**
   * 处理第三方登录点击
   * @param loginType 第三方登录类型
   */
  const handleThirdPartyLogin = useCallback((loginType: string) => {
    antMessage.info(`${loginType}开发中`);
  }, [antMessage]);

  /**
   * 处理登录成功逻辑
   * @param values 登录表单值
   */
  const handleLoginSuccess = useCallback((values: BaseLoginParams) => {
    antMessage.success('登录成功');
    if ('username' in values && values.rememberMe) {
      localStorage.setItem('username', (values as AccountLoginParams).username);
    }
    navigate('/');
  }, [navigate, antMessage]);

  /**
   * 处理登录失败逻辑
   * @param error 登录错误信息
   */
  const handleLoginError = useCallback((error: LoginResult) => {
    antMessage.error(error.message || '登录失败');
    if (loginState.loginType === LoginTypeEnum.ACCOUNT) {
      refreshCaptcha();
    }
  }, [loginState.loginType, antMessage, refreshCaptcha]);

  /**
   * 获取手机验证码
   * @param mobile 手机号
   */
  const handleGetPhoneCaptcha = useCallback(async (mobile: string) => {
    try {
      const result = await loginApi.getPhoneCaptcha(mobile);
      if (result.success) {
        antMessage.success('验证码已发送');
      } else {
        antMessage.error(result.message || '获取验证码失败');
      }
    } catch (error) {
      antMessage.error('获取验证码失败');
    }
  }, [antMessage]);

  /**
   * 处理登录表单提交
   * @param values 登录表单值
   */
  const handleSubmit = useCallback(async (values: AccountLoginParams | PhoneLoginParams) => {
    updateLoginState({ loading: true });
    try {
      const loginResult = loginState.loginType === LoginTypeEnum.ACCOUNT
        ? await loginApi.withAccount({
            ...(values as AccountLoginParams),
            uuid: loginState.captchaUuid,
          })
        : await loginApi.withPhone(values as PhoneLoginParams);

      if (loginResult.success) {
        handleLoginSuccess(values);
      } else {
        handleLoginError(loginResult);
      }
    } catch (error) {
      antMessage.error('登录请求失败，请稍后重试');
    } finally {
      updateLoginState({ loading: false });
    }
  }, [
    loginState.loginType,
    loginState.captchaUuid,
    updateLoginState,
    handleLoginSuccess,
    handleLoginError,
    antMessage
  ]);

  // ================ Effects ================
  /**
   * 初始化时刷新验证码
   */
  useEffect(() => {
    refreshCaptcha();
  }, [refreshCaptcha]);

  // ================ 返回值 ================
  return {
    loginState,
    handleLoginTypeChange,
    handleSubmit,
    refreshCaptcha,
    handleThirdPartyLogin,
    handleGetPhoneCaptcha,
  };
} 
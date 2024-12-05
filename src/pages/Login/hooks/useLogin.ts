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

export default function useLogin() {
  // 所有的 hooks 声明放在最前面
  const [loginState, setLoginState] = useState<LoginState>({
    loginType: LoginTypeEnum.ACCOUNT,
    loading: false,
    captchaUuid: uuidv4(),
    imageCaptchaUrl: '',
  });
  const navigate = useNavigate();
  const { message: antMessage } = App.useApp();

  // 所有的 useCallback 声明
  const updateLoginState = useCallback((updates: Partial<LoginState>) => {
    setLoginState(prev => ({ ...prev, ...updates }));
  }, []);

  const refreshCaptcha = useCallback(() => {
    const newUuid = uuidv4();
    updateLoginState({
      captchaUuid: newUuid,
      imageCaptchaUrl: loginApi.getCaptchaUrl(newUuid),
    });
  }, [updateLoginState]);

  const handleLoginTypeChange = useCallback((type: LoginTypeEnum) => {
    updateLoginState({ loginType: type });
  }, [updateLoginState]);

  const handleThirdPartyLogin = useCallback((loginType: string) => {
    antMessage.info(`${loginType}开发中`);
  }, [antMessage]);

  const handleLoginSuccess = useCallback((values: BaseLoginParams) => {
    antMessage.success('登录成功');
    if ('username' in values && values.rememberMe) {
      localStorage.setItem('username', (values as AccountLoginParams).username);
    }
    navigate('/');
  }, [navigate, antMessage]);

  const handleLoginError = useCallback((error: LoginResult) => {
    antMessage.error(error.message || '登录失败');
    if (loginState.loginType === LoginTypeEnum.ACCOUNT) {
      refreshCaptcha();
    }
  }, [loginState.loginType, antMessage, refreshCaptcha]);

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

  // useEffect 放在所有 useCallback 之后
  useEffect(() => {
    refreshCaptcha();
  }, [refreshCaptcha]);

  return {
    loginState,
    handleLoginTypeChange,
    handleSubmit,
    refreshCaptcha,
    handleThirdPartyLogin,
    handleGetPhoneCaptcha,
  };
} 
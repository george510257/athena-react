import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { App } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import type { LoginState, AccountLoginParams, PhoneLoginParams } from '../types';
import { LoginTypeEnum } from '../types';
import { 
  loginWithAccount, 
  loginWithPhone,
  getCaptchaUrl, 
  getPhoneCaptcha 
} from '../services';

export default function useLogin() {
  const [loginState, setLoginState] = useState<LoginState>({
    loginType: LoginTypeEnum.ACCOUNT,
    loading: false,
    captchaUuid: uuidv4(),
    imageCaptchaUrl: '',
  });

  const navigate = useNavigate();
  const { message: antMessage } = App.useApp();

  const refreshCaptcha = useCallback(() => {
    const newUuid = uuidv4();
    const url = getCaptchaUrl(newUuid);
    setLoginState(prev => ({
      ...prev,
      captchaUuid: newUuid,
      imageCaptchaUrl: url,
    }));
  }, []);

  useEffect(() => {
    refreshCaptcha();
  }, [refreshCaptcha]);

  const handleLoginTypeChange = (type: LoginTypeEnum) => {
    setLoginState(prev => ({ ...prev, loginType: type }));
  };

  const handleAccountLogin = async (values: AccountLoginParams) => {
    const loginResult = await loginWithAccount({
      ...values,
      uuid: loginState.captchaUuid
    });
    
    if (loginResult.success) {
      antMessage.success('登录成功');
      if (values.rememberMe) {
        localStorage.setItem('username', values.username);
      }
      navigate('/');
    } else {
      antMessage.error(loginResult.message || '登录失败');
      refreshCaptcha();
    }
  };

  const handlePhoneLogin = async (values: PhoneLoginParams) => {
    const loginResult = await loginWithPhone(values);
    if (loginResult.success) {
      antMessage.success('登录成功');
      navigate('/');
    } else {
      antMessage.error(loginResult.message || '登录失败');
    }
  };

  const handleSubmit = async (values: Record<string, any>) => {
    setLoginState(prev => ({ ...prev, loading: true }));
    try {
      if (loginState.loginType === LoginTypeEnum.ACCOUNT) {
        await handleAccountLogin(values as AccountLoginParams);
      } else {
        await handlePhoneLogin(values as PhoneLoginParams);
      }
    } finally {
      setLoginState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleThirdPartyLogin = (loginType: string) => {
    antMessage.info(`${loginType}开发中`);
  };

  const handleForgotPassword = () => {
    antMessage.info('忘记密码功能开发中');
  };

  const handleGetPhoneCaptcha = async (mobile: string) => {
    const result = await getPhoneCaptcha(mobile);
    if (result.success) {
      antMessage.success('验证码已发送');
    } else {
      antMessage.error(result.message || '获取验证码失败');
    }
  };

  return {
    loginState,
    handleLoginTypeChange,
    handleSubmit,
    refreshCaptcha,
    handleThirdPartyLogin,
    handleForgotPassword,
    handleGetPhoneCaptcha: async (mobile: string) => {
      await handleGetPhoneCaptcha(mobile);
    },
  };
} 
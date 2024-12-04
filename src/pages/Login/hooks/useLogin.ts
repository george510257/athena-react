import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { App } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import type { LoginType, LoginState } from '../types';
import { loginWithAccount, getCaptchaUrl, getPhoneCaptcha } from '../services';

export default function useLogin() {
  const [loginState, setLoginState] = useState<LoginState>({
    loginType: 'account',
    loading: false,
    captchaUuid: uuidv4(),
    imageCaptchaUrl: '',
  });

  const navigate = useNavigate();
  const { message: antMessage } = App.useApp();

  useEffect(() => {
    refreshCaptcha();
  }, []);

  const refreshCaptcha = () => {
    const newUuid = uuidv4();
    const url = getCaptchaUrl(newUuid);
    setLoginState(prev => ({
      ...prev,
      captchaUuid: newUuid,
      imageCaptchaUrl: url,
    }));
  };

  const handleLoginTypeChange = (type: LoginType) => {
    setLoginState(prev => ({ ...prev, loginType: type }));
  };

  const handleSubmit = async (values: Record<string, any>) => {
    setLoginState(prev => ({ ...prev, loading: true }));
    try {
      if (loginState.loginType === 'account') {
        const { username, password, imageCaptchaValue } = values;
        const loginResult = await loginWithAccount({
          username,
          password,
          imageCaptcha: imageCaptchaValue,
          uuid: loginState.captchaUuid
        });
        
        if (loginResult.success) {
          antMessage.success('登录成功');
          if (values.rememberMe) {
            localStorage.setItem('username', username);
          }
          navigate('/');
        } else {
          antMessage.error(loginResult.message || '登录失败');
          refreshCaptcha();
        }
      } else {
        const { captcha } = values;
        if (captcha === '1234') {
          antMessage.success('登录成功');
          navigate('/');
        } else {
          antMessage.error('验证码错误');
        }
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

  const handleGetPhoneCaptcha = async () => {
    const captcha = await getPhoneCaptcha();
    antMessage.success(`验证码为: ${captcha}`);
  };

  return {
    loginState,
    handleLoginTypeChange,
    handleSubmit,
    refreshCaptcha,
    handleThirdPartyLogin,
    handleForgotPassword,
    handleGetPhoneCaptcha,
  };
} 
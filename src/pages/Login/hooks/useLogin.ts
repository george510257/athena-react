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
    setLoginState(prev => ({
      ...prev,
      captchaUuid: newUuid,
      imageCaptchaUrl: getCaptchaUrl(newUuid),
    }));
  }, []);

  useEffect(() => {
    refreshCaptcha();
  }, [refreshCaptcha]);

  const handleLoginTypeChange = (type: LoginTypeEnum) => {
    setLoginState(prev => ({ ...prev, loginType: type }));
  };

  const handleSubmit = async (values: AccountLoginParams | PhoneLoginParams) => {
    setLoginState(prev => ({ ...prev, loading: true }));
    try {
      const loginResult = loginState.loginType === LoginTypeEnum.ACCOUNT
        ? await loginWithAccount({
            ...(values as AccountLoginParams),
            uuid: loginState.captchaUuid,
          })
        : await loginWithPhone(values as PhoneLoginParams);

      if (loginResult.success) {
        antMessage.success('登录成功');
        if ('rememberMe' in values && values.rememberMe) {
          localStorage.setItem('username', (values as AccountLoginParams).username);
        }
        navigate('/');
      } else {
        antMessage.error(loginResult.message || '登录失败');
        if (loginState.loginType === LoginTypeEnum.ACCOUNT) {
          refreshCaptcha();
        }
      }
    } finally {
      setLoginState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleThirdPartyLogin = (loginType: string) => {
    antMessage.info(`${loginType}开发中`);
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
    handleGetPhoneCaptcha,
  };
} 
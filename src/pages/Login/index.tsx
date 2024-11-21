import { useState, useCallback } from 'react';
import { message } from 'antd';
import styles from './login.module.css';
import { authService, type LoginFormData, type SocialPlatform } from '@/services/auth';
import wechatIcon from '@/assets/icons/wechat.svg';
import feishuIcon from '@/assets/icons/feishu.svg';
import googleIcon from '@/assets/icons/google.svg';
import githubIcon from '@/assets/icons/github.svg';

const Login = () => {
  const [loginType, setLoginType] = useState<'account' | 'phone'>('account');
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: '',
    phone: '',
    verifyCode: '',
    loginType: 'account',
  });
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const data: LoginFormData = {
        loginType,
        username: formData.username,
        password: formData.password,
        phone: formData.phone,
        verifyCode: formData.verifyCode
      };

      const result = await authService.handleLogin(data);
      if (result) {
        // 登录成功后的跳转
        window.location.href = '/dashboard';
      }
    } catch (error) {
      console.error('登录失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSocialLogin = async (platform: SocialPlatform) => {
    await authService.handleSocialLogin(platform);
  };

  const handleSendCode = useCallback(async () => {
    if (countdown > 0) return;
    
    try {
      // 简单的手机号验证
      if (!formData.phone || !/^1[3-9]\d{9}$/.test(formData.phone)) {
        return message.error('请输入正确的手机号');
      }
      
      await authService.sendVerifyCode(formData.phone);
      message.success('验证码已发送');
      
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: any) {
      message.error(error.response?.data?.message || '验证码发送失败，请重试');
    }
  }, [formData.phone, countdown]);

  return (
    <div className={styles.container}>
      <div className={styles.leftSection}>
        <div className={styles.leftContent}>
          <h1>欢迎使用</h1>
          <p>这里是系统介绍文案</p>
        </div>
      </div>
      <div className={styles.rightSection}>
        <div className={styles.loginBox}>
          <div className={styles.loginHeader}>
            <h2>账号登录</h2>
            <p>欢迎回来，请输入您的账号密码</p>
          </div>
          <div className={styles.loginTabs}>
            <div 
              className={`${styles.loginTab} ${loginType === 'account' ? styles.active : ''}`}
              onClick={() => setLoginType('account')}
            >
              账号密码登录
            </div>
            <div 
              className={`${styles.loginTab} ${loginType === 'phone' ? styles.active : ''}`}
              onClick={() => setLoginType('phone')}
            >
              手机号登录
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            {loginType === 'account' ? (
              <>
                <div className={styles.formGroup}>
                  <label htmlFor="username">用户名</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="请输入用户名"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="password">密码</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="请输入密码"
                  />
                </div>
                <div className={styles.rememberForgot}>
                  <label className={styles.remember}>
                    <input type="checkbox" /> 记住密码
                  </label>
                  <a href="#" className={styles.forgot}>忘记密码？</a>
                </div>
              </>
            ) : (
              <>
                <div className={styles.formGroup}>
                  <label htmlFor="phone">手机号</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="请输入手机号"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="verifyCode">验证码</label>
                  <div className={styles.verifyCodeGroup}>
                    <input
                      type="text"
                      id="verifyCode"
                      name="verifyCode"
                      value={formData.verifyCode}
                      onChange={handleChange}
                      placeholder="请输入验证码"
                    />
                    <button
                      type="button"
                      className={styles.verifyCodeBtn}
                      onClick={handleSendCode}
                      disabled={countdown > 0}
                    >
                      {countdown > 0 ? `${countdown}秒后重试` : '获取验证码'}
                    </button>
                  </div>
                </div>
              </>
            )}
            <button type="submit" className={styles.loginBtn} disabled={loading}>
              {loading ? '登录中...' : '登录'}
            </button>
            <div className={styles.registerLink}>
              还没有账号？<a href="#">立即注册</a>
            </div>
            <div className={styles.divider}>
              <span>其他登录方式</span>
            </div>
            <div className={styles.socialLogin}>
              <div 
                className={styles.socialButton} 
                onClick={() => handleSocialLogin('wechat')}
              >
                <img src={wechatIcon} alt="WeChat" />
              </div>
              <div 
                className={styles.socialButton} 
                onClick={() => handleSocialLogin('feishu')}
              >
                <img src={feishuIcon} alt="Feishu" />
              </div>
              <div 
                className={styles.socialButton} 
                onClick={() => handleSocialLogin('google')}
              >
                <img src={googleIcon} alt="Google" />
              </div>
              <div 
                className={styles.socialButton} 
                onClick={() => handleSocialLogin('github')}
              >
                <img src={githubIcon} alt="GitHub" />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login; 
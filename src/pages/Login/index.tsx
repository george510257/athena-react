import { useState, useCallback } from 'react';
import { message } from 'antd';
import styles from './login.module.css';
import wechatIcon from '../../assets/icons/wechat.svg';
import feishuIcon from '../../assets/icons/feishu.svg';
import { login, sendVerifyCode, LoginParams } from '../../api/auth';

interface LoginForm {
  username: string;
  password: string;
  phone: string;
  verifyCode: string;
}

const Login = () => {
  const [loginType, setLoginType] = useState<'account' | 'phone'>('account');
  const [formData, setFormData] = useState<LoginForm>({
    username: '',
    password: '',
    phone: '',
    verifyCode: '',
  });
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const params: LoginParams = {
        loginType,
        ...(loginType === 'account' 
          ? { 
              username: formData.username, 
              password: formData.password 
            }
          : { 
              phone: formData.phone, 
              verifyCode: formData.verifyCode 
            }
        )
      };

      const result = await login(params);
      
      // 保存 token
      localStorage.setItem('token', result.token);
      
      // 保存用户信息
      localStorage.setItem('userInfo', JSON.stringify(result.userInfo));
      
      message.success('登录成功');
      
      // 跳转到首页或其他页面
      window.location.href = '/';
      
    } catch (error: any) {
      message.error(error.response?.data?.message || '登录失败，请重试');
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

  const handleSocialLogin = (platform: string) => {
    // 根据不同平台跳转到对应的第三方登录页面
    const platformUrls = {
      wechat: '/api/auth/wechat',
      feishu: '/api/auth/feishu'
    };
    
    window.location.href = platformUrls[platform as keyof typeof platformUrls];
  };

  const handleSendCode = useCallback(async () => {
    if (countdown > 0) return;
    
    try {
      // 简单的手机号验证
      if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
        return message.error('请输入正确的手机号');
      }
      
      await sendVerifyCode(formData.phone);
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
                <img src={wechatIcon} alt="微信登录" />
              </div>
              <div 
                className={styles.socialButton}
                onClick={() => handleSocialLogin('feishu')}
              >
                <img src={feishuIcon} alt="飞书登录" />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login; 
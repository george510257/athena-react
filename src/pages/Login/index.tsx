import { useState, useCallback } from 'react';
import { Form, Input, Button, Checkbox, Tabs, message } from 'antd';
import { UserOutlined, LockOutlined, MobileOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import styles from './login.module.css';
import { authService, type LoginFormData, type SocialPlatform } from '@/services/auth';
import wechatIcon from '@/assets/icons/wechat.svg';
import feishuIcon from '@/assets/icons/feishu.svg';
import googleIcon from '@/assets/icons/google.svg';
import githubIcon from '@/assets/icons/github.svg';

const { TabPane } = Tabs;

const Login = () => {
  const [form] = Form.useForm();
  const [loginType, setLoginType] = useState<'account' | 'phone'>('account');
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [captchaInfo, setCaptchaInfo] = useState<{ id: string; url: string } | null>(null);

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const data: LoginFormData = {
        loginType,
        ...values,
        captchaId: captchaInfo?.id
      };

      const result = await authService.handleLogin(data);
      if (result) {
        window.location.href = '/dashboard';
      } else {
        refreshCaptcha();
      }
    } catch (error) {
      console.error('登录失败:', error);
      refreshCaptcha();
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (platform: SocialPlatform) => {
    await authService.handleSocialLogin(platform);
  };

  const handleSendCode = useCallback(async () => {
    if (countdown > 0) return;
    
    try {
      const phone = form.getFieldValue('phone');
      if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
        return message.error('请输入正确的手机号');
      }
      
      const success = await authService.sendVerifyCode(
        phone,
        form.getFieldValue('captcha'),
        captchaInfo?.id
      );
      
      if (success) {
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
      } else {
        refreshCaptcha();
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || '验证码发送失败，请重试');
      refreshCaptcha();
    }
  }, [form, captchaInfo, countdown]);

  const refreshCaptcha = async () => {
    const result = await authService.getCaptcha();
    if (result) {
      setCaptchaInfo({
        id: result.captchaId,
        url: result.captchaUrl
      });
    }
  };

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
          <Tabs 
            activeKey={loginType} 
            onChange={(key) => setLoginType(key as 'account' | 'phone')}
            centered
          >
            <TabPane tab="账号密码登录" key="account">
              <Form form={form} onFinish={handleSubmit}>
                <Form.Item
                  name="username"
                  rules={[{ required: true, message: '请输入用户名' }]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="请输入用户名"
                    size="large"
                  />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[{ required: true, message: '请输入密码' }]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="请输入密码"
                    size="large"
                  />
                </Form.Item>
                {captchaInfo && (
                  <Form.Item
                    name="captcha"
                    rules={[{ required: true, message: '请输入验证码' }]}
                  >
                    <div className={styles.captchaGroup}>
                      <Input
                        prefix={<SafetyCertificateOutlined />}
                        placeholder="请输入验证码"
                        size="large"
                      />
                      <img
                        src={captchaInfo.url}
                        alt="验证码"
                        onClick={refreshCaptcha}
                        className={styles.captchaImage}
                      />
                    </div>
                  </Form.Item>
                )}
                <Form.Item>
                  <div className={styles.rememberForgot}>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                      <Checkbox>记住密码</Checkbox>
                    </Form.Item>
                    <a className={styles.forgot} href="#">忘记密码？</a>
                  </div>
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    block
                    loading={loading}
                  >
                    登录
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>
            <TabPane tab="手机号登录" key="phone">
              <Form form={form} onFinish={handleSubmit}>
                <Form.Item
                  name="phone"
                  rules={[
                    { required: true, message: '请输入手机号' },
                    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
                  ]}
                >
                  <Input
                    prefix={<MobileOutlined />}
                    placeholder="请输入手机号"
                    size="large"
                  />
                </Form.Item>
                <Form.Item
                  name="verifyCode"
                  rules={[{ required: true, message: '请输入验证码' }]}
                >
                  <div className={styles.verifyCodeGroup}>
                    <Input
                      prefix={<SafetyCertificateOutlined />}
                      placeholder="请输入验证码"
                      size="large"
                    />
                    <Button
                      type="primary"
                      onClick={handleSendCode}
                      disabled={countdown > 0}
                      size="large"
                    >
                      {countdown > 0 ? `${countdown}秒后重试` : '获取验证码'}
                    </Button>
                  </div>
                </Form.Item>
                {captchaInfo && (
                  <Form.Item
                    name="captcha"
                    rules={[{ required: true, message: '请输入验证码' }]}
                  >
                    <div className={styles.captchaGroup}>
                      <Input
                        prefix={<SafetyCertificateOutlined />}
                        placeholder="请输入验证码"
                        size="large"
                      />
                      <img
                        src={captchaInfo.url}
                        alt="验证码"
                        onClick={refreshCaptcha}
                        className={styles.captchaImage}
                      />
                    </div>
                  </Form.Item>
                )}
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    block
                    loading={loading}
                  >
                    登录
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>
          </Tabs>
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
        </div>
      </div>
    </div>
  );
};

export default Login; 
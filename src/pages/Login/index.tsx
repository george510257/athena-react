import React from 'react';
import {
  LockOutlined,
  MobileOutlined,
  UserOutlined,
  GithubOutlined,
  WechatOutlined,
  GoogleOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
  ProCard,
} from '@ant-design/pro-components';
import { Tabs, Space, Divider } from 'antd';
import styles from './index.module.less';
import logo from '@/assets/logo.svg';
import useLogin from './hooks/useLogin';
import { LoginTypeEnum } from './types';

const thirdPartyLogins = [
  { Icon: GoogleOutlined, text: 'Google登录' },
  { Icon: GithubOutlined, text: 'Github登录' },
  { Icon: WechatOutlined, text: '微信登录' },
];

const Login: React.FC = () => {
  const {
    loginState,
    handleLoginTypeChange,
    handleSubmit,
    refreshCaptcha,
    handleThirdPartyLogin,
    handleForgotPassword,
    handleGetPhoneCaptcha,
  } = useLogin();

  const { loginType, loading, imageCaptchaUrl } = loginState;

  return (
    <div className={styles.container}>
      <ProCard className={styles.loginCard}>
        <LoginForm
          logo={logo}
          title="Athena React"
          subTitle="企业级中后台解决方案"
          loading={loading}
          actions={
            <div className={styles.otherLogin}>
              <Divider plain>
                <span className={styles.dividerText}>其他登录方式</span>
              </Divider>
              <Space align="center" size={24}>
                {thirdPartyLogins.map(({ Icon, text }) => (
                  <Icon
                    key={text}
                    className={styles.icon}
                    onClick={() => handleThirdPartyLogin(text)}
                  />
                ))}
              </Space>
            </div>
          }
          onFinish={handleSubmit}
        >
          <Tabs
            centered
            activeKey={loginType}
            onChange={(activeKey) => handleLoginTypeChange(
              activeKey === 'account' ? LoginTypeEnum.ACCOUNT : LoginTypeEnum.PHONE
            )}
            items={[
              {
                key: LoginTypeEnum.ACCOUNT,
                label: '账号密码登录',
              },
              {
                key: LoginTypeEnum.PHONE,
                label: '手机号登录',
              },
            ]}
          />
          {loginType === 'account' && (
            <>
              <ProFormText
                name="username"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                initialValue={localStorage.getItem('username') || ''}
                placeholder="用户名: admin"
                rules={[
                  {
                    required: true,
                    message: '请输入用户名',
                  },
                  {
                    min: 3,
                    message: '用户名至少3个字符',
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder="密码: admin"
                rules={[
                  {
                    required: true,
                    message: '请输入密码',
                  },
                  {
                    min: 5,
                    message: '密码至少5个字符',
                  },
                ]}
              />
              <ProFormText
                name="imageCaptchaValue"
                fieldProps={{
                  size: 'large',
                  suffix: (
                    <Space>
                      <img 
                        src={imageCaptchaUrl} 
                        alt="验证码"
                        style={{ height: '32px', cursor: 'pointer' }}
                        onClick={refreshCaptcha}
                      />
                      <ReloadOutlined onClick={refreshCaptcha} />
                    </Space>
                  ),
                }}
                placeholder="请输入图片验证码"
                rules={[
                  {
                    required: true,
                    message: '请输入验证码',
                  },
                  {
                    len: 4,
                    message: '验证码长度应为4位',
                  },
                ]}
              />
            </>
          )}
          {loginType === 'phone' && (
            <>
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: <MobileOutlined className={styles.prefixIcon} />,
                }}
                name="mobile"
                placeholder="手机号"
                rules={[
                  {
                    required: true,
                    message: '请输入手机号',
                  },
                  {
                    pattern: /^1[3-9]\d{9}$/,
                    message: '手机号格式不正确',
                  },
                ]}
              />
              <ProFormCaptcha
                fieldProps={{
                  size: 'large',
                }}
                captchaProps={{
                  size: 'large',
                }}
                placeholder="验证码"
                captchaTextRender={(timing, count) => {
                  if (timing) {
                    return `${count} 秒后重新获取`;
                  }
                  return '获取验证码';
                }}
                name="smsCaptcha"
                rules={[
                  {
                    required: true,
                    message: '请输入验证码',
                  },
                  {
                    len: 4,
                    message: '验证码长度应为4位',
                  },
                ]}
                onGetCaptcha={async (mobile) => {
                  await handleGetPhoneCaptcha(mobile);
                }}
              />
            </>
          )}
          <div className={styles.formFooter}>
            <ProFormCheckbox noStyle name="rememberMe">
              记住密码
            </ProFormCheckbox>
            <a className={styles.forgotPassword} onClick={handleForgotPassword}>
              忘记密码？
            </a>
          </div>
        </LoginForm>
      </ProCard>
    </div>
  );
};

export default Login; 
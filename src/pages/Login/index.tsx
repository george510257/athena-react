import React, { useState } from 'react';
import {
  LockOutlined,
  MobileOutlined,
  UserOutlined,
  GithubOutlined,
  WechatOutlined,
  GoogleOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
  ProCard,
} from '@ant-design/pro-components';
import { Tabs, Space, Divider, App } from 'antd';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.less';
import logo from '../../assets/logo.svg';

type LoginType = 'account' | 'phone';

const thirdPartyLogins = [
  { Icon: GoogleOutlined, text: 'Google登录' },
  { Icon: GithubOutlined, text: 'Github登录' },
  { Icon: WechatOutlined, text: '微信登录' },
];

const Login: React.FC = () => {
  const [loginType, setLoginType] = useState<LoginType>('account');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { message: antMessage } = App.useApp();

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      if (loginType === 'account') {
        const { username, password } = values;
        if (username === 'admin' && password === 'admin') {
          antMessage.success('登录成功');
          if (values.rememberMe) {
            localStorage.setItem('username', username);
          }
          navigate('/');
        } else {
          antMessage.error('用户名或密码错误');
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
      setLoading(false);
    }
  };

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
                    onClick={() => antMessage.info(`${text}开发中`)}
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
            onChange={(activeKey) => setLoginType(activeKey as LoginType)}
            items={[
              {
                key: 'account',
                label: '账号密码登录',
              },
              {
                key: 'phone',
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
                name="captcha"
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
                onGetCaptcha={async () => {
                  antMessage.success('验证码为: 1234');
                }}
              />
            </>
          )}
          <div className={styles.formFooter}>
            <ProFormCheckbox noStyle name="rememberMe">
              记住密码
            </ProFormCheckbox>
            <a className={styles.forgotPassword} onClick={() => antMessage.info('忘记密码功能开发中')}>
              忘记密码？
            </a>
          </div>
        </LoginForm>
      </ProCard>
    </div>
  );
};

export default Login; 
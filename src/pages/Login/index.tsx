import React, { useState } from 'react';
import {
  AlipayCircleOutlined,
  LockOutlined,
  MobileOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import { message, Tabs, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.less';
import logo from '../../assets/logo.svg';

type LoginType = 'account' | 'phone';

const Login: React.FC = () => {
  const [loginType, setLoginType] = useState<LoginType>('account');
  const navigate = useNavigate();

  const handleSubmit = async (values: any) => {
    if (loginType === 'account') {
      const { username, password } = values;
      if (username === 'admin' && password === 'admin') {
        message.success('登录成功！');
        navigate('/');
      } else {
        message.error('用户名或密码错误！');
      }
    } else {
      // 手机号登录逻辑
      message.success('登录成功！');
      navigate('/');
    }
  };

  return (
    <div className={styles.container}>
      <LoginForm
        logo={logo}
        title="Athena React"
        subTitle="欢迎使用系统"
        actions={
          <Space>
            其他登录方式
            <AlipayCircleOutlined className={styles.icon} />
            <TaobaoCircleOutlined className={styles.icon} />
            <WeiboCircleOutlined className={styles.icon} />
          </Space>
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
                prefix: <UserOutlined />,
              }}
              placeholder="用户名: admin"
              rules={[
                {
                  required: true,
                  message: '请输入用户名!',
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined />,
              }}
              placeholder="密码: admin"
              rules={[
                {
                  required: true,
                  message: '请输入密码！',
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
                prefix: <MobileOutlined />,
              }}
              name="mobile"
              placeholder="手机号"
              rules={[
                {
                  required: true,
                  message: '请输入手机号！',
                },
                {
                  pattern: /^1\d{10}$/,
                  message: '手机号格式错误！',
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
              placeholder="请输入验证码"
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
                  message: '请输入验证码！',
                },
              ]}
              onGetCaptcha={async () => {
                message.success('获取验证码成功！验证码为：1234');
              }}
            />
          </>
        )}
        <div style={{ marginBottom: 24 }}>
          <ProFormCheckbox noStyle name="autoLogin">
            自动登录
          </ProFormCheckbox>
          <a style={{ float: 'right' }}>忘记密码</a>
        </div>
      </LoginForm>
    </div>
  );
};

export default Login; 
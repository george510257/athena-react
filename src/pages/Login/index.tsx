import React from 'react';
import { Tabs, Space, Divider, message as antMessage, Form } from 'antd';
import {
  LoginForm,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
  ProCard,
} from '@ant-design/pro-components';
import {
  LockOutlined,
  MobileOutlined,
  UserOutlined,
  ReloadOutlined,
} from '@ant-design/icons';

// 本地资源 & 配置
import styles from './index.module.less';
import logo from '@/assets/logo.svg';
import { LoginTypeEnum } from './types';
import { thirdPartyLogins, loginTabs, formRules } from './config';
import useLogin from './hooks/useLogin';

// 登录表单组件
const Login: React.FC = () => {
  const {
    loginState,
    handleLoginTypeChange,
    handleSubmit,
    refreshCaptcha,
    handleThirdPartyLogin,
    handleGetPhoneCaptcha,
  } = useLogin();

  const { loginType, loading, imageCaptchaUrl } = loginState;

  const [form] = Form.useForm();

  // 渲染账号登录表单
  const renderAccountForm = () => (
    <>
      <ProFormText
        name="username"
        fieldProps={{
          size: 'large',
          prefix: <UserOutlined className={styles.prefixIcon} />,
        }}
        initialValue={localStorage.getItem('username') || ''}
        placeholder="用户名: admin"
        rules={formRules.account.username}
      />
      <ProFormText.Password
        name="password"
        fieldProps={{
          size: 'large',
          prefix: <LockOutlined className={styles.prefixIcon} />,
        }}
        placeholder="密码: admin"
        rules={formRules.account.password}
      />
      <ProFormText
        name="imageCaptcha"
        className={styles.captchaWrapper}
        fieldProps={{
          size: 'large',
          suffix: (
            <Space align="center" size={8}>
              <img 
                src={imageCaptchaUrl} 
                alt="验证码"
                className={styles.captchaImage}
                onClick={refreshCaptcha}
                title="点击刷新验证码"
              />
              <ReloadOutlined 
                onClick={refreshCaptcha} 
                className={styles.reloadIcon}
                title="刷新验证码"
              />
            </Space>
          ),
        }}
        placeholder="请输入验证码"
        rules={formRules.account.imageCaptcha}
      />
    </>
  );

  // 渲染手机号登录表单
  const renderPhoneForm = () => (
    <>
      <ProFormText
        name="mobile"
        fieldProps={{
          size: 'large',
          prefix: <MobileOutlined className={styles.prefixIcon} />,
        }}
        placeholder="手机号"
        rules={formRules.phone.mobile}
      />
      <ProFormCaptcha
        name="smsCaptcha"
        fieldProps={{ size: 'large' }}
        captchaProps={{ size: 'large' }}
        placeholder="验证码"
        rules={formRules.phone.smsCaptcha}
        onGetCaptcha={async () => {
          try {
            const values = await form.validateFields(['mobile']);
            await handleGetPhoneCaptcha(values.mobile);
          } catch (error) {
            throw new Error('请输入正确的手机号');
          }
        }}
        captchaTextRender={(timing, count) => 
          timing ? `${count} 秒后重新获取` : '获取验证码'
        }
      />
    </>
  );

  // 渲染第三方登录
  const renderOtherLogin = () => (
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
  );

  return (
    <div className={styles.container}>
      <ProCard className={styles.loginCard}>
        <LoginForm
          form={form}
          logo={logo}
          title="Athena React"
          subTitle="企业级中后台解决方案"
          loading={loading}
          actions={renderOtherLogin()}
          onFinish={handleSubmit}
        >
          <Tabs
            centered
            activeKey={loginType}
            onChange={(activeKey) => handleLoginTypeChange(
              activeKey === 'account' ? LoginTypeEnum.ACCOUNT : LoginTypeEnum.PHONE
            )}
            items={loginTabs}
          />
          {loginType === LoginTypeEnum.ACCOUNT ? renderAccountForm() : renderPhoneForm()}
          <div className={styles.formFooter}>
            <ProFormCheckbox noStyle name="rememberMe">
              记住密码
            </ProFormCheckbox>
            <a 
              className={styles.forgotPassword} 
              onClick={() => antMessage.info('忘记密码功能开发中')}
            >
              忘记密码？
            </a>
          </div>
        </LoginForm>
      </ProCard>
    </div>
  );
};

export default Login; 
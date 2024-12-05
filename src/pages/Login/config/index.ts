import {
  GithubOutlined,
  WechatOutlined,
  GoogleOutlined,
} from '@ant-design/icons';
import { LoginTypeEnum } from '../types';

// 第三方登录配置
export const thirdPartyLogins = [
  { Icon: GoogleOutlined, text: 'Google登录' },
  { Icon: GithubOutlined, text: 'Github登录' },
  { Icon: WechatOutlined, text: '微信登录' },
];

// 登录方式标签配置
export const loginTabs = [
  {
    key: LoginTypeEnum.ACCOUNT,
    label: '账号密码登录',
  },
  {
    key: LoginTypeEnum.PHONE,
    label: '手机号登录',
  },
];

// 表单校验规则
export const formRules = {
  account: {
    username: [
      { required: true, message: '请输入用户名' },
      { min: 3, message: '用户名至少3个字符' },
    ],
    password: [
      { required: true, message: '请输入密码' },
      { min: 5, message: '密码至少5个字符' },
    ],
    imageCaptcha: [
      { required: true, message: '请输入验证码' },
      { len: 4, message: '验证码长度应为4位' },
    ],
  },
  phone: {
    mobile: [
      { required: true, message: '请输入手机号' },
      { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' },
    ],
    smsCaptcha: [
      { required: true, message: '请输入验证码' },
      { len: 4, message: '验证码长度应为4位' },
    ],
  },
}; 
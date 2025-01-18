/**
 * @file 登录页面配置
 * @description 集中管理登录相关配置，包括：
 * - 第三方登录选项
 * - 登录方式切换
 * - 表单验证规则
 */

// 导入第三方登录所需图标
import {
  GithubOutlined,
  WechatOutlined,
  GoogleOutlined,
  QqOutlined,
} from '@ant-design/icons';
import { LoginTypeEnum } from '../types';  // 登录类型枚举
import FeishuIcon from '@/components/FeishuIcon';  // 自定义飞书图标组件

/**
 * 第三方登录配置列表
 * @type {Array<{Icon: React.ComponentType, text: string}>}
 * @description 定义支持的第三方登录方式，每项包含图标和显示文本
 */
export const thirdPartyLogins = [
  { Icon: GoogleOutlined, text: 'Google登录' },
  { Icon: GithubOutlined, text: 'Github登录' },
  { Icon: WechatOutlined, text: '微信登录' },
  { Icon: QqOutlined, text: 'QQ登录' },
  { Icon: FeishuIcon, text: '飞书登录' },
];

/**
 * 登录方式切换配置
 * @type {Array<{key: LoginTypeEnum, label: string}>}
 * @description 定义登录类型切换选项，支持账号密码和手机号两种方式
 */
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

/**
 * 表单验证规则配置
 * @type {Object}
 * @property {Object} account - 账号密码登录验证规则
 * @property {Array} account.username - 用户名验证规则：必填，最少3字符
 * @property {Array} account.password - 密码验证规则：必填，最少5字符
 * @property {Array} account.imageCaptcha - 图形验证码规则：必填，4位字符
 * @property {Object} phone - 手机号登录验证规则
 * @property {Array} phone.mobile - 手机号验证规则：必填，符合手机号格式
 * @property {Array} phone.smsCaptcha - 短信验证码规则：必填，6位数字
 */
export const formRules = {
  // 账号密码登录验证规则
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
  // 手机号登录验证规则
  phone: {
    mobile: [
      { required: true, message: '请输入手机号' },
      { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' },
    ],
    smsCaptcha: [
      { required: true, message: '请输入验证码' },
      { len: 6, message: '验证码长度应为6位' },
    ],
  },
};
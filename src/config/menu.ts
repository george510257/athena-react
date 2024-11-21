import { ComponentType } from 'react';
import { 
  DashboardOutlined, 
  UserOutlined, 
  SettingOutlined,
  LogoutOutlined 
} from '@ant-design/icons';

interface MenuItem {
  key: string;
  icon: ComponentType;
  label: string;
  children?: MenuItem[];
}

interface UserMenuItem extends Omit<MenuItem, 'children'> {
  type?: 'divider';
}

// 主菜单配置
export const menuItems: MenuItem[] = [
  {
    key: 'dashboard',
    icon: DashboardOutlined,
    label: '仪表盘',
  },
  {
    key: 'users',
    icon: UserOutlined,
    label: '用户管理',
  },
  {
    key: 'settings',
    icon: SettingOutlined,
    label: '系统设置',
  },
];

// 用户菜单配置
export const userMenuItems: (UserMenuItem | { type: 'divider' })[] = [
  {
    key: 'profile',
    icon: UserOutlined,
    label: '个人中心',
  },
  {
    key: 'settings',
    icon: SettingOutlined,
    label: '个人设置',
  },
  {
    type: 'divider',
  },
  {
    key: 'logout',
    icon: LogoutOutlined,
    label: '退出登录',
  },
]; 
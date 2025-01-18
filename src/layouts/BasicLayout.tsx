/**
 * @file 基础布局组件，提供全局导航和页面框架
 * @author Your Name
 */

import React from 'react';
import { ProLayout } from '@ant-design/pro-components';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';

/**
 * 基础布局组件
 * @component BasicLayout
 * @description 提供应用的主要布局结构，包含顶部导航栏和侧边菜单
 */
const BasicLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  /** 
   * 路由配置对象
   * 定义导航菜单的结构和内容
   */
  const route = {
    path: '/',
    routes: [
      {
        path: '/',
        name: '首页',
        icon: <HomeOutlined />,
      },
      {
        path: '/login',
        name: '登录',
        icon: <UserOutlined />,
      },
    ],
  };

  return (
    <ProLayout
      title="Athena React"
      logo="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
      location={location}
      route={route}
      menuItemRender={(item, dom) => (
        <div onClick={() => navigate(item.path || '/')}>{dom}</div>
      )}
      layout="mix"
      fixedHeader
      fixSiderbar
    >
      <Outlet />
    </ProLayout>
  );
};

export default BasicLayout;
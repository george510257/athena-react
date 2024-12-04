import React from 'react';
import { ProLayout } from '@ant-design/pro-components';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';

const BasicLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
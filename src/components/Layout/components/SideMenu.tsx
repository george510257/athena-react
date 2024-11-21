import React from 'react';
import { Menu } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { menuItems } from '@/config/menu';
import styles from '../layout.module.css';

interface SideMenuProps {
  collapsed: boolean;
}

const SideMenu: React.FC<SideMenuProps> = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getSelectedKey = () => {
    const path = location.pathname.split('/')[1] || 'dashboard';
    return [path];
  };

  return (
    <>
      <div className={styles.logo}>
        {!collapsed && <span>Admin Pro</span>}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={getSelectedKey()}
        items={menuItems.map(item => ({
          ...item,
          icon: React.createElement(item.icon)
        }))}
        onClick={({ key }) => navigate(`/${key}`)}
      />
    </>
  );
};

export default SideMenu; 
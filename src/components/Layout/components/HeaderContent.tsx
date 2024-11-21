import React from 'react';
import { Avatar, Dropdown } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { userMenuItems } from '@/config/menu';
import styles from '../layout.module.css';

interface HeaderContentProps {
  collapsed: boolean;
  onCollapse: () => void;
}

const HeaderContent: React.FC<HeaderContentProps> = ({ collapsed, onCollapse }) => {
  const navigate = useNavigate();
  const { getUserInfo, clearAuth } = useAuth();
  const userInfo = getUserInfo();

  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      clearAuth();
    } else {
      navigate(`/${key}`);
    }
  };

  return (
    <>
      {React.createElement(
        collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
        {
          className: styles.trigger,
          onClick: onCollapse,
        }
      )}
      <div className={styles.rightContent}>
        <Dropdown
          menu={{
            items: userMenuItems.map(item => ({
              ...item,
              icon: item.icon && React.createElement(item.icon)
            })),
            onClick: handleUserMenuClick,
          }}
          placement="bottomRight"
        >
          <span className={styles.userInfo}>
            <Avatar src={userInfo?.avatar} />
            <span className={styles.username}>{userInfo?.username}</span>
          </span>
        </Dropdown>
      </div>
    </>
  );
};

export default HeaderContent; 
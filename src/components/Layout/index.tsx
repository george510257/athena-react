import { Layout as AntLayout, Dropdown, Avatar, Menu } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAuth } from '@/hooks/useAuth';
import styles from './layout.module.css';

const { Header, Content } = AntLayout;

const Layout = () => {
  const { getUserInfo, clearAuth } = useAuth();
  const userInfo = getUserInfo();

  const handleLogout = () => {
    clearAuth();
  };

  const menu = (
    <Menu>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        退出登录
      </Menu.Item>
    </Menu>
  );

  return (
    <AntLayout className={styles.layout}>
      <Header className={styles.header}>
        <div className={styles.logo}>管理系统</div>
        <div className={styles.userInfo}>
          <Dropdown overlay={menu} placement="bottomRight">
            <span className={styles.userDropdown}>
              <Avatar 
                src={userInfo?.avatar} 
                icon={<UserOutlined />} 
                size="small" 
              />
              <span className={styles.username}>{userInfo?.username}</span>
            </span>
          </Dropdown>
        </div>
      </Header>
      <Content className={styles.content}>
        <Outlet />
      </Content>
    </AntLayout>
  );
};

export default Layout; 
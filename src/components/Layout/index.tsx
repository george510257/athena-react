import React, { useState } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import SideMenu from './components/SideMenu';
import HeaderContent from './components/HeaderContent';
import styles from './layout.module.css';

const { Header, Sider, Content } = Layout;

const ProLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout className={styles.layout}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        theme="dark"
        width={256}
      >
        <SideMenu collapsed={collapsed} />
      </Sider>
      <Layout>
        <Header className={styles.header}>
          <HeaderContent 
            collapsed={collapsed}
            onCollapse={() => setCollapsed(!collapsed)}
          />
        </Header>
        <div className={styles.contentWrapper}>
          <Content className={styles.content}>
            <Outlet />
          </Content>
        </div>
      </Layout>
    </Layout>
  );
};

export default ProLayout; 
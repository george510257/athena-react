import React from 'react';
import { Card, Typography, Space } from 'antd';

const { Title, Paragraph } = Typography;

const Home: React.FC = () => {
  return (
    <Space direction="vertical" size="large" style={{ display: 'flex' }}>
      <Card>
        <Title level={2}>欢迎使用 Athena React</Title>
        <Paragraph>
          这是一个基于 React + Ant Design 的项目模板，包含了以下特性：
        </Paragraph>
        <ul>
          <li>基于 React 18 和 TypeScript</li>
          <li>使用 Ant Design 组件库</li>
          <li>路由配置</li>
          <li>标准的项目结构</li>
          <li>登录页面示例</li>
        </ul>
      </Card>
    </Space>
  );
};

export default Home; 
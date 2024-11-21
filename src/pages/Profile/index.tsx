import React from 'react';
import { Card, Form, Input, Button, Avatar, Upload, message } from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';
import { useAuth } from '@/hooks/useAuth';

const Profile: React.FC = () => {
  const { getUserInfo } = useAuth();
  const userInfo = getUserInfo();
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    console.log('Form values:', values);
    message.success('个人信息更新成功');
  };

  return (
    <Card title="个人中心">
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Avatar 
          size={100} 
          src={userInfo?.avatar}
          icon={<UserOutlined />}
        />
        <Upload showUploadList={false}>
          <Button icon={<UploadOutlined />} style={{ marginTop: 16 }}>
            更换头像
          </Button>
        </Upload>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          username: userInfo?.username,
          email: 'user@example.com',
          phone: '13800138000',
        }}
      >
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="邮箱"
          name="email"
          rules={[
            { required: true, message: '请输入邮箱' },
            { type: 'email', message: '请输入有效的邮箱地址' }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="手机号"
          name="phone"
          rules={[
            { required: true, message: '请输入手机号' },
            { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            保存修改
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Profile; 
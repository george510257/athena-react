import React from 'react';
import { Card, Form, Input, Switch, Button, Space, Divider } from 'antd';

const Settings: React.FC = () => {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    console.log('Form values:', values);
  };

  return (
    <Card title="系统设置">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          siteName: 'Admin Pro',
          enableNotifications: true,
          enableDarkMode: false,
        }}
      >
        <Form.Item
          label="站点名称"
          name="siteName"
          rules={[{ required: true, message: '请输入站点名称' }]}
        >
          <Input />
        </Form.Item>

        <Divider />

        <Form.Item
          label="启用通知"
          name="enableNotifications"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="深色模式"
          name="enableDarkMode"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Divider />

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              保存设置
            </Button>
            <Button onClick={() => form.resetFields()}>
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Settings; 
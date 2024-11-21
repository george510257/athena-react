import { useEffect, useState } from 'react';
import { Row, Col, Typography } from 'antd';
import { 
  UserOutlined, 
  ShoppingCartOutlined, 
  DollarOutlined,
  ClockCircleOutlined 
} from '@ant-design/icons';
import { 
  ProCard,
  ProList,
  StatisticCard 
} from '@ant-design/pro-components';
import { dashboardService } from '@/services/dashboard';
import type { DashboardData, DashboardActivity } from '@/types/api';
import styles from './dashboard.module.css';

const { Title } = Typography;
const { Divider } = StatisticCard;

const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await dashboardService.getOverview();
        setData(result);
      } catch (error) {
        console.error('获取仪表盘数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (!data) {
    return <div>加载中...</div>;
  }

  return (
    <div className={styles.container}>
      <Title level={2}>仪表盘概览</Title>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <ProCard loading={loading}>
            <StatisticCard
              statistic={{
                title: '总用户数',
                value: data.totalUsers,
                icon: <UserOutlined />,
                description: <div>活跃用户：{data.activeUsers}</div>
              }}
            />
          </ProCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <ProCard loading={loading}>
            <StatisticCard
              statistic={{
                title: '总订单数',
                value: data.totalOrders,
                icon: <ShoppingCartOutlined />,
                description: <div>待处理：{data.pendingOrders}</div>
              }}
            />
          </ProCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <ProCard loading={loading}>
            <StatisticCard
              statistic={{
                title: '待处理订单',
                value: data.pendingOrders,
                icon: <ClockCircleOutlined />,
                status: 'processing'
              }}
            />
          </ProCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <ProCard loading={loading}>
            <StatisticCard
              statistic={{
                title: '本月收入',
                prefix: '¥',
                value: data.revenue.monthly,
                icon: <DollarOutlined />,
                precision: 2
              }}
            />
          </ProCard>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className={styles.secondRow}>
        <Col xs={24} lg={16}>
          <ProCard
            title="收入统计"
            loading={loading}
            className={styles.revenueCard}
          >
            <StatisticCard.Group>
              <StatisticCard
                statistic={{
                  title: '今日收入',
                  value: data.revenue.daily,
                  precision: 2,
                  prefix: '¥'
                }}
              />
              <Divider />
              <StatisticCard
                statistic={{
                  title: '本周收入',
                  value: data.revenue.weekly,
                  precision: 2,
                  prefix: '¥'
                }}
              />
              <Divider />
              <StatisticCard
                statistic={{
                  title: '本月收入',
                  value: data.revenue.monthly,
                  precision: 2,
                  prefix: '¥'
                }}
              />
            </StatisticCard.Group>
          </ProCard>
        </Col>
        <Col xs={24} lg={8}>
          <ProCard
            title="最近活动"
            loading={loading}
            className={styles.activityCard}
          >
            <ProList<DashboardActivity>
              dataSource={data.recentActivity}
              rowKey="id"
              showActions="hover"
              showExtra="hover"
              metas={{
                title: {
                  dataIndex: 'content',
                },
                description: {
                  render: (_, record) => (
                    <div>{new Date(record.timestamp).toLocaleString()}</div>
                  ),
                },
                type: {
                  dataIndex: 'type',
                  render: (text) => {
                    const typeMap = {
                      order: '订单',
                      user: '用户',
                      system: '系统'
                    };
                    return typeMap[text as keyof typeof typeMap] || text;
                  }
                }
              }}
            />
          </ProCard>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 
import React from 'react';
import { Row, Col, List, Tag, Spin } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import PageContainer from '@/components/PageContainer';
import StatCard from '@/components/StatCard';
import { useDashboard } from '@/hooks/useDashboard';
import { ActivityItem } from '@/services/dashboard';
import styles from './dashboard.module.css';
import commonStyles from '@/styles/common.module.css';

const Dashboard: React.FC = () => {
  const { data, loading } = useDashboard();

  const getActivityIcon = (type: string) => {
    const iconMap = {
      order: <Tag color="blue">订单</Tag>,
      user: <Tag color="green">用户</Tag>,
      system: <Tag color="orange">系统</Tag>
    };
    return iconMap[type as keyof typeof iconMap];
  };

  if (loading || !data) {
    return (
      <div className={commonStyles.flexCenter}>
        <Spin size="large" />
      </div>
    );
  }

  const { stats, activities } = data;

  return (
    <PageContainer>
      <div className={styles.dashboard}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              title="总用户数"
              value={stats.totalUsers}
              prefix={<ArrowUpOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              title="活跃用户"
              value={stats.activeUsers}
              prefix={<ArrowDownOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              title="总订单数"
              value={stats.totalOrders}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              title="待处理订单"
              value={stats.pendingOrders}
              valueStyle={{ color: '#faad14' }}
            />
          </Col>
        </Row>

        <Row gutter={[16, 16]} className={commonStyles.mt24}>
          <Col xs={24} lg={12}>
            <div className={`${commonStyles.card} ${styles.revenueCard}`}>
              <h3 className={commonStyles.textPrimary}>收入统计</h3>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <StatCard
                    title="日收入"
                    value={stats.revenue.daily}
                    precision={2}
                    prefix="¥"
                    suffix={
                      <small style={{ fontSize: '12px', color: '#52c41a' }}>
                        +{stats.revenue.dailyGrowth}%
                      </small>
                    }
                  />
                </Col>
                <Col span={8}>
                  <StatCard
                    title="周收入"
                    value={stats.revenue.weekly}
                    precision={2}
                    prefix="¥"
                    suffix={
                      <small style={{ fontSize: '12px', color: '#52c41a' }}>
                        +{stats.revenue.weeklyGrowth}%
                      </small>
                    }
                  />
                </Col>
                <Col span={8}>
                  <StatCard
                    title="月收入"
                    value={stats.revenue.monthly}
                    precision={2}
                    prefix="¥"
                    suffix={
                      <small style={{ fontSize: '12px', color: '#52c41a' }}>
                        +{stats.revenue.monthlyGrowth}%
                      </small>
                    }
                  />
                </Col>
              </Row>
            </div>
          </Col>
          <Col xs={24} lg={12}>
            <div className={`${commonStyles.card} ${styles.activityCard}`}>
              <h3 className={commonStyles.textPrimary}>最近活动</h3>
              <List
                itemLayout="horizontal"
                dataSource={activities}
                renderItem={(item: ActivityItem) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={getActivityIcon(item.type)}
                      title={<span className={commonStyles.textPrimary}>{item.content}</span>}
                      description={
                        <span className={commonStyles.textSecondary}>
                          {new Date(item.timestamp).toLocaleString()}
                        </span>
                      }
                    />
                  </List.Item>
                )}
              />
            </div>
          </Col>
        </Row>
      </div>
    </PageContainer>
  );
};

export default Dashboard; 
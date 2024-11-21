import React from 'react';
import { Card, Statistic } from 'antd';
import type { StatisticProps } from 'antd/es/statistic/Statistic';
import styles from './statCard.module.css';

interface StatCardProps extends Omit<StatisticProps, 'loading'> {
  loading?: boolean;
  bordered?: boolean;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  loading = false,
  bordered = false,
  className,
  ...statisticProps
}) => {
  return (
    <Card 
      loading={loading} 
      bordered={bordered} 
      className={`${styles.card} ${className || ''}`}
    >
      <Statistic {...statisticProps} />
    </Card>
  );
};

export default StatCard; 
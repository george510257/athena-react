import React from 'react';
import { Card } from 'antd';
import styles from './pageContainer.module.css';

interface PageContainerProps {
  title?: React.ReactNode;
  extra?: React.ReactNode;
  children: React.ReactNode;
}

const PageContainer: React.FC<PageContainerProps> = ({
  title,
  extra,
  children
}) => {
  return (
    <div className={styles.pageContainer}>
      <Card
        title={title}
        extra={extra}
        bordered={false}
        className={styles.card}
      >
        {children}
      </Card>
    </div>
  );
};

export default PageContainer; 
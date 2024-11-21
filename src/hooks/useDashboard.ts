import { useState, useEffect } from 'react';
import { DashboardService, DashboardData } from '@/services/dashboard';
import { message } from 'antd';

export function useDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await DashboardService.getOverview();
        setData(result);
      } catch (err) {
        setError(err as Error);
        message.error('获取仪表盘数据失败');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
} 
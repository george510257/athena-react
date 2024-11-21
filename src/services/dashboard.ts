import { request } from '@/utils/request';
import type { DashboardData } from '@/types/api';

export const dashboardService = {
  getOverview(): Promise<DashboardData> {
    return request<DashboardData>('/dashboard/overview', {
      method: 'GET'
    });
  }
}; 
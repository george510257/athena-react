import { request } from '@/utils/request';

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalOrders: number;
  pendingOrders: number;
  revenue: {
    daily: number;
    weekly: number;
    monthly: number;
    dailyGrowth: number;
    weeklyGrowth: number;
    monthlyGrowth: number;
  };
}

export interface ActivityItem {
  id: number;
  type: 'order' | 'user' | 'system';
  content: string;
  timestamp: string;
}

export interface DashboardData {
  stats: DashboardStats;
  activities: ActivityItem[];
}

export const DashboardService = {
  getOverview: () => request<DashboardData>('/dashboard/overview'),
  getStats: () => request<DashboardStats>('/dashboard/stats'),
  getActivities: () => request<ActivityItem[]>('/dashboard/activities'),
}; 
// 通用响应类型
export interface ApiResponse<T = any> {
  code: number;
  data: T;
  message?: string;
}

// 用户相关类型
export interface UserInfo {
  id: number;
  username: string;
  avatar: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  user: UserInfo;
}

// 仪表盘相关类型
export interface DashboardRevenue {
  daily: number;
  weekly: number;
  monthly: number;
}

export interface DashboardActivity {
  id: number;
  type: 'order' | 'user' | 'system';
  content: string;
  timestamp: string;
}

export interface DashboardData {
  totalUsers: number;
  activeUsers: number;
  totalOrders: number;
  pendingOrders: number;
  revenue: DashboardRevenue;
  recentActivity: DashboardActivity[];
} 
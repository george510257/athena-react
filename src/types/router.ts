import type { RouteObject } from 'react-router-dom';

export interface AppRouteObject extends Omit<RouteObject, 'children'> {
  children?: AppRouteObject[];
  auth?: boolean;  // 是否需要认证
  roles?: string[]; // 允许访问的角色
  title?: string;   // 路由标题
  icon?: React.ComponentType; // 菜单图标
  hideInMenu?: boolean; // 是否在菜单中隐藏
} 
import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

// 懒加载路由组件
const Login = lazy(() => import('@/pages/Login'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Users = lazy(() => import('@/pages/Users'));
const Settings = lazy(() => import('@/pages/Settings'));
const Profile = lazy(() => import('@/pages/Profile'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// 定义路由配置类型
interface AppRouteObject extends Omit<RouteObject, 'children'> {
  children?: AppRouteObject[];
  auth?: boolean;
}

// 路由配置
export const routes: AppRouteObject[] = [
  {
    path: '/login',
    Component: Login
  },
  {
    path: '/',
    auth: true,
    async lazy() {
      const { default: ProLayout } = await import('@/components/Layout');
      return {
        Component: ProLayout
      };
    },
    children: [
      {
        path: '',
        Component: Dashboard
      },
      {
        path: 'dashboard',
        Component: Dashboard
      },
      {
        path: 'users',
        Component: Users
      },
      {
        path: 'settings',
        Component: Settings
      },
      {
        path: 'profile',
        Component: Profile
      }
    ]
  },
  {
    path: '*',
    Component: NotFound
  }
]; 
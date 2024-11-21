import { createBrowserRouter, RouteObject } from 'react-router-dom';
import { Suspense } from 'react';
import { Spin } from 'antd';
import AuthGuard from '@/components/AuthGuard';
import { routes } from '@/config/routes';

// 全局加载状态
const LoadingComponent = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh' 
  }}>
    <Spin size="large" />
  </div>
);

// 包装路由组件，添加 Suspense 和 AuthGuard
const wrapRoutes = (routes: any[]): RouteObject[] => {
  return routes.map(route => {
    const wrappedRoute: RouteObject = { ...route };

    // 处理组件
    if ('Component' in route) {
      const RouteComponent = route.Component;
      wrappedRoute.element = (
        <Suspense fallback={<LoadingComponent />}>
          {route.auth ? (
            <AuthGuard>
              <RouteComponent />
            </AuthGuard>
          ) : (
            <RouteComponent />
          )}
        </Suspense>
      );
      delete wrappedRoute.Component;
    }

    // 处理懒加载组件
    if (route.lazy) {
      const originalLazy = route.lazy;
      wrappedRoute.lazy = async () => {
        const result = await originalLazy();
        if (result.Component) {
          return {
            Component: () => (
              <Suspense fallback={<LoadingComponent />}>
                {route.auth ? (
                  <AuthGuard>
                    <result.Component />
                  </AuthGuard>
                ) : (
                  <result.Component />
                )}
              </Suspense>
            )
          };
        }
        return result;
      };
    }

    // 处理子路由
    if (route.children) {
      wrappedRoute.children = wrapRoutes(route.children);
    }

    return wrappedRoute;
  });
};

export const router = createBrowserRouter(wrapRoutes(routes));

export default router; 
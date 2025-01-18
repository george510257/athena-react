// 导入路由相关组件和页面
import { createBrowserRouter } from 'react-router-dom';
import BasicLayout from '../layouts/BasicLayout';
import Home from '../pages/Home';
import Login from '../pages/Login';

// 路由配置
const router = createBrowserRouter([
  // 登录页面路由
  {
    path: '/login',
    element: <Login />,
  },
  // 主布局路由
  {
    path: '/',
    element: <BasicLayout />,
    children: [
      // 首页路由
      {
        index: true,
        element: <Home />,
      },
    ],
  },
]);

export default router;
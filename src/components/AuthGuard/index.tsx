import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * 路由认证守卫组件
 * 用于保护需要登录才能访问的路由
 * 如果用户未登录，将重定向到登录页面
 */
const AuthGuard = ({ children }: AuthGuardProps) => {
  const location = useLocation();
  const { getToken } = useAuth();
  
  const token = getToken();
  
  // 如果没有 token，重定向到登录页面，并记录当前位置
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AuthGuard; 
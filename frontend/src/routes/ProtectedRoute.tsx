import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@hooks/useAppSelector';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { restoreAuth } from '@store/slices/authSlice';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string[];
  portalType?: 'management' | 'customer';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  portalType,
}) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(restoreAuth());
    }
  }, [dispatch, isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  const roleName = typeof user?.role === 'object' && user?.role !== null
    ? (user.role as { name?: string }).name || ''
    : String(user?.role || '');

  const isCustomerUser = roleName === 'Customer';

  // Management portal check: redirect customers to customer dashboard
  if (portalType === 'management' && isCustomerUser) {
    return <Navigate to="/customer/dashboard" replace />;
  }

  // Customer portal check: redirect management staff if needed, or allow
  if (portalType === 'customer' && !isCustomerUser && requiredRole && !requiredRole.includes(roleName)) {
    return <Navigate to="/dashboard" replace />;
  }

  if (requiredRole && roleName && !requiredRole.includes(roleName)) {
    return <Navigate to={isCustomerUser ? '/customer/dashboard' : '/dashboard'} replace />;
  }

  return <>{children}</>;
};

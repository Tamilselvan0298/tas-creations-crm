import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { UserRole } from '../types';

interface RoleRouteGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export const RoleRouteGuard: React.FC<RoleRouteGuardProps> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0B1F3A] border-t-[#D4AF37] dark:border-slate-800 dark:border-t-[#D4AF37]"></div>
      </div>
    );
  }

  if (!user || !allowedRoles.includes(user.role)) {
    // Redirect to root dashboard if user doesn't have permissions
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

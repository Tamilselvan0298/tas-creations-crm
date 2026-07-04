import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0B1F3A] border-t-[#D4AF37] dark:border-slate-800 dark:border-t-[#D4AF37]"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

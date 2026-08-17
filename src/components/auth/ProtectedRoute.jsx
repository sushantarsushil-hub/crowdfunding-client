'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import useAuth from '../../hooks/use-auth';
import Loading from '../loading/Loading';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const fromParam = encodeURIComponent(pathname);
      router.replace(`/login?from=${fromParam}`);
    }
  }, [isLoading, isAuthenticated, pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loading message="Verifying session authorization..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/use-auth';
import Loading from '../loading/Loading';
import UnauthorizedState from './UnauthorizedState';

export const RoleGuard = ({ allowedRoles = [], children }) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  const userRole = user?.role || 'supporter';
  const isAllowed = allowedRoles.includes(userRole);

  useEffect(() => {
    if (!isLoading && isAuthenticated && !isAllowed) {
      toast.error(`Unauthorized: Access restricted to authorized roles [${allowedRoles.join(', ')}].`);
    }
  }, [isLoading, isAuthenticated, isAllowed, userRole, allowedRoles]);

  if (isLoading) {
    return <Loading message="Checking role permissions..." />;
  }

  if (!isAllowed) {
    return <UnauthorizedState allowedRoles={allowedRoles} />;
  }

  return <>{children}</>;
};

export default RoleGuard;

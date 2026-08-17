'use client';

import React from 'react';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import RoleGuard from '../../components/auth/RoleGuard';

export default function WithdrawalsTopLevelLayout({ children }) {
  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={['creator', 'admin']}>
        {children}
      </RoleGuard>
    </ProtectedRoute>
  );
}

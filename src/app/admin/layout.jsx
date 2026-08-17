'use client';

import React from 'react';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import RoleGuard from '../../components/auth/RoleGuard';

export default function AdminTopLevelLayout({ children }) {
  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={['admin']}>
        {children}
      </RoleGuard>
    </ProtectedRoute>
  );
}

'use client';

import React from 'react';
import RoleGuard from '../../../components/auth/RoleGuard';

export default function AdminLayout({ children }) {
  return (
    <RoleGuard allowedRoles={['admin']}>
      {children}
    </RoleGuard>
  );
}

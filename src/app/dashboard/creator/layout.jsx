'use client';

import React from 'react';
import RoleGuard from '../../../components/auth/RoleGuard';

export default function CreatorLayout({ children }) {
  return (
    <RoleGuard allowedRoles={['creator', 'admin']}>
      {children}
    </RoleGuard>
  );
}

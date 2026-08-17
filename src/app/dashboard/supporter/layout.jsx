'use client';

import React from 'react';
import RoleGuard from '../../../components/auth/RoleGuard';

export default function SupporterLayout({ children }) {
  return (
    <RoleGuard allowedRoles={['supporter', 'creator', 'admin']}>
      {children}
    </RoleGuard>
  );
}

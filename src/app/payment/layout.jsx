'use client';

import React from 'react';
import ProtectedRoute from '../../components/auth/ProtectedRoute';

export default function PaymentLayout({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

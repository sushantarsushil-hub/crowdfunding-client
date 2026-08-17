'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldAlert, ArrowLeft, LayoutDashboard, Home } from 'lucide-react';
import Button from '../ui/Button';
import useAuth from '../../hooks/use-auth';

export const UnauthorizedState = ({
  title = '403 — Access Forbidden',
  message,
  allowedRoles = [],
}) => {
  const router = useRouter();
  const { user } = useAuth();

  const userRole = user?.role || 'unauthenticated';

  const defaultMessage = message || (
    <>
      You do not have permission to view this section. This page requires{' '}
      <strong>{allowedRoles.join(' or ')}</strong> access. Your active account role is{' '}
      <strong className="capitalize text-rose-700">{userRole}</strong>.
    </>
  );

  const getDashboardRedirect = () => {
    if (userRole === 'admin') return '/dashboard/admin';
    if (userRole === 'creator') return '/dashboard/creator';
    return '/dashboard';
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white rounded-3xl border border-rose-100 shadow-2xl p-8 space-y-6">
        {/* Shield Icon Badge */}
        <div className="w-16 h-16 rounded-3xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
          <ShieldAlert className="w-8 h-8" />
        </div>

        {/* Header & Description */}
        <div className="space-y-2">
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
          <div className="text-xs text-slate-600 leading-relaxed font-medium">
            {defaultMessage}
          </div>
        </div>

        {/* Informational Role Banner */}
        <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-[11px] font-semibold text-slate-600 space-y-1">
          <p>
            Logged in as: <span className="font-bold text-slate-900">{user?.name || user?.email || 'Authenticated User'}</span>
          </p>
          <p className="text-[10px] text-slate-500">
            Backend Authorization Engine strictly enforces security rules.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
          <Button
            variant="primary"
            size="md"
            className="w-full sm:w-auto"
            onClick={() => router.push(getDashboardRedirect())}
            icon={<LayoutDashboard className="w-4 h-4" />}
          >
            Return to Dashboard
          </Button>

          <Link href="/campaigns" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="md"
              className="w-full"
              icon={<Home className="w-4 h-4" />}
            >
              Explore Campaigns
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedState;

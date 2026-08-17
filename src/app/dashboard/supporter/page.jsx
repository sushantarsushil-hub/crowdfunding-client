'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Heart, Coins, CheckCircle, Clock, ArrowRight, Compass, PlusCircle } from 'lucide-react';
import useAuth from '../../../hooks/use-auth';
import RoleGuard from '../../../components/auth/RoleGuard';
import StatsCard from '../../../components/dashboard/StatsCard';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Skeleton from '../../../components/ui/Skeleton';
import contributionsService from '../../../services/contributions';

export default function SupporterDashboardHome() {
  const { user } = useAuth();

  const { data: response, isLoading } = useQuery({
    queryKey: ['myContributions'],
    queryFn: () => contributionsService.getMyContributions(),
  });

  const contributions = response?.data?.contributions || response?.contributions || (Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : []);

  const totalContributions = contributions.length;
  const pendingContributions = contributions.filter((c) => (c.status || '').toLowerCase() === 'pending').length;
  const approvedContributions = contributions.filter((c) => (c.status || '').toLowerCase() === 'approved');
  const totalApprovedAmount = approvedContributions.reduce((acc, curr) => acc + (curr.credits || curr.amount || 0), 0);

  const recentContributions = contributions.slice(0, 5);

  return (
    <RoleGuard allowedRoles={['supporter', 'creator', 'admin']}>
      <div className="space-y-8">
        {/* Header Banner */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 uppercase tracking-wider">
              Supporter Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
              Welcome back, {user?.name || 'Supporter'}!
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Track your backed causes, credit balance, and humanitarian impact.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link href="/dashboard/supporter/purchase">
              <Button variant="primary" size="sm" icon={<Coins className="w-4 h-4 text-amber-300" />}>
                Purchase Credits
              </Button>
            </Link>
            <Link href="/campaigns">
              <Button variant="outline" size="sm" icon={<Compass className="w-4 h-4" />}>
                Explore Causes
              </Button>
            </Link>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Contributions"
            value={totalContributions}
            subtext="Causes supported to date"
            icon={Heart}
            color="emerald"
          />
          <StatsCard
            title="Pending Review"
            value={pendingContributions}
            subtext="Pledges awaiting milestone verification"
            icon={Clock}
            color="amber"
          />
          <StatsCard
            title="Approved Pledges"
            value={`${totalApprovedAmount.toLocaleString()} Cr`}
            subtext="Disbursed directly to creators"
            icon={CheckCircle}
            color="indigo"
          />
          <StatsCard
            title="Available Credits"
            value={`${user?.credits ?? 0} Cr`}
            subtext="Ready for future pledges"
            icon={Coins}
            color="teal"
          />
        </div>

        {/* Recent Contributions Section */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <h3 className="font-extrabold text-slate-900 text-lg">Recent Contributions</h3>
            <Link href="/dashboard/supporter/contributions" className="text-xs font-bold text-emerald-600 hover:underline flex items-center space-x-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full rounded-2xl" />
              <Skeleton className="h-12 w-full rounded-2xl" />
            </div>
          ) : recentContributions.length === 0 ? (
            <div className="py-8 text-center space-y-3">
              <p className="text-xs text-slate-500 font-medium">You haven't backed any campaigns yet.</p>
              <Link href="/campaigns">
                <Button variant="primary" size="sm">Explore Active Campaigns</Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentContributions.map((c, idx) => {
                const status = (c.status || 'pending').toLowerCase();
                return (
                  <div key={c._id || c.id || idx} className="py-3 flex items-center justify-between text-xs font-semibold">
                    <div className="space-y-0.5">
                      <span className="font-bold text-slate-900 block">{c.campaignTitle || c.campaignId?.title || 'Relief Cause'}</span>
                      <span className="text-[11px] text-slate-400 block">{new Date(c.createdAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="font-extrabold text-emerald-700">{c.credits || c.amount || 0} Cr</span>
                      <Badge variant={status === 'approved' ? 'success' : status === 'rejected' ? 'error' : 'warning'}>
                        {status}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </RoleGuard>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Users, 
  UserCheck, 
  Coins, 
  Receipt, 
  Layers, 
  Banknote, 
  AlertCircle, 
  ShieldCheck, 
  ArrowRight,
  FolderKanban
} from 'lucide-react';
import useAuth from '../../../hooks/use-auth';
import RoleGuard from '../../../components/auth/RoleGuard';
import StatsCard from '../../../components/dashboard/StatsCard';
import Button from '../../../components/ui/Button';
import Skeleton from '../../../components/ui/Skeleton';
import ErrorState from '../../../components/common/ErrorState';
import usersService from '../../../services/users';

export default function AdminDashboardHome() {
  const { user } = useAuth();

  // Fetch backend aggregation statistics API directly (No frontend manual calculations)
  const { data: response, isLoading, isError, refetch } = useQuery({
    queryKey: ['adminDashboardStats'],
    queryFn: () => usersService.getAdminDashboardStats(),
    staleTime: 1000 * 60 * 2,
  });

  const stats = response?.data?.stats || response?.stats || response?.data || {};

  const totalSupporters = stats.totalSupporters ?? 0;
  const totalCreators = stats.totalCreators ?? 0;
  const totalAvailableCredits = stats.totalAvailableCredits ?? stats.totalAvailableUserCredits ?? 0;
  const totalPaymentsProcessed = stats.totalPaymentsProcessed ?? 0;
  const totalCampaigns = stats.totalCampaigns ?? 0;
  const pendingCampaigns = stats.pendingCampaigns ?? 0;
  const pendingWithdrawals = stats.pendingWithdrawals ?? 0;
  const pendingReports = stats.pendingReports ?? 0;

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.08, duration: 0.4 },
    }),
  };

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="space-y-8">
        {/* Header Banner */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-100 uppercase tracking-wider">
              Admin Moderation Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
              Administrator Control Center
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Backend-aggregated platform metrics, user management, campaign verification, and withdrawal approvals.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link href="/dashboard/admin/campaigns">
              <Button variant="primary" size="sm" icon={<ShieldCheck className="w-4 h-4" />}>
                Review Campaigns ({pendingCampaigns})
              </Button>
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Skeleton className="h-32 rounded-3xl" />
            <Skeleton className="h-32 rounded-3xl" />
            <Skeleton className="h-32 rounded-3xl" />
            <Skeleton className="h-32 rounded-3xl" />
          </div>
        ) : isError ? (
          <ErrorState
            title="Unable to Load Dashboard Statistics"
            message="Failed to fetch backend aggregated metrics from server."
            onRetry={refetch}
          />
        ) : (
          <>
            {/* Admin Aggregation Statistics Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div custom={0} initial="hidden" animate="visible" variants={cardVariants}>
                <StatsCard title="Total Supporters" value={totalSupporters} subtext="Active backer accounts" icon={Users} color="indigo" />
              </motion.div>
              <motion.div custom={1} initial="hidden" animate="visible" variants={cardVariants}>
                <StatsCard title="Total Creators" value={totalCreators} subtext="Initiative organizers" icon={UserCheck} color="emerald" />
              </motion.div>
              <motion.div custom={2} initial="hidden" animate="visible" variants={cardVariants}>
                <StatsCard title="Total Available Credits" value={`${totalAvailableCredits.toLocaleString()} Cr`} subtext="Ledgered across users" icon={Coins} color="amber" />
              </motion.div>
              <motion.div custom={3} initial="hidden" animate="visible" variants={cardVariants}>
                <StatsCard title="Payments Processed" value={totalPaymentsProcessed} subtext="Completed credit top-ups" icon={Receipt} color="teal" />
              </motion.div>
            </div>

            {/* Moderation Queue & Platform Totals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div custom={4} initial="hidden" animate="visible" variants={cardVariants}>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card space-y-4 flex flex-col justify-between h-full">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full">Total Campaigns</span>
                      <FolderKanban className="w-5 h-5 text-indigo-500" />
                    </div>
                    <div className="text-3xl font-extrabold text-slate-900">{totalCampaigns}</div>
                    <p className="text-xs text-slate-500 font-medium">
                      Platform-wide campaign initiatives ({pendingCampaigns} pending review).
                    </p>
                  </div>
                  <Link href="/dashboard/admin/campaigns">
                    <Button variant="outline" size="sm" className="w-full" icon={<ArrowRight className="w-4 h-4" />}>
                      Manage Campaigns
                    </Button>
                  </Link>
                </div>
              </motion.div>

              <motion.div custom={5} initial="hidden" animate="visible" variants={cardVariants}>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card space-y-4 flex flex-col justify-between h-full">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">Pending Withdrawals</span>
                      <Banknote className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div className="text-3xl font-extrabold text-slate-900">{pendingWithdrawals}</div>
                    <p className="text-xs text-slate-500 font-medium">Creator cashout requests awaiting admin payout confirmation.</p>
                  </div>
                  <Link href="/dashboard/admin/withdrawals">
                    <Button variant="outline" size="sm" className="w-full" icon={<ArrowRight className="w-4 h-4" />}>
                      Review Withdrawals
                    </Button>
                  </Link>
                </div>
              </motion.div>

              <motion.div custom={6} initial="hidden" animate="visible" variants={cardVariants}>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card space-y-4 flex flex-col justify-between h-full">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full">Pending Flag Reports</span>
                      <AlertCircle className="w-5 h-5 text-rose-500" />
                    </div>
                    <div className="text-3xl font-extrabold text-slate-900">{pendingReports}</div>
                    <p className="text-xs text-slate-500 font-medium">Community flag reports requiring moderation resolution.</p>
                  </div>
                  <Link href="/dashboard/admin/reports">
                    <Button variant="outline" size="sm" className="w-full" icon={<ArrowRight className="w-4 h-4" />}>
                      View Reports
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </div>
    </RoleGuard>
  );
}

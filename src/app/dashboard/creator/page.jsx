'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Layers, PlusCircle, Banknote, Coins, CheckCircle, Clock, ArrowRight, AlertCircle } from 'lucide-react';
import useAuth from '../../../hooks/use-auth';
import RoleGuard from '../../../components/auth/RoleGuard';
import StatsCard from '../../../components/dashboard/StatsCard';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Skeleton from '../../../components/ui/Skeleton';
import campaignsService from '../../../services/campaigns';
import { useCreatorPendingContributions } from '../../../hooks/useContributions';
import { WITHDRAWAL_RULES } from '../../../constants/credit-rules';

export default function CreatorDashboardHome() {
  const { user } = useAuth();

  const { data: response, isLoading } = useQuery({
    queryKey: ['myCampaigns'],
    queryFn: () => campaignsService.getMyCampaigns(),
  });

  const { data: pendingResponse } = useCreatorPendingContributions({ limit: 5 });

  const campaigns = response?.data?.campaigns || response?.campaigns || (Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : []);
  const pendingContribs = pendingResponse?.data?.contributions || pendingResponse?.contributions || (Array.isArray(pendingResponse?.data) ? pendingResponse.data : Array.isArray(pendingResponse) ? pendingResponse : []);
  const pendingCount = pendingContribs.length;

  const totalCampaigns = campaigns.length;
  const activeCampaigns = campaigns.filter((c) => (c.status || '').toLowerCase() === 'approved').length;
  const totalRaisedCredits = campaigns.reduce((acc, curr) => acc + (curr.amountRaised ?? curr.raisedAmount ?? 0), 0);
  const estimatedUSD = (totalRaisedCredits / WITHDRAWAL_RULES.CREDITS_PER_USD).toFixed(2);

  const recentCampaigns = campaigns.slice(0, 5);

  return (
    <RoleGuard allowedRoles={['creator', 'admin']}>
      <div className="space-y-8">
        {/* Header Banner */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 uppercase tracking-wider">
              Creator Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
              Creator Dashboard
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Manage your social initiatives, review backer pledges, and request cashout withdrawals.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link href="/dashboard/creator/campaigns/new">
              <Button variant="primary" size="sm" icon={<PlusCircle className="w-4 h-4" />}>
                Add New Campaign
              </Button>
            </Link>
            <Link href="/dashboard/creator/withdrawals">
              <Button variant="outline" size="sm" icon={<Banknote className="w-4 h-4 text-emerald-600" />}>
                Cashout Payout
              </Button>
            </Link>
          </div>
        </div>

        {/* Creator Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Campaigns"
            value={totalCampaigns}
            subtext="Submitted projects to date"
            icon={Layers}
            color="indigo"
          />
          <StatsCard
            title="Active Campaigns"
            value={activeCampaigns}
            subtext="Approved & receiving pledges"
            icon={CheckCircle}
            color="emerald"
          />
          <StatsCard
            title="Total Raised Credits"
            value={`${totalRaisedCredits.toLocaleString()} Cr`}
            subtext="Raised from supporters"
            icon={Coins}
            color="amber"
          />
          <StatsCard
            title="Estimated Withdrawal"
            value={`$${estimatedUSD} USD`}
            subtext="At 20 Cr = $1.00 USD rate"
            icon={Banknote}
            color="teal"
          />
        </div>

        {/* Pending Pledges Review Banner */}
        {pendingCount > 0 && (
          <div className="bg-amber-50 border border-amber-200 p-5 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-amber-900 text-sm">
                  {pendingCount} Pending Contribution{pendingCount > 1 ? 's' : ''} Awaiting Review
                </h4>
                <p className="text-xs text-amber-700 font-medium">
                  Review backer pledges to approve funding or refund credits back to supporters.
                </p>
              </div>
            </div>
            <Link href="/dashboard/creator/campaigns">
              <Button variant="outline" size="sm" className="bg-white border-amber-300 text-amber-900 hover:bg-amber-100">
                Review Pledges ({pendingCount})
              </Button>
            </Link>
          </div>
        )}

        {/* Recent Campaign Activity */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <h3 className="font-extrabold text-slate-900 text-lg">My Recent Campaigns</h3>
            <Link href="/dashboard/creator/campaigns" className="text-xs font-bold text-emerald-600 hover:underline flex items-center space-x-1">
              <span>Manage All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full rounded-2xl" />
              <Skeleton className="h-12 w-full rounded-2xl" />
            </div>
          ) : recentCampaigns.length === 0 ? (
            <div className="py-8 text-center space-y-3">
              <p className="text-xs text-slate-500 font-medium">You haven't launched any campaigns yet.</p>
              <Link href="/dashboard/creator/campaigns/new">
                <Button variant="primary" size="sm">Create Your First Campaign</Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentCampaigns.map((c, idx) => {
                const raised = c.amountRaised ?? c.raisedAmount ?? 0;
                const goal = c.fundingGoal ?? c.goalAmount ?? 1;
                const status = (c.status || 'pending').toLowerCase();

                return (
                  <div key={c._id || c.id || idx} className="py-3 flex items-center justify-between text-xs font-semibold">
                    <div className="space-y-0.5">
                      <span className="font-bold text-slate-900 block">{c.title}</span>
                      <span className="text-[11px] text-slate-400 block">{c.category} • Goal: {goal} Cr</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="font-extrabold text-emerald-700">{raised} Cr Raised</span>
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

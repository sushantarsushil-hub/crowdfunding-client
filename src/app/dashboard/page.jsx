'use client';

import React from 'react';
import useAuth from '../../hooks/use-auth';
import StatsCard from '../../components/dashboard/StatsCard';
import { Heart, Coins, Banknote, Layers, Users, ShieldCheck } from 'lucide-react';

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const role = user?.role || 'supporter';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 capitalize">{role} Portal Overview</h1>
        <p className="text-xs text-slate-500 mt-1">Welcome back, {user?.name || 'User'}! Monitor your activity & balances.</p>
      </div>

      {/* Role-Aware Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard
          title="Available Credits"
          value={`${user?.credits ?? 0} Cr`}
          subtitle="Ready for campaign pledges"
          icon={Coins}
          color="emerald"
        />

        {role === 'creator' && (
          <>
            <StatsCard
              title="Raised Credits"
              value={`${user?.raisedCredits ?? 0} Cr`}
              subtitle={`Withdrawal value: $${((user?.raisedCredits ?? 0) / 20).toFixed(2)} USD`}
              icon={Banknote}
              color="amber"
            />
            <StatsCard
              title="Active Campaigns"
              value="3 Causes"
              subtitle="2 Approved, 1 Pending"
              icon={Layers}
              color="indigo"
            />
          </>
        )}

        {role === 'admin' && (
          <>
            <StatsCard
              title="Platform Users"
              value="1,280 Users"
              subtitle="Supporters & Creators"
              icon={Users}
              color="indigo"
            />
            <StatsCard
              title="Moderation Queue"
              value="5 Pending"
              subtitle="Awaiting admin review"
              icon={ShieldCheck}
              color="rose"
            />
          </>
        )}

        {role === 'supporter' && (
          <StatsCard
            title="Backed Projects"
            value="12 Contributions"
            subtitle="Supporting community relief"
            icon={Heart}
            color="rose"
          />
        )}
      </div>
    </div>
  );
}

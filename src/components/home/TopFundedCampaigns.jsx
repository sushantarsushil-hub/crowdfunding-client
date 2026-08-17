'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ArrowRight, Sparkles, UserCheck } from 'lucide-react';
import { useTopFundedCampaigns } from '../../hooks/useCampaigns';
import { CampaignSkeletonGrid } from '../common/CampaignSkeleton';
import ErrorState from '../common/ErrorState';
import Button from '../ui/Button';

export const TopFundedCampaigns = () => {
  const { data, isLoading, isError, refetch } = useTopFundedCampaigns(6);

  const campaigns = data?.data?.campaigns || data?.campaigns || (Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []));

  return (
    <div className="space-y-8 py-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>High-Impact Causes</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Top Funded Campaigns
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Discover the six highest-backed campaigns making a tangible difference today.
          </p>
        </div>

        <Link href="/campaigns" className="inline-flex items-center text-sm font-bold text-emerald-600 hover:text-emerald-700 space-x-1">
          <span>Explore All Campaigns</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Conditional Rendering: Loading, Error, or Grid */}
      {isLoading ? (
        <CampaignSkeletonGrid count={6} />
      ) : isError ? (
        <ErrorState
          title="Could not load top campaigns"
          message="We ran into an issue connecting to the campaign feed."
          onRetry={refetch}
        />
      ) : campaigns.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 rounded-3xl border border-slate-200 text-slate-500">
          No live campaigns found at the moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((c, idx) => {
            const raised = c.amountRaised ?? c.raisedAmount ?? c.raised ?? 0;
            const goal = c.fundingGoal ?? c.goalAmount ?? c.goal ?? 1;
            const percent = Math.min(100, Math.round((raised / goal) * 100));
            const organizerName = c.creatorName || c.creatorId?.name || c.organizer || 'Verified Organizer';
            const campaignId = c._id || c.id || idx;

            return (
              <motion.div
                key={campaignId}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative overflow-hidden">
                    <img
                      src={c.imageUrl || c.image || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80'}
                      alt={c.title}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80';
                      }}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-slate-800 shadow-xs">
                      {c.category}
                    </span>
                    <span className="absolute top-3 right-3 px-2.5 py-1 bg-slate-900/80 backdrop-blur-md rounded-full text-[11px] font-bold text-emerald-400">
                      {percent}% Funded
                    </span>
                  </div>

                  <div className="p-5 space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-emerald-600 mb-1 flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5" /> {organizerName}
                      </p>
                      <h3 className="font-bold text-slate-900 text-base line-clamp-2 group-hover:text-emerald-600 transition-colors">
                        <Link href={`/campaigns/${campaignId}`}>{c.title}</Link>
                      </h3>
                    </div>

                    <div className="space-y-2.5 pt-3 border-t border-slate-100">
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-700 ease-out"
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-900 font-extrabold">{raised.toLocaleString()} <span className="text-slate-400 font-normal">credits raised</span></span>
                        <span className="text-slate-500">Goal: {goal.toLocaleString()} credits</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100">
                  <Link href={`/campaigns/${campaignId}`}>
                    <Button variant="primary" size="sm" fullWidth icon={<Heart className="w-4 h-4 fill-white" />}>
                      Back This Cause
                    </Button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TopFundedCampaigns;

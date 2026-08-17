'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Tag, ArrowRight, User, Coins } from 'lucide-react';
import { fadeInUp } from '../../constants/animations';

export const CampaignCard = ({ campaign }) => {
  if (!campaign) return null;

  const raised = campaign.amountRaised ?? campaign.raisedAmount ?? campaign.raised ?? 0;
  const goal = campaign.fundingGoal ?? campaign.goalAmount ?? campaign.goal ?? 1;
  const minContribution = campaign.minimumContribution || 1;
  const percentage = Math.min(Math.round((raised / goal) * 100), 100);
  const deadlineDate = campaign.deadline ? new Date(campaign.deadline).toLocaleDateString() : 'Active';
  const creatorName = campaign.creatorName || campaign.creatorId?.name || campaign.organizer || 'Verified Creator';

  return (
    <motion.div
      variants={fadeInUp}
      className="group relative bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-card hover:shadow-card-hover hover:border-emerald-300 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        {/* Image Banner Header */}
        <div className="relative h-52 w-full bg-slate-900 overflow-hidden">
          <img
            src={campaign.imageUrl || campaign.image || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80'}
            alt={campaign.title}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80';
            }}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

          {/* Category Badge */}
          <div className="absolute top-3 left-3 px-3 py-1 bg-white/95 backdrop-blur-md rounded-full text-[11px] font-extrabold text-slate-800 border border-white/60 flex items-center space-x-1.5 shadow-md">
            <Tag className="w-3 h-3 text-emerald-600" />
            <span>{campaign.category || 'General'}</span>
          </div>

          {/* Funding Percentage Pill */}
          <div className="absolute top-3 right-3 px-3 py-1 bg-emerald-600/90 backdrop-blur-md rounded-full text-[11px] font-black text-white shadow-md shadow-emerald-950/30 tracking-tight">
            {percentage}% Funded
          </div>
        </div>

        {/* Campaign Content Body */}
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs text-slate-500 font-semibold">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px]">
                {creatorName.charAt(0).toUpperCase()}
              </div>
              <span className="truncate max-w-[180px]">{creatorName}</span>
            </div>
            <h3 className="font-extrabold text-slate-900 text-base leading-snug group-hover:text-emerald-600 transition-colors line-clamp-2">
              <Link href={`/campaigns/${campaign._id || campaign.id}`}>{campaign.title}</Link>
            </h3>
          </div>

          {/* Progress Bar & Stats */}
          <div className="space-y-2.5 pt-3 border-t border-slate-100">
            <div className="flex justify-between items-baseline text-xs font-extrabold">
              <span className="text-emerald-600 text-sm font-black">{raised.toLocaleString()} <span className="text-xs font-bold">Cr</span></span>
              <span className="text-slate-400 font-medium">Goal: {goal.toLocaleString()} Cr</span>
            </div>

            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/50">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 rounded-full transition-all duration-700 ease-out shadow-xs"
                style={{ width: `${percentage}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-[11px] text-slate-500 font-semibold pt-1">
              <span className="flex items-center space-x-1.5 px-2 py-0.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200/60">
                <Coins className="w-3 h-3 text-amber-500 shrink-0" />
                <span>Min: {minContribution} Cr</span>
              </span>
              <span className="flex items-center space-x-1.5 px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 border border-slate-200/60">
                <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                <span>{deadlineDate}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="p-4 bg-slate-50/80 border-t border-slate-100/80">
        <Link href={`/campaigns/${campaign._id || campaign.id}`}>
          <button className="w-full py-2.5 px-4 rounded-2xl bg-white hover:bg-slate-900 text-slate-800 hover:text-white font-extrabold text-xs border border-slate-200 hover:border-slate-900 flex items-center justify-center space-x-2 transition-all shadow-xs group-hover:shadow-md min-h-[44px]">
            <span>View Campaign</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </Link>
      </div>
    </motion.div>
  );
};

export default CampaignCard;

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Coins, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Button from '../ui/Button';
import { fadeInUp, staggerContainer } from '../../constants/animations';

export const HowItWorks = () => {
  const steps = [
    {
      step: '01',
      title: 'Discover Verified Causes',
      subtitle: 'Browse Impactful Projects',
      description: 'Search and filter active campaigns across medical relief, clean energy, youth education, and open technology innovation.',
      icon: Compass,
      gradient: 'from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30 shadow-emerald-500/10',
    },
    {
      step: '02',
      title: 'Pledge Credits Safely',
      subtitle: 'Transparent Support',
      description: 'Back campaigns using your credit balance. Pledges are safely ledgered until campaign approval and milestone execution.',
      icon: Coins,
      gradient: 'from-amber-500/20 to-orange-500/10 text-amber-400 border-amber-500/30 shadow-amber-500/10',
    },
    {
      step: '03',
      title: 'Track Real Impact',
      subtitle: 'Audited Disbursement',
      description: 'Monitor real-time funding progress, creator updates, and audited payout disbursements for complete peace of mind.',
      icon: TrendingUp,
      gradient: 'from-indigo-500/20 to-violet-500/10 text-indigo-400 border-indigo-500/30 shadow-indigo-500/10',
    },
  ];

  return (
    <div className="relative bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-8 sm:p-14 border border-slate-800 shadow-2xl space-y-12 overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="text-center max-w-xl mx-auto space-y-3 relative z-10">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-wider backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Simple 3-Step Process</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
          How FundFlow Works
        </h2>
        <p className="text-sm text-slate-400 font-medium leading-relaxed">
          A transparent ecosystem connecting passionate creators with verified community backers.
        </p>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10"
      >
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={idx}
              variants={fadeInUp}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="group p-8 rounded-3xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 space-y-6 flex flex-col justify-between"
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className={`w-13 h-13 rounded-2xl flex items-center justify-center border bg-gradient-to-br shadow-lg ${s.gradient}`}>
                    <Icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="text-3xl font-black text-slate-700/80 font-mono tracking-tighter group-hover:text-emerald-400/40 transition-colors">{s.step}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider block">{s.subtitle}</span>
                  <h3 className="font-black text-white text-xl group-hover:text-emerald-300 transition-colors">{s.title}</h3>
                </div>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">{s.description}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="pt-2 text-center relative z-10">
        <Link href="/campaigns">
          <Button variant="primary" size="lg" icon={<ArrowRight className="w-5 h-5" />}>
            Explore Active Causes Now
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default HowItWorks;

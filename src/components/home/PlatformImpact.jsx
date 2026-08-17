'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, ShieldCheck, Globe, Sparkles } from 'lucide-react';
import { fadeInUp, staggerContainer } from '../../constants/animations';

export const PlatformImpact = () => {
  const metrics = [
    { label: 'Total Funds Raised', value: '$4.8M+', subtext: 'Disbursed directly to verified causes', icon: TrendingUp, gradient: 'from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30 shadow-emerald-500/10' },
    { label: 'Generous Backers', value: '18,400+', subtext: 'Active humanitarians & supporters', icon: Users, gradient: 'from-indigo-500/20 to-violet-500/10 text-indigo-400 border-indigo-500/30 shadow-indigo-500/10' },
    { label: 'Campaign Success Rate', value: '98.5%', subtext: 'Verified milestone completions', icon: ShieldCheck, gradient: 'from-teal-500/20 to-cyan-500/10 text-teal-400 border-teal-500/30 shadow-teal-500/10' },
    { label: 'Global Communities Impacted', value: '120+', subtext: 'Across 34 countries worldwide', icon: Globe, gradient: 'from-amber-500/20 to-orange-500/10 text-amber-400 border-amber-500/30 shadow-amber-500/10' },
  ];

  return (
    <div className="relative space-y-10 py-6">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-64 bg-emerald-500/5 blur-3xl pointer-events-none rounded-full" />

      <div className="text-center max-w-2xl mx-auto space-y-3 relative z-10">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-wider backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real Impact Measurement</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
          Platform Impact in Numbers
        </h2>
        <p className="text-sm sm:text-base text-slate-400 font-medium leading-relaxed">
          Every contribution builds sustainable wells, equips medical centers, and powers educational dreams across the globe.
        </p>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10"
      >
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={idx}
              variants={fadeInUp}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="group relative bg-slate-900/80 backdrop-blur-xl p-7 rounded-3xl border border-slate-800 hover:border-slate-700 shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 space-y-5"
            >
              <div className={`w-13 h-13 rounded-2xl flex items-center justify-center border bg-gradient-to-br shadow-lg ${metric.gradient}`}>
                <Icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </div>

              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-black text-white tracking-tight group-hover:text-emerald-400 transition-colors">
                  {metric.value}
                </div>
                <div className="text-sm font-extrabold text-slate-200 pt-1">{metric.label}</div>
                <div className="text-xs text-slate-400 font-medium leading-normal">{metric.subtext}</div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default PlatformImpact;

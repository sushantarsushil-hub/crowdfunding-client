'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Rocket, Heart, ArrowRight } from 'lucide-react';
import Button from '../ui/Button';

export const CallToAction = () => {
  return (
    <div className="relative rounded-3xl bg-gradient-to-tr from-slate-900 via-slate-850 to-emerald-950 text-white p-8 sm:p-14 overflow-hidden border border-slate-800 shadow-2xl">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-3xl mx-auto text-center space-y-6"
      >
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-extrabold uppercase tracking-wider">
          <Rocket className="w-4 h-4" />
          <span>Empower Real Causes</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-white">
          Ready to Make a Lasting Community Difference?
        </h2>

        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto font-medium leading-relaxed">
          Whether you are launching a social initiative or backing emergency relief, FundFlow ensures 100% credit-backed transparency.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link href="/register">
            <Button variant="primary" size="lg" icon={<Heart className="w-5 h-5 fill-white" />}>
              Get Started with 50 Free Credits
            </Button>
          </Link>
          <Link href="/dashboard/creator/campaigns/new">
            <Button
              variant="darkOutline"
              size="lg"
              icon={<ArrowRight className="w-5 h-5" />}
            >
              Start a Campaign
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default CallToAction;

'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Cpu, Palette, HeartHandshake, Stethoscope, GraduationCap, TreePine, ArrowRight } from 'lucide-react';

export const ExploreCategories = () => {
  const categories = [
    {
      id: 'Tech',
      name: 'Technology',
      description: 'Open-source software, AI tools & community hardware labs',
      count: '140 Causes',
      icon: Cpu,
      color: 'text-teal-600 bg-teal-50 border-teal-100 hover:border-teal-300',
    },
    {
      id: 'Creative',
      name: 'Art & Media',
      description: 'Documentaries, public art installations & indie publishing',
      count: '112 Causes',
      icon: Palette,
      color: 'text-amber-600 bg-amber-50 border-amber-100 hover:border-amber-300',
    },
    {
      id: 'Community',
      name: 'Community',
      description: 'Disaster shelters, warm meal programs & local relief',
      count: '290 Causes',
      icon: HeartHandshake,
      color: 'text-sky-600 bg-sky-50 border-sky-100 hover:border-sky-300',
    },
    {
      id: 'Medical',
      name: 'Health & Medical',
      description: 'Emergency surgeries, pediatric care & clinic equipment',
      count: '342 Causes',
      icon: Stethoscope,
      color: 'text-rose-600 bg-rose-50 border-rose-100 hover:border-rose-300',
    },
    {
      id: 'Education',
      name: 'Education',
      description: 'Digital hubs, student laptops & school supplies',
      count: '215 Causes',
      icon: GraduationCap,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100 hover:border-indigo-300',
    },
    {
      id: 'Environment',
      name: 'Environment',
      description: 'Solar water wells, clean energy & reforestation',
      count: '188 Causes',
      icon: TreePine,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100 hover:border-emerald-300',
    },
  ];

  return (
    <div className="space-y-8 py-4">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 uppercase tracking-wider">
          Diverse Initiatives
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Explore by Category
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Find campaigns aligning with your vision and make a targeted impact.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <Link
                href={`/campaigns?category=${cat.id}`}
                className={`p-6 rounded-3xl border bg-white flex flex-col justify-between space-y-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group block ${cat.color}`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center border shadow-xs bg-white">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                    {cat.count}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 text-lg group-hover:text-emerald-600 transition-colors flex items-center justify-between">
                    <span>{cat.name}</span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">{cat.description}</p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ExploreCategories;

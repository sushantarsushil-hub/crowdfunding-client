'use client';

import React from 'react';

export const StatsCard = ({ title, value, subtitle, icon: Icon, color = 'emerald' }) => {
  const colorMap = {
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between space-x-4">
      <div className="space-y-1">
        <span className="text-xs font-semibold text-slate-500">{title}</span>
        <div className="text-2xl font-extrabold text-slate-900">{value}</div>
        {subtitle && <p className="text-[11px] text-slate-400">{subtitle}</p>}
      </div>
      {Icon && (
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0 ${colorMap[color] || colorMap.emerald}`}>
          <Icon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
};

export default StatsCard;

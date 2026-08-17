'use client';

import React from 'react';
import { Layers } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = Layers,
  title = 'No records found',
  description = 'There are no active items available for this view at the moment.',
  action,
  className = '',
}) => {
  return (
    <div
      className={`min-h-[260px] w-full bg-white rounded-3xl border border-slate-200 border-dashed p-8 flex flex-col items-center justify-center text-center space-y-3 ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">
        <Icon className="w-7 h-7" />
      </div>
      <div className="max-w-md space-y-1">
        <h3 className="font-extrabold text-slate-800 text-sm">{title}</h3>
        <p className="text-xs text-slate-500 font-medium leading-relaxed">{description}</p>
      </div>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
};

export default EmptyState;

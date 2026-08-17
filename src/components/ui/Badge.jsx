'use client';

import React from 'react';

export const Badge = ({ children, variant = 'neutral', size = 'md', className = '', icon: Icon }) => {
  const variants = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    error: 'bg-rose-50 text-rose-700 border-rose-200',
    info: 'bg-sky-50 text-sky-700 border-sky-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    primary: 'bg-emerald-600 text-white border-emerald-500',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 rounded-md gap-1',
    md: 'text-xs px-2.5 py-1 rounded-full gap-1.5 font-bold uppercase tracking-wider',
    lg: 'text-xs px-3.5 py-1.5 rounded-full gap-2 font-extrabold uppercase tracking-wider',
  };

  return (
    <span className={`inline-flex items-center border font-semibold ${variants[variant] || variants.neutral} ${sizes[size] || sizes.md} ${className}`}>
      {Icon && <Icon className="w-3 h-3 shrink-0" />}
      <span>{children}</span>
    </span>
  );
};

export default Badge;

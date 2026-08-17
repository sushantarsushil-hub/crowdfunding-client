'use client';

import React from 'react';

export const Progress = ({ value = 0, max = 100, label, showValue = true, className = '' }) => {
  const percentage = Math.min(Math.max(Math.round((value / max) * 100), 0), 100);

  return (
    <div className={`space-y-1.5 w-full ${className}`}>
      {(label || showValue) && (
        <div className="flex justify-between items-center text-xs font-bold text-slate-700">
          {label && <span>{label}</span>}
          {showValue && <span className="text-emerald-600 font-mono">{percentage}%</span>}
        </div>
      )}
      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default Progress;

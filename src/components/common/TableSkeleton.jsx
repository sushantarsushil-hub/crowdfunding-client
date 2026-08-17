'use client';

import React from 'react';
import Skeleton from './Skeleton';

export const TableSkeleton = ({ rows = 5, cols = 5 }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
        <Skeleton className="w-32 h-4 rounded-lg" />
        <Skeleton className="w-20 h-4 rounded-lg" />
      </div>
      <div className="p-4 space-y-4">
        {Array.from({ length: rows }).map((_, rIdx) => (
          <div key={rIdx} className="flex items-center justify-between space-x-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
            {Array.from({ length: cols }).map((_, cIdx) => (
              <Skeleton key={cIdx} className="h-4 flex-1 rounded-lg" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableSkeleton;

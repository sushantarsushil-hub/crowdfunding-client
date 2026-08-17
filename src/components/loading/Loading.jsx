'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loading = ({ message = 'Loading contents...' }) => {
  return (
    <div className="min-h-[300px] w-full flex flex-col items-center justify-center space-y-3 text-slate-500">
      <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      <p className="text-xs font-semibold animate-pulse">{message}</p>
    </div>
  );
};

export default Loading;

'use client';

import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

export const PageLoader = ({
  message = 'Loading content...',
  fullPage = false,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  const content = (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center">
      <div className="relative flex items-center justify-center">
        <Loader2 className={`${sizeClasses[size] || sizeClasses.md} animate-spin text-emerald-600`} />
        <div className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping" style={{ animationDuration: '1.5s' }} />
      </div>
      <div className="space-y-1">
        <p className="text-xs font-bold text-slate-700 animate-pulse">{message}</p>
        <p className="text-[11px] text-slate-400 font-medium">Please wait while we connect to backend services</p>
      </div>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 max-w-sm w-full mx-4">
          {content}
        </div>
      </div>
    );
  }

  return <div className="w-full flex justify-center items-center py-20">{content}</div>;
};

export default PageLoader;
